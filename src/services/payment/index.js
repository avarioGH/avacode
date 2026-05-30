'use strict';

const balanceService = require('./balance');
const paydisiniService = require('./paydisini');
const pakasirService = require('./pakasir');

/**
 * ================================================================
 * PAYMENT INDEX — Unified payment interface
 * ================================================================
 */

const gateways = {
  balance: balanceService,
  paydisini: paydisiniService,
  pakasir: pakasirService,
};

/**
 * Create payment for a transaction
 * @param {string} gateway - 'balance' | 'paydisini' | 'pakasir'
 * @param {Object} params
 */
async function createPayment(gateway, params) {
  const service = gateways[gateway];
  if (!service) throw new Error(`Gateway tidak dikenal: ${gateway}`);
  return service.createPayment(params);
}

/**
 * Poll payment status
 * @param {string} gateway
 * @param {string} transactionId
 */
async function pollStatus(gateway, transactionId) {
  const service = gateways[gateway];
  if (!service || !service.pollStatus) return false;
  return service.pollStatus(transactionId);
}

/**
 * Handle callback
 * @param {string} gateway
 * @param {Object} body
 * @param {string} signature
 */
async function handleCallback(gateway, body, signature) {
  const service = gateways[gateway];
  if (!service || !service.handleCallback) return null;
  return service.handleCallback(body, signature);
}

/**
 * Verify callback signature
 * @param {string} gateway
 * @param {Object} body
 * @param {string} signature
 */
function verifyCallback(gateway, body, signature) {
  const service = gateways[gateway];
  if (!service || !service.verifyCallback) return true;
  return service.verifyCallback(body, signature);
}

module.exports = {
  createPayment,
  pollStatus,
  handleCallback,
  verifyCallback,
  balance: balanceService,
  paydisini: paydisiniService,
  pakasir: pakasirService,
};
