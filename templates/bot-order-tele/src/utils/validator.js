'use strict';

/**
 * ================================================================
 * VALIDATOR UTILITY
 * ================================================================
 */

/**
 * Validasi apakah string adalah URL yang valid
 */
function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validasi nominal uang (harus positif integer/float)
 */
function isValidAmount(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Sanitize input teks — trim dan batasi panjang
 */
function sanitizeText(text, maxLength = 500) {
  if (!text) return '';
  return String(text).trim().substring(0, maxLength);
}

/**
 * Validasi format tanggal YYYY-MM-DD
 */
function isValidDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

/**
 * Validasi Telegram ID (harus angka positif)
 */
function isValidTelegramId(id) {
  const num = parseInt(id);
  return !isNaN(num) && num > 0;
}

module.exports = {
  isValidUrl,
  isValidAmount,
  sanitizeText,
  isValidDate,
  isValidTelegramId,
};
