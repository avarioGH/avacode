'use strict';

const logger = require('../utils/logger');
const { sleep, chunkArray } = require('../utils/formatter');

/**
 * ================================================================
 * BROADCAST SERVICE
 * ================================================================
 */

/**
 * Broadcast pesan teks ke semua user
 * @param {Object} bot - Telegraf bot instance
 * @param {BigInt[]} telegramIds
 * @param {string} message
 * @param {Object} options - Extra options (parse_mode, etc)
 */
async function broadcastText(bot, telegramIds, message, options = {}) {
  let sent = 0;
  let failed = 0;

  const batches = chunkArray(telegramIds, 30); // 30 per batch

  for (const batch of batches) {
    const promises = batch.map(async (telegramId) => {
      try {
        await bot.telegram.sendMessage(
          String(telegramId),
          message,
          { parse_mode: 'HTML', ...options },
        );
        sent++;
      } catch (error) {
        failed++;
        // Jangan log user yang block bot
        if (!error.message?.includes('blocked') && !error.message?.includes('deactivated')) {
          logger.error('Broadcast send error', { telegramId: String(telegramId), error: error.message });
        }
      }
    });

    await Promise.allSettled(promises);
    await sleep(1000); // Rate limit: 1 detik antar batch
  }

  logger.info('Broadcast completed', { sent, failed, total: telegramIds.length });
  return { sent, failed };
}

/**
 * Broadcast pesan dengan gambar ke semua user
 * @param {Object} bot
 * @param {BigInt[]} telegramIds
 * @param {string} imageUrl
 * @param {string} caption
 * @param {Object} options
 */
async function broadcastPhoto(bot, telegramIds, imageUrl, caption, options = {}) {
  let sent = 0;
  let failed = 0;

  const batches = chunkArray(telegramIds, 30);

  for (const batch of batches) {
    const promises = batch.map(async (telegramId) => {
      try {
        await bot.telegram.sendPhoto(
          String(telegramId),
          imageUrl,
          {
            caption,
            parse_mode: 'HTML',
            ...options,
          },
        );
        sent++;
      } catch (error) {
        // Fallback ke text jika foto gagal
        try {
          await bot.telegram.sendMessage(
            String(telegramId),
            caption,
            { parse_mode: 'HTML', ...options },
          );
          sent++;
        } catch (fallbackError) {
          failed++;
        }
      }
    });

    await Promise.allSettled(promises);
    await sleep(1000);
  }

  logger.info('Photo broadcast completed', { sent, failed, total: telegramIds.length });
  return { sent, failed };
}

/**
 * Kirim pesan ke satu user
 * @param {Object} bot
 * @param {string|number} telegramId
 * @param {string} message
 * @param {Object} options
 */
async function sendToUser(bot, telegramId, message, options = {}) {
  try {
    await bot.telegram.sendMessage(String(telegramId), message, {
      parse_mode: 'HTML',
      ...options,
    });
    return true;
  } catch (error) {
    logger.error('sendToUser error', { telegramId: String(telegramId), error: error.message });
    return false;
  }
}

/**
 * Kirim foto ke satu user
 * @param {Object} bot
 * @param {string|number} telegramId
 * @param {string} photo
 * @param {string} caption
 * @param {Object} options
 */
async function sendPhotoToUser(bot, telegramId, photo, caption, options = {}) {
  try {
    await bot.telegram.sendPhoto(String(telegramId), photo, {
      caption,
      parse_mode: 'HTML',
      ...options,
    });
    return true;
  } catch (error) {
    logger.error('sendPhotoToUser error', { telegramId: String(telegramId), error: error.message });
    return false;
  }
}

module.exports = {
  broadcastText,
  broadcastPhoto,
  sendToUser,
  sendPhotoToUser,
};
