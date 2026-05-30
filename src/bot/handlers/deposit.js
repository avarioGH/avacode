'use strict';

const userService = require('../../services/user');
const voucherService = require('../../services/voucher');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');
const { formatCurrency } = require('../../utils/formatter');
const paymentService = require('../../services/payment');
const settingsService = require('../../services/settings');
const config = require('../../config');
const prisma = require('../../database/client');

/**
 * ================================================================
 * DEPOSIT HANDLER
 * ================================================================
 */

/**
 * Tampilkan menu deposit
 */
async function handleDeposit(ctx) {
  try {
    await ctx.answerCbQuery();
    const freshUser = await userService.getById(ctx.dbUser.id);
    await safeEdit(ctx, msg.depositMessage(freshUser), {
      parse_mode: 'HTML',
      ...kb.depositMethodSelect(),
    });
  } catch (error) {
    logger.error('handleDeposit error:', error.message);
  }
}

/**
 * User input nominal deposit
 */
async function handleDepositMethod(ctx) {
  try {
    await ctx.answerCbQuery();
    const gateway = ctx.callbackQuery.data.split(':')[1]; // paydisini | pakasir

    ctx.session = ctx.session || {};
    ctx.session.depositGateway = gateway;
    ctx.session.awaitingDepositAmount = true;

    await safeEdit(ctx,
      `💰 <b>Deposit Saldo - ${gateway.charAt(0).toUpperCase() + gateway.slice(1)}</b>\n\n` +
      `Masukkan nominal deposit (minimal Rp10.000):\n\n` +
      `<i>Contoh: 50000</i>`,
      {
        parse_mode: 'HTML',
        ...kb.backButton('menu:deposit', '⬅️ Kembali'),
      },
    );
  } catch (error) {
    logger.error('handleDepositMethod error:', error.message);
  }
}

/**
 * Handle text input nominal deposit
 */
async function handleDepositAmountInput(ctx) {
  try {
    if (!ctx.session?.awaitingDepositAmount) return false;

    const text = ctx.message.text.trim();
    const amount = parseInt(text.replace(/[^0-9]/g, ''));

    if (isNaN(amount) || amount < 10000) {
      await ctx.reply('❌ Nominal tidak valid. Minimal deposit Rp10.000.', {
        parse_mode: 'HTML',
      });
      return true;
    }

    ctx.session.awaitingDepositAmount = false;
    const gateway = ctx.session.depositGateway || 'paydisini';

    // Ambil channel
    let channels;
    if (gateway === 'paydisini') {
      channels = config.paydisini.channels;
    } else {
      channels = Object.keys(require('../../services/payment/pakasir').CHANNEL_CODES);
    }

    ctx.session.depositAmount = amount;

    await ctx.reply(
      `💰 <b>Pilih Metode Pembayaran</b>\n\nNominal: <b>${formatCurrency(amount)}</b>`,
      {
        parse_mode: 'HTML',
        ...require('../../utils/keyboard').paymentChannelSelect(`dep_${gateway}`, 'deposit', channels),
      },
    );

    return true;
  } catch (error) {
    logger.error('handleDepositAmountInput error:', error.message);
    return false;
  }
}

/**
 * Buat invoice deposit
 * Callback: paych:dep_gateway:channel:deposit
 */
async function handleCreateDepositInvoice(ctx) {
  try {
    await ctx.answerCbQuery('⏳ Membuat invoice...');
    const parts = ctx.callbackQuery.data.split(':');
    const fullGateway = parts[1]; // dep_paydisini | dep_pakasir
    const channel = parts[2];
    const gateway = fullGateway.replace('dep_', '');

    const user = ctx.dbUser;
    const amount = ctx.session?.depositAmount;

    if (!amount) {
      await ctx.answerCbQuery('Nominal deposit tidak valid.', { show_alert: true });
      return;
    }

    // Buat deposit record
    const expiredAt = new Date(Date.now() + config.payment.expiryMinutes * 60 * 1000);
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        amount,
        gateway,
        channel,
        status: 'PENDING',
        expiredAt,
      },
    });

    // Buat payment di gateway
    const paymentResult = await paymentService.createPayment(gateway, {
      transactionId: deposit.id, // pakai deposit id
      userId: user.id,
      amount,
      channel,
      note: `Deposit Saldo`,
    });

    // Update deposit dengan payment info
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        gatewayTrxId: paymentResult.payment.gatewayTrxId,
        paymentUrl: paymentResult.payment.paymentUrl,
        qrCode: paymentResult.payment.qrCode,
      },
    });

    const { Markup } = require('telegraf');
    const buttons = [];
    if (paymentResult.payment.paymentUrl) {
      buttons.push([Markup.button.url('💳 Bayar Sekarang', paymentResult.payment.paymentUrl)]);
    }
    buttons.push([Markup.button.callback('🔄 Cek Status', `dep:check:${deposit.id}`)]);
    buttons.push([Markup.button.callback('🏠 Menu Utama', 'menu:main')]);

    await safeEdit(ctx,
      `🧾 <b>Invoice Deposit</b>\n\n` +
      `💰 <b>Nominal:</b> ${formatCurrency(amount)}\n` +
      `💳 <b>Via:</b> ${gateway} - ${channel}\n` +
      `⌛ <b>Batas Waktu:</b> ${new Date(expiredAt).toLocaleString('id-ID')}\n\n` +
      `Selesaikan pembayaran dan tekan <b>Cek Status</b>.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons),
      },
    );

    ctx.session.depositAmount = null;
  } catch (error) {
    logger.error('handleCreateDepositInvoice error:', error.message);
    await ctx.answerCbQuery(error.message || 'Gagal membuat invoice.', { show_alert: true });
  }
}

/**
 * Cek status deposit
 */
async function handleCheckDeposit(ctx) {
  try {
    await ctx.answerCbQuery('⏳ Mengecek...');
    const depositId = ctx.callbackQuery.data.split(':')[2];

    const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
    if (!deposit || deposit.userId !== ctx.dbUser.id) {
      await ctx.answerCbQuery('Deposit tidak ditemukan.', { show_alert: true });
      return;
    }

    if (deposit.status === 'PAID') {
      await ctx.answerCbQuery('✅ Deposit sudah berhasil!', { show_alert: true });
      return;
    }

    // Poll dari gateway — cek payment record yang menggunakan deposit.id sebagai transactionId
    const payment = await prisma.payment.findFirst({
      where: { transactionId: depositId, gateway: deposit.gateway },
    });

    if (!payment) {
      await ctx.answerCbQuery('⏳ Pembayaran belum diterima.', { show_alert: true });
      return;
    }

    const paid = await paymentService.pollStatus(deposit.gateway, depositId);

    if (paid) {
      // Tambah saldo user
      await userService.addBalance(deposit.userId, parseFloat(deposit.amount), 'Deposit saldo');
      await prisma.deposit.update({
        where: { id: depositId },
        data: { status: 'PAID', paidAt: new Date() },
      });

      await safeEdit(ctx,
        `✅ <b>Deposit Berhasil!</b>\n\n` +
        `💰 <b>Nominal:</b> ${formatCurrency(deposit.amount)}\n\n` +
        `Saldo kamu telah ditambahkan!`,
        { parse_mode: 'HTML', ...kb.backToMain() },
      );
    } else {
      await ctx.answerCbQuery('⏳ Pembayaran belum diterima. Harap selesaikan.', { show_alert: true });
    }
  } catch (error) {
    logger.error('handleCheckDeposit error:', error.message);
    await ctx.answerCbQuery('Gagal cek status.', { show_alert: true });
  }
}

/**
 * Voucher input handler
 */
async function handleVoucherMenu(ctx) {
  try {
    await ctx.answerCbQuery();
    ctx.session = ctx.session || {};
    ctx.session.awaitingVoucher = true;

    await safeEdit(ctx,
      `🎟️ <b>Kode Promo / Voucher</b>\n\n` +
      `Masukkan kode promo yang kamu miliki:\n\n` +
      `<i>Voucher akan diterapkan pada pembelian berikutnya.</i>`,
      { parse_mode: 'HTML', ...kb.backToMain() },
    );
  } catch (error) {
    logger.error('handleVoucherMenu error:', error.message);
  }
}

/**
 * Handle input kode voucher
 */
async function handleVoucherInput(ctx) {
  try {
    if (!ctx.session?.awaitingVoucher) return false;

    const code = ctx.message.text.trim().toUpperCase();
    ctx.session.awaitingVoucher = false;

    // Validasi dengan subtotal 0 dulu (cek dasar)
    const voucherResult = await voucherService.validate(code, 999999999).catch((e) => {
      throw new Error(e.message);
    });

    ctx.session.pendingVoucher = {
      code,
      voucherId: voucherResult.voucher.id,
    };

    const typeLabel = voucherResult.voucher.type === 'PERCENTAGE'
      ? `${voucherResult.voucher.value}%`
      : formatCurrency(voucherResult.voucher.value);

    await ctx.reply(
      `✅ <b>Voucher Valid!</b>\n\n` +
      `🎟️ Kode: <code>${code}</code>\n` +
      `💸 Diskon: <b>${typeLabel}</b>\n\n` +
      `Voucher akan diterapkan pada pembelian selanjutnya.`,
      { parse_mode: 'HTML', ...kb.backToMain() },
    );

    return true;
  } catch (error) {
    await ctx.reply(`❌ ${error.message}`, { parse_mode: 'HTML' });
    return true;
  }
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  handleDeposit,
  handleDepositMethod,
  handleDepositAmountInput,
  handleCreateDepositInvoice,
  handleCheckDeposit,
  handleVoucherMenu,
  handleVoucherInput,
};
