'use strict';

const broadcastService = require('../../../services/broadcast');
const userService = require('../../../services/user');
const prisma = require('../../../database/client');
const kb = require('../../../utils/keyboard');
const msg = require('../../../utils/message');
const logger = require('../../../utils/logger');
const { formatNumber } = require('../../../utils/formatter');

/**
 * ================================================================
 * ADMIN BROADCAST HANDLER
 * ================================================================
 */

async function showBroadcastPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, '📢 <b>Broadcast Pesan</b>\n\nPilih jenis broadcast:', {
    parse_mode: 'HTML',
    ...kb.adminBroadcastPanel(),
  });
}

async function promptBroadcastText(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'broadcast_text' };

  await safeEdit(ctx,
    '📝 <b>Broadcast Teks</b>\n\nMasukkan pesan yang ingin dikirim:\n\n<i>Mendukung HTML formatting (bold, italic, code, dll)</i>',
    { parse_mode: 'HTML', ...kb.backButton('adm:broadcast') },
  );
}

async function promptBroadcastImage(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'broadcast_image_url' };

  await safeEdit(ctx,
    '🖼️ <b>Broadcast dengan Gambar</b>\n\nMasukkan URL gambar terlebih dahulu:',
    { parse_mode: 'HTML', ...kb.backButton('adm:broadcast') },
  );
}

async function handleBroadcastInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session) return false;

  if (session.type === 'broadcast_text') {
    const message = ctx.message.text.trim();
    const totalUsers = await userService.count();
    ctx.session.adminAction = { type: 'broadcast_text_confirm', message };

    await ctx.reply(msg.broadcastConfirmMessage(message.substring(0, 200), totalUsers, false), {
      parse_mode: 'HTML',
      ...kb.confirmAction('adm:bc:confirm', 'adm:broadcast'),
    });
    return true;
  }

  if (session.type === 'broadcast_image_url') {
    const imageUrl = ctx.message.text.trim();
    ctx.session.adminAction = { type: 'broadcast_image_caption', imageUrl };
    await ctx.reply('Sekarang masukkan caption/teks untuk gambar:', { parse_mode: 'HTML' });
    return true;
  }

  if (session.type === 'broadcast_image_caption') {
    const caption = ctx.message.text.trim();
    const imageUrl = session.imageUrl;
    const totalUsers = await userService.count();

    ctx.session.adminAction = { type: 'broadcast_photo_confirm', imageUrl, caption };

    await ctx.reply(msg.broadcastConfirmMessage(caption.substring(0, 200), totalUsers, true), {
      parse_mode: 'HTML',
      ...kb.confirmAction('adm:bc:confirm', 'adm:broadcast'),
    });
    return true;
  }

  return false;
}

async function confirmBroadcast(ctx) {
  await ctx.answerCbQuery('⏳ Broadcast sedang dikirim...').catch(() => {});
  const session = ctx.session?.adminAction;
  if (!session) return;

  ctx.session.adminAction = null;

  const telegramIds = await userService.getAllTelegramIds();
  await safeEdit(ctx, `📢 <b>Broadcast Dimulai</b>\n\nMengirim ke <b>${formatNumber(telegramIds.length)}</b> user...`, {
    parse_mode: 'HTML',
  });

  let result;
  if (session.type === 'broadcast_text_confirm') {
    result = await broadcastService.broadcastText(ctx.telegram ? { telegram: ctx.telegram } : ctx, telegramIds, session.message);
  } else if (session.type === 'broadcast_photo_confirm') {
    result = await broadcastService.broadcastPhoto({ telegram: ctx.telegram }, telegramIds, session.imageUrl, session.caption);
  } else {
    return;
  }

  // Simpan record broadcast
  await prisma.broadcast.create({
    data: {
      message: session.message || session.caption || '',
      imageUrl: session.imageUrl || null,
      totalSent: result.sent,
      totalFailed: result.failed,
      sentBy: BigInt(ctx.from.id),
      sentAt: new Date(),
    },
  });

  await ctx.reply(
    `✅ <b>Broadcast Selesai!</b>\n\n` +
    `✅ Terkirim: <b>${formatNumber(result.sent)}</b>\n` +
    `❌ Gagal: <b>${formatNumber(result.failed)}</b>`,
    { parse_mode: 'HTML', ...kb.backButton('adm:broadcast') },
  );
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showBroadcastPanel,
  promptBroadcastText,
  promptBroadcastImage,
  handleBroadcastInput,
  confirmBroadcast,
};
