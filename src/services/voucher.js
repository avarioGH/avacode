'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');
const { randomString } = require('../utils/formatter');

/**
 * ================================================================
 * VOUCHER SERVICE
 * ================================================================
 */

/**
 * Validasi dan apply voucher
 * @param {string} code
 * @param {number} subtotal
 * @returns {Promise<{voucher, discount}>}
 */
async function validate(code, subtotal) {
  const voucher = await prisma.voucher.findUnique({ where: { code: code.toUpperCase() } });

  if (!voucher) throw new Error('Kode voucher tidak ditemukan');
  if (!voucher.isActive) throw new Error('Voucher tidak aktif');
  if (voucher.expiredAt && new Date() > voucher.expiredAt) throw new Error('Voucher sudah kadaluarsa');
  if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) {
    throw new Error('Voucher sudah habis digunakan');
  }
  if (subtotal < parseFloat(voucher.minPurchase)) {
    throw new Error(
      `Minimum pembelian untuk voucher ini adalah Rp${parseFloat(voucher.minPurchase).toLocaleString('id-ID')}`,
    );
  }

  let discount = 0;
  if (voucher.type === 'PERCENTAGE') {
    discount = (subtotal * parseFloat(voucher.value)) / 100;
    if (voucher.maxDiscount) {
      discount = Math.min(discount, parseFloat(voucher.maxDiscount));
    }
  } else {
    discount = parseFloat(voucher.value);
  }

  return { voucher, discount: Math.min(discount, subtotal) };
}

/**
 * Gunakan voucher (increment usedCount)
 * @param {string} voucherId
 */
async function use(voucherId) {
  return prisma.voucher.update({
    where: { id: voucherId },
    data: { usedCount: { increment: 1 } },
  });
}

/**
 * Buat voucher baru
 */
async function create(data) {
  const code = data.code?.toUpperCase() || randomString(8);
  return prisma.voucher.create({
    data: { ...data, code },
  });
}

/**
 * Get all vouchers
 */
async function getAll(page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const [vouchers, total] = await Promise.all([
    prisma.voucher.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.voucher.count(),
  ]);
  return { vouchers, total };
}

/**
 * Toggle active status
 */
async function toggle(id) {
  const voucher = await prisma.voucher.findUnique({ where: { id } });
  if (!voucher) throw new Error('Voucher tidak ditemukan');
  return prisma.voucher.update({
    where: { id },
    data: { isActive: !voucher.isActive },
  });
}

/**
 * Delete voucher
 */
async function remove(id) {
  return prisma.voucher.delete({ where: { id } });
}

module.exports = { validate, use, create, getAll, toggle, remove };
