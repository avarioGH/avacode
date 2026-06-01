'use strict';

const express = require('express');
const logger = require('../../utils/logger');
const transactionService = require('../../services/transaction');
const userService = require('../../services/user');
const broadcastService = require('../../services/broadcast');
const settingsService = require('../../services/settings');
const prisma = require('../../database/client');
const paydisiniService = require('../../services/payment/paydisini');
const pakasirService = require('../../services/payment/pakasir');
const { paymentSuccessMessage, channelTransactionPost } = require('../../utils/message');
const kb = require('../../utils/keyboard');

/**
 * ================================================================
 * PAYMENT CALLBACK ROUTES
 * Menerima callback dari Paydisini & Pakasir
 * ================================================================
 */
function paymentRouter(bot) {
  const router = express.Router();

  // ============================================================
  // PAYDISINI CALLBACK
  // POST /api/payment/paydisini/callback
  // ============================================================
  router.post('/paydisini/callback', async (req, res) => {
    try {
      logger.info('Paydisini callback received', { body: req.body });

      // Verifikasi signature
      const isValid = paydisiniService.verifyCallback(req.body);
      if (!isValid) {
        logger.warn('Invalid Paydisini callback signature');
        return res.status(403).json({ success: false, message: 'Invalid signature' });
      }

      const transaction = await paydisiniService.handleCallback(req.body);

      if (transaction && transaction.status === 'PAID') {
        await processSuccessfulTransaction(bot, transaction);
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Paydisini callback error:', error.message);
      res.status(500).json({ success: false });
    }
  });

  // ============================================================
  // PAKASIR CALLBACK
  // POST /api/payment/pakasir/callback
  // ============================================================
  router.post('/pakasir/callback', async (req, res) => {
    try {
      logger.info('Pakasir callback received', { body: req.body });

      const signature = req.headers['x-signature'] || '';
      const isValid = pakasirService.verifyCallback(req.body, signature);
      if (!isValid) {
        logger.warn('Invalid Pakasir callback signature');
        return res.status(403).json({ success: false, message: 'Invalid signature' });
      }

      const transaction = await pakasirService.handleCallback(req.body);

      if (transaction && transaction.status === 'PAID') {
        await processSuccessfulTransaction(bot, transaction);
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Pakasir callback error:', error.message);
      res.status(500).json({ success: false });
    }
  });

  // ============================================================
  // DEPOSIT CALLBACK (Paydisini)
  // Deposit menggunakan transactionId = depositId
  // Dihandle di paydisini.handleCallback tapi perlu special treatment
  // ============================================================
  router.post('/deposit/callback', async (req, res) => {
    try {
      // Cek apakah ini deposit atau transaction berdasarkan unique_code
      const { unique_code } = req.body;
      const deposit = await prisma.deposit.findFirst({
        where: { gatewayTrxId: unique_code },
      });

      if (deposit && deposit.status === 'PENDING') {
        await prisma.deposit.update({
          where: { id: deposit.id },
          data: { status: 'PAID', paidAt: new Date() },
        });

        // Tambah saldo user
        await userService.addBalance(deposit.userId, parseFloat(deposit.amount), 'Deposit via payment gateway');

        // Notifikasi user
        const user = await prisma.user.findUnique({ where: { id: deposit.userId } });
        if (user) {
          await broadcastService.sendToUser(
            bot,
            Number(user.telegramId),
            `✅ <b>Deposit Berhasil!</b>\n\n💰 Nominal: <b>Rp${parseFloat(deposit.amount).toLocaleString('id-ID')}</b>\n\nSaldo kamu telah ditambahkan!`,
          );
        }
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Deposit callback error:', error.message);
      res.status(500).json({ success: false });
    }
  });

  return router;
}

/**
 * Proses transaksi yang berhasil dibayar
 * Deliver produk + notifikasi user + auto-post channel
 */
async function processSuccessfulTransaction(bot, transaction) {
  try {
    const trxId = transaction.id;

    // Deliver produk
    const result = await transactionService.processPaymentSuccess(trxId);

    // Ambil data lengkap
    const fullTrx = await transactionService.getById(trxId);
    const user = await userService.getById(result.userId || fullTrx.userId);

    // Kirim produk ke user via Telegram
    if (user) {
      await broadcastService.sendToUser(
        bot,
        Number(user.telegramId),
        paymentSuccessMessage(fullTrx, result.stocks || []),
      );
    }

    // Auto-post ke channel
    const [autoPost, channelId] = await Promise.all([
      settingsService.get('autoPostTransaction'),
      settingsService.get('postChannelId'),
    ]);

    if (autoPost === 'true' && channelId && user) {
      const postMsg = channelTransactionPost(fullTrx, user);
      await bot.telegram.sendMessage(channelId, postMsg, { parse_mode: 'HTML' }).catch(() => {});
    }

    logger.info('Transaction processed via callback', { transactionId: trxId });
  } catch (error) {
    logger.error('processSuccessfulTransaction error:', error.message);
  }
}

module.exports = paymentRouter;
