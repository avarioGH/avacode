'use strict';

require('dotenv').config();

const config = {
  // Bot
  bot: {
    token: process.env.BOT_TOKEN,
    username: process.env.BOT_USERNAME,
    ownerIds: (process.env.OWNER_IDS || '').split(',').map((id) => parseInt(id.trim())).filter(Boolean),
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Server
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    webhookUrl: process.env.WEBHOOK_URL,
    webhookSecret: process.env.WEBHOOK_SECRET,
  },

  // Payment - Paydisini
  paydisini: {
    apiKey: process.env.PAYDISINI_API_KEY,
    apiUrl: process.env.PAYDISINI_API_URL || 'https://paydisini.co.id/api/',
    channels: (process.env.PAYDISINI_CHANNELS || 'QRIS').split(',').map((c) => c.trim()),
  },

  // Payment - Pakasir
  pakasir: {
    apiKey: process.env.PAKASIR_API_KEY,
    apiUrl: process.env.PAKASIR_API_URL || 'https://pakasir.net/api/v1/',
    callbackSecret: process.env.PAKASIR_CALLBACK_SECRET,
  },

  // Session
  session: {
    dbPath: process.env.SESSION_DB_PATH || './data/sessions.json',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || './logs',
  },

  // Backup
  backup: {
    dir: process.env.BACKUP_DIR || './backups',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10),
    remoteUrl: process.env.BACKUP_REMOTE_URL || null,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
    spamThrottleMs: parseInt(process.env.SPAM_THROTTLE_MS || '1000', 10),
  },

  // Payment
  payment: {
    expiryMinutes: parseInt(process.env.PAYMENT_EXPIRY_MINUTES || '60', 10),
    pollIntervalSeconds: parseInt(process.env.PAYMENT_POLL_INTERVAL || '15', 10),
  },

  // Referral
  referral: {
    defaultBonus: parseInt(process.env.REFERRAL_BONUS_DEFAULT || '5000', 10),
  },

  // Timezone
  timezone: process.env.TZ || 'Asia/Jakarta',
  locale: process.env.LOCALE || 'id-ID',
  currency: process.env.CURRENCY || 'IDR',

  // Helpers
  get isDev() {
    return this.server.nodeEnv === 'development';
  },

  get isProd() {
    return this.server.nodeEnv === 'production';
  },

  /**
   * Validate required config values
   */
  validate() {
    const required = [
      { key: 'BOT_TOKEN', value: this.bot.token },
      { key: 'DATABASE_URL', value: this.database.url },
    ];

    const missing = required.filter((r) => !r.value);
    if (missing.length > 0) {
      throw new Error(
        `❌ Missing required environment variables: ${missing.map((r) => r.key).join(', ')}\n` +
        'Salin .env.example ke .env dan isi nilai yang diperlukan.',
      );
    }

    if (this.bot.ownerIds.length === 0) {
      console.warn('⚠️  OWNER_IDS tidak dikonfigurasi! Set OWNER_IDS di .env');
    }
  },
};

module.exports = config;
