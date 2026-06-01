'use strict';

const prisma = require('../../../database/client');
const kb = require('../../../utils/keyboard');
const logger = require('../../../utils/logger');

/**
 * ================================================================
 * ADMIN CHANNEL HANDLER
 * ================================================================
 */

async function showChannelPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const channels = await prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });

  await safeEdit(ctx, `📣 <b>Kelola Channel Wajib Join</b>\n\nTotal: ${channels.length} channel`, {
    parse_mode: 'HTML',
    ...kb.adminChannelPanel(channels),
  });
}

async function showChannelDetail(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const channelId = ctx.callbackQuery.data.split(':')[3];
  const channel = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!channel) return;

  const { Markup } = require('telegraf');
  await safeEdit(ctx,
    `📣 <b>Detail Channel</b>\n\n` +
    `📢 <b>Nama:</b> ${channel.channelName}\n` +
    `🆔 <b>Channel ID:</b> <code>${channel.channelId}</code>\n` +
    `🔗 <b>Link:</b> ${channel.inviteLink}\n` +
    `✅ <b>Status:</b> ${channel.isActive ? 'Aktif' : 'Nonaktif'}`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            channel.isActive ? '🔴 Nonaktifkan' : '🟢 Aktifkan',
            `adm:ch:toggle:${channelId}`,
          ),
          Markup.button.callback('🗑️ Hapus', `adm:ch:del:${channelId}`),
        ],
        [Markup.button.callback('⬅️ Daftar Channel', 'adm:channel')],
      ]),
    },
  );
}

async function promptAddChannel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_channel', step: 'id' };

  await safeEdit(ctx,
    `➕ <b>Tambah Channel</b>\n\nMasukkan Channel ID atau username:\n(contoh: @mychannel atau -100xxxxxxxxx)\n\n⚠️ Pastikan bot sudah menjadi admin di channel tersebut!`,
    { parse_mode: 'HTML', ...kb.backButton('adm:channel') },
  );
}

async function handleAddChannelInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_channel') return false;

  const text = ctx.message.text.trim();

  if (session.step === 'id') {
    session.channelId = text;
    session.step = 'name';
    await ctx.reply('Masukkan nama tampilan channel:');
    return true;
  }

  if (session.step === 'name') {
    session.channelName = text;
    session.step = 'link';
    await ctx.reply('Masukkan invite link channel (https://t.me/...):');
    return true;
  }

  if (session.step === 'link') {
    const inviteLink = text;
    const channelId = session.channelId;
    const channelName = session.channelName;

    ctx.session.adminAction = null;

    // Cek apakah sudah ada
    const existing = await prisma.channel.findUnique({ where: { channelId } });
    if (existing) {
      await ctx.reply('⚠️ Channel ini sudah ditambahkan.');
      return true;
    }

    await prisma.channel.create({ data: { channelId, channelName, inviteLink } });
    await ctx.reply(
      `✅ <b>Channel berhasil ditambahkan!</b>\n\n📢 ${channelName}`,
      { parse_mode: 'HTML' },
    );

    return true;
  }

  return false;
}

async function toggleChannel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const id = ctx.callbackQuery.data.split(':')[3];
  const channel = await prisma.channel.findUnique({ where: { id } });
  if (!channel) return;

  await prisma.channel.update({ where: { id }, data: { isActive: !channel.isActive } });
  await ctx.answerCbQuery(channel.isActive ? '❌ Channel dinonaktifkan.' : '✅ Channel diaktifkan.');
  await showChannelDetail(ctx);
}

async function deleteChannel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const id = ctx.callbackQuery.data.split(':')[3];
  await prisma.channel.delete({ where: { id } });
  await ctx.answerCbQuery('✅ Channel dihapus.');
  await showChannelPanel(ctx);
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showChannelPanel,
  showChannelDetail,
  promptAddChannel,
  handleAddChannelInput,
  toggleChannel,
  deleteChannel,
};
