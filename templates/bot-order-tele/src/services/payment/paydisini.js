'use strict';

const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../../database/client');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * ================================================================
 * PAYMENT SERVICE — PAYDISINI
 * Docs: https://paydisini.co.id/api-docs
 * ================================================================
 */

const API_URL = config.paydisini.apiUrl;
const API_KEY = config.paydisini.apiKey;

// Channel code mapping
const CHANNEL_CODES = {
  QRIS: 'QRIS',
  GOPAY: 'GoPay',
  OVO: 'OVO',
  DANA: 'DANA',
  SHOPEEPAY: 'ShopeePay',
  BCA: 'BCA',
  BNI: 'BNI',
  BRI: 'BRI',
  MANDIRI: 'MANDIRI',
  LINKAJA: 'LinkAja',
  PERMATA: 'PERMATA',
};

/**
 * Generate signature Paydisini
 * @param {string} uniqueCode
 * @param {string} service
 * @param {string|number} amount
 * @param {string} validTime
 * @returns {string}
 */
function generateSignature(uniqueCode, service, amount, validTime) {
  const str = `${API_KEY}${uniqueCode}${service}${amount}${validTime}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Buat pembayaran baru di Paydisini
 * @param {Object} params
 * @returns {Promise<Object>}
 */
async function createPayment({ transactionId, userId, amount, channel, note = '' }) {
  if (!API_KEY) throw new Error('Paydisini API Key belum dikonfigurasi');

  const uniqueCode = transactionId.replace(/-/g, '').substring(0, 16);
  const service = channel;
  const validTime = String(config.payment.expiryMinutes * 60); // seconds
  const signature = generateSignature(uniqueCode, service, amount, validTime);
  const callbackUrl = `${config.server.webhookUrl}/api/payment/paydisini/callback`;
  const returnUrl = `https://t.me/${config.bot.username}`;

  const formData = new URLSearchParams({
    key: API_KEY,
    request: 'new',
    unique_code: uniqueCode,
    service: service,
    amount: String(Math.ceil(amount)),
    note: note || `Order #${uniqueCode}`,
    valid_time: validTime,
    type_fee: '1', // fee ditanggung customer
    signature,
    payment_url_is_hpp: 'true',
    callback_url: callbackUrl,
    return_url: returnUrl,
  });

  try {
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    });

    const data = response.data;
    logger.info('Paydisini createPayment response', { uniqueCode, status: data.success });

    if (!data.success) {
      throw new Error(data.msg || 'Gagal membuat pembayaran Paydisini');
    }

    const expiredAt = new Date(Date.now() + config.payment.expiryMinutes * 60 * 1000);

    // Simpan payment ke DB
    const payment = await prisma.payment.upsert({
      where: { transactionId },
      update: {
        gateway: 'paydisini',
        gatewayTrxId: uniqueCode,
        channel,
        amount,
        status: 'PENDING',
        paymentUrl: data.data?.url || null,
        qrCode: data.data?.qrcode || null,
        expiredAt,
        rawResponse: data,
      },
      create: {
        transactionId,
        userId,
        gateway: 'paydisini',
        gatewayTrxId: uniqueCode,
        channel,
        amount,
        status: 'PENDING',
        paymentUrl: data.data?.url || null,
        qrCode: data.data?.qrcode || null,
        expiredAt,
        rawResponse: data,
      },
    });

    return { payment, paymentData: data.data };
  } catch (error) {
    logger.error('Paydisini createPayment error', { error: error.message, transactionId });
    if (error.response?.data) {
      throw new Error(error.response.data.msg || 'Gagal membuat pembayaran');
    }
    throw error;
  }
}

/**
 * Cek status pembayaran
 * @param {string} uniqueCode
 * @returns {Promise<Object>}
 */
async function checkStatus(uniqueCode) {
  if (!API_KEY) throw new Error('Paydisini API Key belum dikonfigurasi');

  const signature = crypto
    .createHash('md5')
    .update(`${API_KEY}${uniqueCode}StatusTransaction`)
    .digest('hex');

  const formData = new URLSearchParams({
    key: API_KEY,
    request: 'status',
    unique_code: uniqueCode,
    signature,
  });

  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000,
  });

  return response.data;
}

/**
 * Verifikasi callback signature dari Paydisini
 * @param {Object} body
 * @returns {boolean}
 */
function verifyCallback(body) {
  const { unique_code, status, signature } = body;
  if (!unique_code || !status || !signature) return false;

  const expectedSig = crypto
    .createHash('md5')
    .update(`${API_KEY}${unique_code}${status}CallbackStatus`)
    .digest('hex');

  return signature === expectedSig;
}

/**
 * Handle callback dari Paydisini
 * @param {Object} body
 * @returns {Promise<Object>}
 */
async function handleCallback(body) {
  const { unique_code, status } = body;

  logger.info('Paydisini callback received', { unique_code, status });

  // Cari payment berdasarkan gatewayTrxId
  const payment = await prisma.payment.findFirst({
    where: { gatewayTrxId: unique_code, gateway: 'paydisini' },
    include: { transaction: true },
  });

  if (!payment) {
    logger.warn('Paydisini callback: payment not found', { unique_code });
    return null;
  }

  if (status === 'Success' || status === '1') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID', paidAt: new Date() },
    });

    await prisma.transaction.update({
      where: { id: payment.transactionId },
      data: { status: 'PAID' },
    });

    return payment.transaction;
  }

  if (status === 'Expired' || status === '0') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'EXPIRED' },
    });
    await prisma.transaction.update({
      where: { id: payment.transactionId },
      data: { status: 'EXPIRED' },
    });
  }

  return null;
}

/**
 * Polling status untuk payment yang pending
 * @param {string} transactionId
 * @returns {Promise<boolean>} true jika sudah bayar
 */
async function pollStatus(transactionId) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
  });

  if (!payment || payment.status !== 'PENDING') return false;

  try {
    const data = await checkStatus(payment.gatewayTrxId);
    if (data.success && (data.data?.status === 'Success' || data.data?.status === '1')) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', paidAt: new Date() },
      });
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'PAID' },
      });
      return true;
    }
  } catch (error) {
    logger.error('Paydisini pollStatus error', { error: error.message, transactionId });
  }

  return false;
}

module.exports = {
  createPayment,
  checkStatus,
  verifyCallback,
  handleCallback,
  pollStatus,
  CHANNEL_CODES,
};
