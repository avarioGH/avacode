'use strict';

const express = require('express');
const crypto = require('crypto');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * ================================================================
 * TELEGRAM WEBHOOK ROUTE
 * ================================================================
 */
function webhookRouter(bot) {
  const router = express.Router();

  // Raw body untuk verifikasi signature
  router.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }));

  router.post(`/${config.server.webhookSecret}`, async (req, res) => {
    try {
      // Verifikasi secret token (Telegram mengirim via header X-Telegram-Bot-Api-Secret-Token)
      const secretToken = req.headers['x-telegram-bot-api-secret-token'];
      if (config.server.webhookSecret && secretToken !== config.server.webhookSecret) {
        logger.warn('Invalid webhook secret token');
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await bot.handleUpdate(req.body, res);
    } catch (error) {
      logger.error('Webhook handler error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
}

module.exports = webhookRouter;
