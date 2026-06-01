'use strict';

const cron = require('node-cron');
const logger = require('../utils/logger');
const transactionService = require('./transaction');
const settingsService = require('./settings');
const prisma = require('../database/client');
const broadcastService = require('./broadcast');
const { channelTransactionPost } = require('../utils/message');
const { formatDate } = require('../utils/formatter');

let botInstance = null;

/**
 * ================================================================
 * SCHEDULER SERVICE
 * Semua cron job terpusat di sini
 * ================================================================
 */

/**
 * Set bot instance untuk scheduler
 * @param {Object} bot
 */
function setBot(bot) {
  botInstance = bot;
}

/**
 * Expire transaksi PENDING yang sudah melewati batas waktu
 * Setiap 5 menit
 */
function startExpireTransactions() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      await transactionService.expirePendingTransactions();
    } catch (error) {
      logger.error('Scheduler expireTransactions error:', error.message);
    }
  });
  logger.info('Scheduler: expire transactions started (every 5 min)');
}

/**
 * Auto backup database
 * Setiap hari jam 02:00 WIB
 */
function startAutoBackup() {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Scheduler: starting auto backup...');
    try {
      const backupService = require('./backup');
      const result = await backupService.createBackup();
      logger.info('Auto backup completed', { file: result.filename });

      // Notifikasi owner
      if (botInstance) {
        const config = require('../config');
        for (const ownerId of config.bot.ownerIds) {
          await botInstance.telegram.sendDocument(ownerId, { source: result.filepath }, {
            caption: `💾 <b>Auto Backup Berhasil</b>\n\n📁 File: <code>${result.filename}</code>\n📦 Size: ${result.size}\n📅 Waktu: ${formatDate(new Date())}`,
            parse_mode: 'HTML'
          });
        }
      }
    } catch (error) {
      logger.error('Auto backup failed:', error.message);
    }
  }, { timezone: 'Asia/Jakarta' });

  logger.info('Scheduler: auto backup started (daily at 02:00 WIB)');
}

/**
 * Auto post transaksi ke channel
 * Setiap menit cek transaksi baru yang belum dipost
 */
function startAutoPostTransactions() {
  cron.schedule('* * * * *', async () => {
    try {
      const autoPost = await settingsService.get('autoPostTransaction');
      if (autoPost !== 'true') return;

      const channelId = await settingsService.get('postChannelId');
      if (!channelId || !botInstance) return;

      // Ambil transaksi DELIVERED yang belum dipost (dalam 2 menit terakhir)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const transactions = await prisma.transaction.findMany({
        where: {
          status: 'DELIVERED',
          deliveredAt: { gte: twoMinutesAgo },
        },
        include: {
          user: true,
          product: true,
        },
        take: 5,
      });

      for (const trx of transactions) {
        try {
          const message = channelTransactionPost(trx, trx.user);
          await botInstance.telegram.sendMessage(channelId, message, { parse_mode: 'HTML' });
        } catch (err) {
          // Abaikan error per transaksi
        }
      }
    } catch (error) {
      // Silent — jangan flood log
    }
  });
}

/**
 * Auto post testimoni ke channel
 * Setiap hari jam 10:00 WIB
 */
function startAutoPostTestimoni() {
  cron.schedule('0 10 * * *', async () => {
    try {
      const autoPost = await settingsService.get('autoPostTestimoni');
      if (autoPost !== 'true') return;

      const channelId = await settingsService.get('postChannelId');
      if (!channelId || !botInstance) return;

      const testimoni = await prisma.testimonial.findFirst({
        where: { isApproved: true, isPosted: false },
        orderBy: { createdAt: 'asc' },
      });

      if (!testimoni) return;

      await botInstance.telegram.sendMessage(
        channelId,
        `⭐ <b>Testimoni Pelanggan</b>\n\n"${testimoni.content}"\n\n— ${testimoni.fromUser}`,
        { parse_mode: 'HTML' },
      );

      await prisma.testimonial.update({
        where: { id: testimoni.id },
        data: { isPosted: true, postedAt: new Date() },
      });
    } catch (error) {
      logger.error('Auto post testimoni error:', error.message);
    }
  }, { timezone: 'Asia/Jakarta' });
}

/**
 * Mulai semua scheduler
 */
function startAll(bot) {
  if (bot) setBot(bot);
  startExpireTransactions();
  startAutoBackup();
  startAutoPostTransactions();
  startAutoPostTestimoni();
  logger.info('All schedulers started');
}

module.exports = { startAll, setBot };
