'use strict';

const transactionService = require('../../services/transaction');
const paymentService = require('../../services/payment');
const productService = require('../../services/product');
const userService = require('../../services/user');
const voucherService = require('../../services/voucher');
const broadcastService = require('../../services/broadcast');
const settingsService = require('../../services/settings');
const activityLog = require('../../services/activityLog');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');
const config = require('../../config');
const prisma = require('../../database/client');

/**
 * ================================================================
 * PAYMENT HANDLER (USER)
 * ================================================================
 */

/**
 * Mulai proses pembelian — buat transaksi PENDING
 */
async function handleBuy(ctx) {
  try {
    await ctx.answerCbQuery();
    const productId = ctx.callbackQuery.data.split(':')[1];
    const user = ctx.dbUser;

    const product = await productService.getProductById(productId);
    if (!product) {
      await ctx.answerCbQuery('Produk tidak ditemukan.', { show_alert: true });
      return;
    }

    const stockCount = product._count?.stocks || 0;
    if (stockCount < 1) {
      await ctx.answerCbQuery('❌ Stok habis!', { show_alert: true });
      return;
    }

    // Simpan state di session
    ctx.session = ctx.session || {};
    ctx.session.pendingBuy = {
      productId,
      productName: product.name,
      price: parseFloat(product.price),
      voucherId: null,
      discount: 0,
    };

    const finalAmount = parseFloat(product.price);
    const freshUser = await userService.getById(user.id);

    await safeEdit(ctx, msg.paymentMethodMessage(product, finalAmount), {
      parse_mode: 'HTML',
      ...kb.paymentMethodSelect(
        productId,
        true,
        parseFloat(freshUser.balance),
        finalAmount,
      ),
    });
  } catch (error) {
    logger.error('handleBuy error:', error.message);
    await ctx.answerCbQuery('Terjadi kesalahan.', { show_alert: true });
  }
}

/**
 * Proses pembayaran dengan saldo
 */
async function handlePayWithBalance(ctx) {
  try {
    await ctx.answerCbQuery();
    const parts = ctx.callbackQuery.data.split(':');
    // Format: pay:balance:productId
    const productId = parts[2];
    const user = ctx.dbUser;

    const product = await productService.getProductById(productId);
    if (!product) return;

    const freshUser = await userService.getById(user.id);
    const session = ctx.session?.pendingBuy || {};
    const discount = session.discount || 0;
    const voucherId = session.voucherId || null;
    const finalAmount = parseFloat(product.price) - discount;

    if (parseFloat(freshUser.balance) < finalAmount) {
      await ctx.answerCbQuery('❌ Saldo tidak mencukupi!', { show_alert: true });
      return;
    }

    // Buat transaksi
    const transaction = await transactionService.create({
      userId: user.id,
      productId,
      quantity: 1,
      paymentMethod: 'BALANCE',
      voucherId,
      discount,
    });

    // Bayar dengan saldo
    await paymentService.balance.pay({ transaction, user: freshUser });

    // Jika voucher digunakan, increment used count
    if (voucherId) await voucherService.use(voucherId);

    // Proses deliver produk
    const result = await transactionService.processPaymentSuccess(transaction.id);

    // Kirim produk ke user
    await ctx.editMessageText(
      msg.paymentSuccessMessage(result, result.stocks),
      { parse_mode: 'HTML', ...kb.backToMain() },
    );

    // Auto post ke channel
    await autoPostTransaction(ctx, result, freshUser);

    // Bersihkan session
    ctx.session.pendingBuy = null;

    await activityLog.log({
      userId: user.id,
      action: 'PAYMENT_BALANCE',
      description: `Bayar dengan saldo: ${product.name}`,
      metadata: { transactionId: transaction.id, amount: finalAmount },
    });
  } catch (error) {
    logger.error('handlePayWithBalance error:', error.message);
    await ctx.answerCbQuery(error.message || 'Gagal memproses pembayaran.', { show_alert: true });
  }
}

/**
 * Tampilkan pilihan channel Paydisini
 */
async function handlePaydisiniSelect(ctx) {
  try {
    await ctx.answerCbQuery();
    const productId = ctx.callbackQuery.data.split(':')[2];
    const channels = config.paydisini.channels;

    await safeEdit(ctx,
      '💳 <b>Pilih Metode Pembayaran Paydisini</b>\n\nPilih metode yang kamu inginkan:',
      {
        parse_mode: 'HTML',
        ...kb.paymentChannelSelect('paydisini', productId, channels),
      },
    );
  } catch (error) {
    logger.error('handlePaydisiniSelect error:', error.message);
  }
}

/**
 * Tampilkan pilihan channel Pakasir
 */
async function handlePakasirSelect(ctx) {
  try {
    await ctx.answerCbQuery();
    const productId = ctx.callbackQuery.data.split(':')[2];
    const channels = Object.keys(require('../../services/payment/pakasir').CHANNEL_CODES);

    await safeEdit(ctx,
      '💳 <b>Pilih Metode Pembayaran Pakasir</b>\n\nPilih metode yang kamu inginkan:',
      {
        parse_mode: 'HTML',
        ...kb.paymentChannelSelect('pakasir', productId, channels),
      },
    );
  } catch (error) {
    logger.error('handlePakasirSelect error:', error.message);
  }
}

/**
 * Buat invoice pembayaran (Paydisini / Pakasir)
 * Callback: paych:gateway:channel:productId
 */
async function handleCreateInvoice(ctx) {
  try {
    await ctx.answerCbQuery('⏳ Membuat invoice...');
    const parts = ctx.callbackQuery.data.split(':');
    // paych:gateway:channel:productId
    const gateway = parts[1];
    const channel = parts[2];
    const productId = parts[3];
    const user = ctx.dbUser;

    const product = await productService.getProductById(productId);
    if (!product) {
      await ctx.answerCbQuery('Produk tidak ditemukan.', { show_alert: true });
      return;
    }

    const session = ctx.session?.pendingBuy || {};
    const discount = session.discount || 0;
    const voucherId = session.voucherId || null;
    const finalAmount = Math.max(parseFloat(product.price) - discount, 0);

    // Buat transaksi
    const transaction = await transactionService.create({
      userId: user.id,
      productId,
      quantity: 1,
      paymentMethod: gateway.toUpperCase(),
      voucherId,
      discount,
    });

    // Buat payment di gateway
    const { payment, paymentData } = await paymentService.createPayment(gateway, {
      transactionId: transaction.id,
      userId: user.id,
      amount: finalAmount,
      channel,
      note: `Pembelian ${product.name}`,
    });

    const freshTrx = await transactionService.getById(transaction.id);

    await safeEdit(ctx, msg.paymentInvoiceMessage(freshTrx, payment, `${gateway} - ${channel}`), {
      parse_mode: 'HTML',
      ...kb.paymentStatus(transaction.id, payment.paymentUrl),
    });

    // Bersihkan session
    if (ctx.session) ctx.session.pendingBuy = null;

    await activityLog.log({
      userId: user.id,
      action: `PAYMENT_${gateway.toUpperCase()}`,
      description: `Buat invoice ${gateway}: ${product.name}`,
      metadata: { transactionId: transaction.id, amount: finalAmount, channel },
    });
  } catch (error) {
    logger.error('handleCreateInvoice error:', error.message);
    await ctx.answerCbQuery(error.message || 'Gagal membuat invoice.', { show_alert: true });
  }
}

/**
 * Cek status pembayaran manual
 */
async function handleCheckPayment(ctx) {
  try {
    await ctx.answerCbQuery('⏳ Mengecek status...');
    const transactionId = ctx.callbackQuery.data.split(':')[2];
    const transaction = await transactionService.getById(transactionId);

    if (!transaction) {
      await ctx.answerCbQuery('Transaksi tidak ditemukan.', { show_alert: true });
      return;
    }

    // Verifikasi transaksi milik user ini
    if (transaction.userId !== ctx.dbUser.id) {
      await ctx.answerCbQuery('❌ Bukan transaksi kamu.', { show_alert: true });
      return;
    }

    if (transaction.status === 'DELIVERED') {
      await ctx.answerCbQuery('✅ Produk sudah terkirim!', { show_alert: true });
      return;
    }

    if (transaction.status === 'EXPIRED') {
      await safeEdit(ctx, '⌛ Transaksi sudah kadaluarsa.', { parse_mode: 'HTML', ...kb.backToMain() });
      return;
    }

    // Poll dari gateway
    const gateway = transaction.payment?.gateway || 'paydisini';
    const paid = await paymentService.pollStatus(gateway, transactionId);

    if (paid) {
      // Proses deliver
      const freshTrx = await transactionService.getById(transactionId);
      if (freshTrx.status === 'PAID') {
        const result = await transactionService.processPaymentSuccess(transactionId);
        await safeEdit(ctx, msg.paymentSuccessMessage(result, result.stocks), {
          parse_mode: 'HTML',
          ...kb.backToMain(),
        });
        await autoPostTransaction(ctx, result, ctx.dbUser);
      }
    } else {
      await ctx.answerCbQuery('⏳ Pembayaran belum diterima. Harap selesaikan pembayaran.', { show_alert: true });
    }
  } catch (error) {
    logger.error('handleCheckPayment error:', error.message);
    await ctx.answerCbQuery('Gagal cek status.', { show_alert: true });
  }
}

/**
 * Cancel transaksi
 */
async function handleCancelPayment(ctx) {
  try {
    await ctx.answerCbQuery();
    const transactionId = ctx.callbackQuery.data.split(':')[2];
    const transaction = await transactionService.getById(transactionId);

    if (!transaction || transaction.userId !== ctx.dbUser.id) {
      await ctx.answerCbQuery('Transaksi tidak ditemukan.', { show_alert: true });
      return;
    }

    await transactionService.cancel(transactionId);
    await safeEdit(ctx, '❌ <b>Transaksi dibatalkan.</b>', {
      parse_mode: 'HTML',
      ...kb.backToMain(),
    });
  } catch (error) {
    logger.error('handleCancelPayment error:', error.message);
    await ctx.answerCbQuery(error.message, { show_alert: true });
  }
}

/**
 * Auto post ke channel setelah transaksi berhasil
 */
async function autoPostTransaction(ctx, transaction, user) {
  try {
    const [autoPost, channelId] = await Promise.all([
      settingsService.get('autoPostTransaction'),
      settingsService.get('postChannelId'),
    ]);

    if (autoPost === 'true' && channelId) {
      const message = require('../../utils/message').channelTransactionPost(transaction, user);
      await ctx.telegram.sendMessage(channelId, message, { parse_mode: 'HTML' }).catch(() => {});
    }
  } catch {
    // Silent
  }
}

/**
 * Helper
 */
async function safeEdit(ctx, text, options) {
  try {
    await ctx.editMessageText(text, options);
  } catch {
    await ctx.reply(text, options);
  }
}

module.exports = {
  handleBuy,
  handlePayWithBalance,
  handlePaydisiniSelect,
  handlePakasirSelect,
  handleCreateInvoice,
  handleCheckPayment,
  handleCancelPayment,
};
