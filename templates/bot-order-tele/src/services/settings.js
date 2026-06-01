'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');

/**
 * ================================================================
 * SETTINGS SERVICE
 * Centralized key-value store untuk konfigurasi bot
 * ================================================================
 */

// Default settings
const DEFAULTS = {
  shopName: 'AVA Shop',
  shopDesc: 'Toko produk digital terpercaya dengan harga terbaik! 🛍️',
  bannerUrl: '',
  channelUrl: 'https://t.me/example',
  contactUrl: 'https://t.me/admin',
  referralBonus: '5000',
  autoPostTransaction: 'true',
  autoPostTestimoni: 'false',
  postChannelId: '',
  maintenanceMode: 'false',
  maintenanceMessage: 'Bot sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
};

/**
 * Get single setting
 * @param {string} key
 * @returns {Promise<string|null>}
 */
async function get(key) {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (setting) return setting.value;
    return DEFAULTS[key] ?? null;
  } catch (error) {
    logger.error('Settings.get error:', { key, error: error.message });
    return DEFAULTS[key] ?? null;
  }
}

/**
 * Set single setting
 * @param {string} key
 * @param {string} value
 */
async function set(key, value) {
  await prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  });
}

/**
 * Get multiple settings at once
 * @param {string[]} keys
 * @returns {Promise<Object>}
 */
async function getMultiple(keys) {
  const rows = await prisma.setting.findMany({
    where: { key: { in: keys } },
  });

  const result = {};
  for (const key of keys) {
    const row = rows.find((r) => r.key === key);
    result[key] = row ? row.value : (DEFAULTS[key] ?? null);
  }
  return result;
}

/**
 * Get all settings as object
 * @returns {Promise<Object>}
 */
async function getAll() {
  const rows = await prisma.setting.findMany();
  const result = { ...DEFAULTS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

/**
 * Seed default settings ke database
 */
async function seedDefaults() {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const exists = await prisma.setting.findUnique({ where: { key } });
    if (!exists) {
      await prisma.setting.create({ data: { key, value } });
    }
  }
  logger.info('Default settings seeded');
}

module.exports = { get, set, getMultiple, getAll, seedDefaults, DEFAULTS };
