'use strict';

const config = require('../config');

/**
 * Format angka menjadi mata uang Rupiah
 * @param {number|string|Decimal} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format angka biasa dengan pemisah ribuan
 * @param {number|string} num
 * @returns {string}
 */
function formatNumber(num) {
  return new Intl.NumberFormat(config.locale).format(parseFloat(num) || 0);
}

/**
 * Format tanggal ke format Indonesia
 * @param {Date|string} date
 * @param {boolean} includeTime
 * @returns {string}
 */
function formatDate(date, includeTime = true) {
  const d = date instanceof Date ? date : new Date(date);
  const options = {
    timeZone: config.timezone,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }
  return d.toLocaleDateString('id-ID', options);
}

/**
 * Format tanggal singkat
 * @param {Date|string} date
 * @returns {string}
 */
function formatDateShort(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('id-ID', {
    timeZone: config.timezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Relative time (misal: "5 menit lalu")
 * @param {Date|string} date
 * @returns {string}
 */
function formatRelativeTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now - d;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} detik lalu`;
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 30) return `${days} hari lalu`;
  return formatDateShort(d);
}

/**
 * Escape karakter HTML untuk Telegram HTML mode
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Truncate string
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength = 50) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Format status transaksi ke bahasa Indonesia
 * @param {string} status
 * @returns {string}
 */
function formatTransactionStatus(status) {
  const map = {
    PENDING: '⏳ Menunggu Pembayaran',
    PAID: '✅ Dibayar',
    DELIVERED: '📦 Terkirim',
    CANCELLED: '❌ Dibatalkan',
    EXPIRED: '⌛ Kadaluarsa',
    REFUNDED: '🔄 Dikembalikan',
  };
  return map[status] || status;
}

/**
 * Format metode pembayaran ke bahasa Indonesia
 * @param {string} method
 * @returns {string}
 */
function formatPaymentMethod(method) {
  const map = {
    BALANCE: '💰 Saldo Internal',
    PAYDISINI: '💳 Paydisini',
    PAKASIR: '💳 Pakasir',
  };
  return map[method] || method;
}

/**
 * Format ukuran file
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate random string
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Delay/sleep
 * @param {number} ms
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array menjadi batch
 * @param {Array} array
 * @param {number} size
 * @returns {Array[]}
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

module.exports = {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  escapeHtml,
  truncate,
  formatTransactionStatus,
  formatPaymentMethod,
  formatFileSize,
  randomString,
  sleep,
  chunkArray,
};
