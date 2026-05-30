'use strict';

const voucherService = require('../../../services/voucher');
const kb = require('../../../utils/keyboard');
const logger = require('../../../utils/logger');
const { formatCurrency, formatDate } = require('../../../utils/formatter');

/**
 * ================================================================
 * ADMIN VOUCHER HANDLER
 * ================================================================
 */

async function showVoucherPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, '🎟️ <b>Kelola Voucher</b>\n\nPilih tindakan:', {
    parse_mode: 'HTML',
    ...kb.adminVoucherPanel(),
  });
}

async function showVoucherList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const { vouchers, total } = await voucherService.getAll();

  if (vouchers.length === 0) {
    await safeEdit(ctx, '🎟️ Belum ada voucher.', {
      parse_mode: 'HTML',
      ...kb.backButton('adm:voucher'),
    });
    return;
  }

  const { Markup } = require('telegraf');
  const buttons = vouchers.map((v) => [
    Markup.button.callback(
      `${v.isActive ? '✅' : '❌'} ${v.code} (${v.type === 'PERCENTAGE' ? `${v.value}%` : formatCurrency(v.value)})`,
      `adm:voucher:view:${v.id}`,
    ),
  ]);
  buttons.push([Markup.button.callback('⬅️ Kelola Voucher', 'adm:voucher')]);

  await safeEdit(ctx, `🎟️ <b>Daftar Voucher</b> (${total})\n\nPilih voucher:`, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(buttons),
  });
}

async function showVoucherDetail(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const { vouchers } = await voucherService.getAll();
  const voucherId = ctx.callbackQuery.data.split(':')[3];
  const prisma = require('../../../database/client');
  const voucher = await prisma.voucher.findUnique({ where: { id: voucherId } });
  if (!voucher) return;

  await safeEdit(ctx,
    `🎟️ <b>Detail Voucher</b>\n\n` +
    `🔑 <b>Kode:</b> <code>${voucher.code}</code>\n` +
    `💸 <b>Tipe:</b> ${voucher.type === 'PERCENTAGE' ? 'Persentase' : 'Nominal'}\n` +
    `💰 <b>Nilai:</b> ${voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}\n` +
    `${voucher.maxDiscount ? `📉 <b>Maks Diskon:</b> ${formatCurrency(voucher.maxDiscount)}\n` : ''}` +
    `🛒 <b>Min Pembelian:</b> ${formatCurrency(voucher.minPurchase)}\n` +
    `🔢 <b>Penggunaan:</b> ${voucher.usedCount}/${voucher.maxUses ?? '∞'}\n` +
    `✅ <b>Status:</b> ${voucher.isActive ? 'Aktif' : 'Nonaktif'}\n` +
    `${voucher.expiredAt ? `⌛ <b>Kadaluarsa:</b> ${formatDate(voucher.expiredAt, false)}\n` : ''}`,
    { parse_mode: 'HTML', ...kb.adminVoucherActions(voucherId, voucher.isActive) },
  );
}

async function toggleVoucher(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const voucherId = ctx.callbackQuery.data.split(':')[3];
  const voucher = await voucherService.toggle(voucherId);
  await ctx.answerCbQuery(voucher.isActive ? '✅ Voucher diaktifkan.' : '❌ Voucher dinonaktifkan.');
  await showVoucherDetail(ctx);
}

async function deleteVoucher(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const voucherId = ctx.callbackQuery.data.split(':')[3];
  await voucherService.remove(voucherId);
  await ctx.answerCbQuery('✅ Voucher dihapus.');
  await showVoucherList(ctx);
}

async function promptAddVoucher(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_voucher', step: 'code' };

  await safeEdit(ctx,
    `➕ <b>Buat Voucher Baru</b>\n\nMasukkan kode voucher (huruf kapital, tanpa spasi)\natau ketik "auto" untuk generate otomatis:`,
    { parse_mode: 'HTML', ...kb.backButton('adm:voucher') },
  );
}

async function handleAddVoucherInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_voucher') return false;

  const text = ctx.message.text.trim();

  if (session.step === 'code') {
    session.code = text.toLowerCase() === 'auto' ? null : text.toUpperCase();
    session.step = 'type';
    await ctx.reply('Pilih tipe voucher:\n1. Persentase (%)\n2. Nominal (Rp)\n\nKetik 1 atau 2:');
    return true;
  }

  if (session.step === 'type') {
    if (!['1', '2'].includes(text)) {
      await ctx.reply('❌ Pilih 1 atau 2.');
      return true;
    }
    session.type = text === '1' ? 'PERCENTAGE' : 'FIXED';
    session.step = 'value';
    await ctx.reply(`Masukkan nilai diskon (${session.type === 'PERCENTAGE' ? 'persentase, contoh: 20' : 'nominal Rp, contoh: 10000'}):`);
    return true;
  }

  if (session.step === 'value') {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(value) || value <= 0) { await ctx.reply('❌ Nilai tidak valid.'); return true; }
    session.value = value;
    session.step = 'minPurchase';
    await ctx.reply('Masukkan minimum pembelian (0 untuk tidak ada minimum):');
    return true;
  }

  if (session.step === 'minPurchase') {
    session.minPurchase = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    session.step = 'maxUses';
    await ctx.reply('Masukkan maksimal penggunaan (0 untuk unlimited):');
    return true;
  }

  if (session.step === 'maxUses') {
    const maxUses = parseInt(text) || 0;
    session.maxUses = maxUses === 0 ? null : maxUses;
    session.step = 'expiry';
    await ctx.reply('Masukkan tanggal kadaluarsa (format: YYYY-MM-DD) atau ketik "never":');
    return true;
  }

  if (session.step === 'expiry') {
    let expiredAt = null;
    if (text.toLowerCase() !== 'never') {
      expiredAt = new Date(text);
      if (isNaN(expiredAt.getTime())) {
        await ctx.reply('❌ Format tanggal tidak valid. Gunakan YYYY-MM-DD.');
        return true;
      }
    }

    const voucher = await voucherService.create({
      code: session.code,
      type: session.type,
      value: session.value,
      minPurchase: session.minPurchase || 0,
      maxUses: session.maxUses,
      expiredAt,
    });

    ctx.session.adminAction = null;

    await ctx.reply(
      `✅ <b>Voucher berhasil dibuat!</b>\n\n` +
      `🔑 Kode: <code>${voucher.code}</code>\n` +
      `💰 Diskon: ${voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}`,
      { parse_mode: 'HTML' },
    );

    return true;
  }

  return false;
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showVoucherPanel,
  showVoucherList,
  showVoucherDetail,
  toggleVoucher,
  deleteVoucher,
  promptAddVoucher,
  handleAddVoucherInput,
};
