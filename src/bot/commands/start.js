'use strict';

const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const settingsService = require('../../services/settings');
const referralService = require('../../services/referral');
const userService = require('../../services/user');
const activityLog = require('../../services/activityLog');
const logger = require('../../utils/logger');
const prisma = require('../../database/client');

/**
 * ================================================================
 * START COMMAND
 * ================================================================
 */

/**
 * Handler /start
 */
async function handleStart(ctx) {
  try {
    const user = ctx.dbUser;
    const startPayload = ctx.startPayload || ctx.message?.text?.split(' ')[1];

    // Proses referral jika ada
    if (startPayload?.startsWith('ref_') && user) {
      const refCode = startPayload.replace('ref_', '');
      if (refCode !== user.referralCode) {
        const result = await referralService.processReferral(user, refCode);
        if (result?.bonus > 0) {
          await ctx.reply(
            `🎁 <b>Referral Bonus!</b>\n\nKamu mendapatkan bonus <b>Rp${parseFloat(result.bonus).toLocaleString('id-ID')}</b> dari referral!`,
            { parse_mode: 'HTML' },
          );
        }
      }
    }

    // Ambil settings
    const settings = await settingsService.getMultiple(['shopName', 'shopDesc', 'bannerUrl', 'channelUrl', 'contactUrl']);

    // Ambil user terbaru dari DB
    const freshUser = await userService.getById(user?.id || '');

    // Kirim banner jika ada
    if (settings.bannerUrl) {
      try {
        await ctx.replyWithPhoto(settings.bannerUrl, {
          caption: msg.welcomeMessage(freshUser || user, settings),
          parse_mode: 'HTML',
          ...buildMainKeyboard(settings),
        });
        return;
      } catch (photoError) {
        // Fallback ke text jika foto gagal
        logger.warn('Failed to send banner photo, falling back to text', { url: settings.bannerUrl });
      }
    }

    // Kirim text message
    await ctx.reply(msg.welcomeMessage(freshUser || user, settings), {
      parse_mode: 'HTML',
      ...buildMainKeyboard(settings),
    });

    await activityLog.log({
      userId: user?.id,
      telegramId: ctx.from.id,
      action: 'START',
      description: 'User memulai bot',
    });
  } catch (error) {
    logger.error('handleStart error:', error.message);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.').catch(() => {});
  }
}

/**
 * Build main menu keyboard dengan channel URL dinamis
 */
function buildMainKeyboard(settings) {
  const { Markup } = require('telegraf');
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🛒 Beli Produk', 'menu:shop'),
      Markup.button.callback('💰 Deposit Saldo', 'menu:deposit'),
    ],
    [
      Markup.button.callback('📦 Riwayat Transaksi', 'menu:history'),
      Markup.button.callback('👤 Profil Saya', 'menu:profile'),
    ],
    [
      Markup.button.callback('🎁 Referral', 'menu:referral'),
      Markup.button.callback('🎟️ Kode Promo', 'menu:voucher'),
    ],
    [
      Markup.button.url('📢 Channel Kami', settings.channelUrl || 'https://t.me/example'),
      Markup.button.url('📞 Hubungi Admin', settings.contactUrl || 'https://t.me/admin'),
    ],
  ]);
}

/**
 * Handler tombol "Menu Utama"
 */
async function handleMainMenu(ctx) {
  try {
    await ctx.answerCbQuery();
    const user = ctx.dbUser;
    const settings = await settingsService.getMultiple(['shopName', 'shopDesc', 'bannerUrl', 'channelUrl', 'contactUrl']);
    const freshUser = await userService.getById(user?.id || '');

    const replyOptions = {
      parse_mode: 'HTML',
      ...buildMainKeyboard(settings),
    };

    if (settings.bannerUrl) {
      try {
        await ctx.editMessageMedia(
          { type: 'photo', media: settings.bannerUrl, caption: msg.welcomeMessage(freshUser || user, settings), parse_mode: 'HTML' },
          buildMainKeyboard(settings),
        );
        return;
      } catch (e) {
        // Fallback
      }
    }

    try {
      await ctx.editMessageText(msg.welcomeMessage(freshUser || user, settings), replyOptions);
    } catch (e) {
      await ctx.reply(msg.welcomeMessage(freshUser || user, settings), replyOptions);
    }
  } catch (error) {
    logger.error('handleMainMenu error:', error.message);
  }
}

module.exports = { handleStart, handleMainMenu, buildMainKeyboard };
