'use strict';

const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../../database/client');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * ================================================================
 * PAYMENT SERVICE — PAKASIR
 * Docs: https://pakasir.net/docs
 * ================================================================
 */

const API_URL = config.pakasir.apiUrl;
const API_KEY = config.pakasir.apiKey;
const CALLBACK_SECRET = config.pakasir.callbackSecret;

const CHANNEL_CODES = {
  QRIS: 'qris',
  GOPAY: 'gopay',
  OVO: 'ovo',
  DANA: 'dana',
  SHOPEEPAY: 'shopeepay',
  BCA: 'bca_va',
  BNI: 'bni_va',
  BRI: 'bri_va',
  MANDIRI: 'mandiri_va',
  PERMATA: 'permata_va',
};

/**
 * Buat pembayaran baru di Pakasir
 */
async function createPayment({ transactionId, userId, amount, channel, note = '' }) {
  if (!API_KEY) throw new Error('Pakasir API Key belum dikonfigurasi');

  const callbackUrl = `${config.server.webhookUrl}/api/payment/pakasir/callback`;
  const returnUrl = `https://t.me/${config.bot.username}`;
  const orderId = `TRX-${transactionId.replace(/-/g, '').substring(0, 12).toUpperCase()}`;
  const expiredAt = new Date(Date.now() + config.payment.expiryMinutes * 60 * 1000);

  const payload = {
    order_id: orderId,
    amount: Math.ceil(amount),
    channel: CHANNEL_CODES[channel] || channel,
    description: note || `Pembayaran Order ${orderId}`,
    callback_url: callbackUrl,
    return_url: returnUrl,
    expired_time: Math.floor(expiredAt.getTime() / 1000),
    customer_name: 'Customer',
  };

  try {
    const response = await axios.post(`${API_URL}transaction/create`, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    const data = response.data;
    logger.info('Pakasir createPayment response', { orderId, status: data.status });

    if (!data.success && data.status !== 'success') {
      throw new Error(data.message || 'Gagal membuat pembayaran Pakasir');
    }

    const paymentData = data.data || data;

    const payment = await prisma.payment.upsert({
      where: { transactionId },
      update: {
        gateway: 'pakasir',
        gatewayTrxId: orderId,
        channel,
        amount,
        status: 'PENDING',
        paymentUrl: paymentData.payment_url || null,
        qrCode: paymentData.qr_code || null,
        expiredAt,
        rawResponse: data,
      },
      create: {
        transactionId,
        userId,
        gateway: 'pakasir',
        gatewayTrxId: orderId,
        channel,
        amount,
        status: 'PENDING',
        paymentUrl: paymentData.payment_url || null,
        qrCode: paymentData.qr_code || null,
        expiredAt,
        rawResponse: data,
      },
    });

    return { payment, paymentData };
  } catch (error) {
    logger.error('Pakasir createPayment error', { error: error.message, transactionId });
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Gagal membuat pembayaran');
    }
    throw error;
  }
}

/**
 * Cek status pembayaran
 * @param {string} orderId
 */
async function checkStatus(orderId) {
  const response = await axios.get(`${API_URL}transaction/status/${orderId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
    },
    timeout: 10000,
  });
  return response.data;
}

/**
 * Verifikasi signature callback Pakasir
 * @param {Object} body
 * @param {string} signature - dari header X-Signature
 */
function verifyCallback(body, signature) {
  if (!CALLBACK_SECRET) return true; // Skip jika tidak dikonfigurasi
  const str = JSON.stringify(body) + CALLBACK_SECRET;
  const expected = crypto.createHash('sha256').update(str).digest('hex');
  return signature === expected;
}

/**
 * Handle callback dari Pakasir
 * @param {Object} body
 */
async function handleCallback(body) {
  const { order_id, status } = body;

  logger.info('Pakasir callback received', { order_id, status });

  const payment = await prisma.payment.findFirst({
    where: { gatewayTrxId: order_id, gateway: 'pakasir' },
    include: { transaction: true },
  });

  if (!payment) {
    logger.warn('Pakasir callback: payment not found', { order_id });
    return null;
  }

  if (status === 'paid' || status === 'success' || status === 'PAID') {
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

  if (status === 'expired' || status === 'EXPIRED') {
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
 * Polling status payment
 * @param {string} transactionId
 */
async function pollStatus(transactionId) {
  const payment = await prisma.payment.findUnique({ where: { transactionId } });
  if (!payment || payment.status !== 'PENDING') return false;

  try {
    const data = await checkStatus(payment.gatewayTrxId);
    const paid = data.data?.status === 'paid' || data.data?.status === 'PAID';

    if (paid) {
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
    logger.error('Pakasir pollStatus error', { error: error.message, transactionId });
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
