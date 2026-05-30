'use strict';

require('dotenv').config();

const config = require('./config');
const logger = require('./utils/logger');
const prisma = require('./database/client');
const { createBot } = require('./bot');
const { createServer } = require('./api/server');
const settingsService = require('./services/settings');
const scheduler = require('./services/scheduler');

/**
 * ================================================================
 * MAIN ENTRY POINT
 * ================================================================
 */
async function main() {
  try {
    // Validasi konfigurasi
    config.validate();
    logger.info('✅ Config valid');

    // Koneksi database
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Seed default settings
    await settingsService.seedDefaults();
    logger.info('✅ Default settings seeded');

    // Buat bot
    const bot = createBot();
    logger.info('✅ Bot created');

    // Start scheduler
    scheduler.startAll(bot);
    logger.info('✅ Schedulers started');

    // Start server
    const app = createServer(bot);

    if (config.server.webhookUrl && config.isProd) {
      // WEBHOOK MODE (production)
      const webhookPath = `/webhook/${config.server.webhookSecret}`;
      const webhookUrl = `${config.server.webhookUrl}${webhookPath}`;

      // Set webhook di Telegram
      await bot.telegram.setWebhook(webhookUrl, {
        secret_token: config.server.webhookSecret,
        allowed_updates: ['message', 'callback_query', 'chat_member'],
        drop_pending_updates: true,
      });

      logger.info(`✅ Webhook set: ${webhookUrl}`);

      // Start Express server
      const server = app.listen(config.server.port, () => {
        logger.info(`🚀 Server berjalan di port ${config.server.port} (webhook mode)`);
        logger.info(`📡 Webhook URL: ${webhookUrl}`);
      });

      // Graceful shutdown
      const shutdown = async (signal) => {
        logger.info(`${signal} received. Graceful shutdown...`);
        server.close(async () => {
          await prisma.$disconnect();
          logger.info('Database disconnected. Bye!');
          process.exit(0);
        });
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
    } else {
      // POLLING MODE (development / no webhook)
      logger.info('🔄 Starting in polling mode...');

      // Hapus webhook jika ada
      await bot.telegram.deleteWebhook({ drop_pending_updates: true });

      // Start Express untuk health check & payment callbacks
      app.listen(config.server.port, () => {
        logger.info(`🚀 Server berjalan di port ${config.server.port} (polling mode)`);
      });

      // Start polling
      await bot.launch({
        dropPendingUpdates: true,
        allowedUpdates: ['message', 'callback_query', 'chat_member'],
      });

      logger.info('🤖 Bot started (long polling)');

      process.on('SIGTERM', () => bot.stop('SIGTERM'));
      process.on('SIGINT', () => bot.stop('SIGINT'));
    }

    // Log bot info
    const botInfo = await bot.telegram.getMe();
    logger.info(`🤖 Bot: @${botInfo.username} (ID: ${botInfo.id})`);

  } catch (error) {
    logger.error('❌ Fatal error during startup:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason: String(reason), promise: String(promise) });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

main();
