'use strict';

const prisma = require('../../database/client');
const logger = require('../../utils/logger');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');

/**
 * ================================================================
 * CHANNEL CHECK MIDDLEWARE
 * Validasi user sudah join channel wajib
 * ================================================================
 */

/**
 * Cek apakah user sudah join ke channel
 * @param {Object} bot - Telegraf bot instance
 * @param {string} channelId - ID channel (contoh: @mychannel atau -100xxxxx)
 * @param {number} userId - Telegram user ID
 * @returns {Promise<boolean>}
 */
async function checkUserJoined(bot, channelId, userId) {
  try {
    const member = await bot.telegram.getChatMember(channelId, userId);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch (error) {
    // Jika channel tidak ditemukan atau bot tidak ada di channel
    logger.warn('checkUserJoined error:', { channelId, userId, error: error.message });
    return true; // Default allow jika tidak bisa cek
  }
}

/**
 * Middleware: cek join channel wajib
 * Skip untuk callback query 'channel:verify'
 */
function channelCheck() {
  return async (ctx, next) => {
    // Skip untuk callback verify channel
    if (ctx.callbackQuery?.data === 'channel:verify') {
      return next();
    }

    // Skip jika admin/owner
    const { isAdmin } = require('./auth');
    if (await isAdmin(ctx.from?.id)) return next();

    try {
      // Ambil channel aktif dari DB
      const channels = await prisma.channel.findMany({
        where: { isActive: true },
      });

      if (channels.length === 0) return next(); // Tidak ada channel wajib

      // Cek semua channel
      const notJoined = [];
      for (const channel of channels) {
        const joined = await checkUserJoined(ctx.telegram, channel.channelId, ctx.from.id);
        if (!joined) notJoined.push(channel);
      }

      if (notJoined.length === 0) return next();

      // User belum join
      const message = msg.channelJoinRequired();
      const keyboard = kb.joinChannel(notJoined);

      if (ctx.callbackQuery) {
        await ctx.answerCbQuery();
        await ctx.reply(message, { parse_mode: 'HTML', ...keyboard });
      } else {
        await ctx.reply(message, { parse_mode: 'HTML', ...keyboard });
      }

      return; // Stop chain
    } catch (error) {
      logger.error('channelCheck middleware error:', error.message);
      return next(); // Jika error, lanjutkan
    }
  };
}

/**
 * Handler: verify channel join
 */
async function handleChannelVerify(ctx) {
  try {
    await ctx.answerCbQuery();

    const channels = await prisma.channel.findMany({ where: { isActive: true } });
    if (channels.length === 0) {
      await ctx.editMessageText('✅ Tidak ada channel wajib. Silakan gunakan bot!', {
        parse_mode: 'HTML',
        ...kb.backToMain(),
      });
      return;
    }

    const notJoined = [];
    for (const channel of channels) {
      const joined = await checkUserJoined(ctx.telegram, channel.channelId, ctx.from.id);
      if (!joined) notJoined.push(channel);
    }

    if (notJoined.length === 0) {
      await ctx.editMessageText(
        '✅ <b>Verifikasi berhasil!</b>\n\nKamu sudah bergabung ke semua channel. Selamat berbelanja!',
        { parse_mode: 'HTML', ...kb.backToMain() },
      );
    } else {
      await ctx.editMessageText(
        `⚠️ Kamu belum bergabung ke:\n${notJoined.map((c) => `• ${c.channelName}`).join('\n')}\n\nSilakan bergabung terlebih dahulu.`,
        { parse_mode: 'HTML', ...kb.joinChannel(notJoined) },
      );
    }
  } catch (error) {
    logger.error('handleChannelVerify error:', error.message);
    await ctx.answerCbQuery('Terjadi kesalahan. Coba lagi.', { show_alert: true });
  }
}

module.exports = { channelCheck, handleChannelVerify, checkUserJoined };
