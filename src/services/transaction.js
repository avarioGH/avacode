'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');
const productService = require('./product');
const userService = require('./user');
const activityLog = require('./activityLog');
const config = require('../config');

/**
 * ================================================================
 * TRANSACTION SERVICE
 * ================================================================
 */

/**
 * Buat transaksi baru
 * @param {Object} params
 */
async function create({
  userId,
  productId,
  quantity = 1,
  paymentMethod,
  voucherId = null,
  discount = 0,
}) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Produk tidak ditemukan');
  if (!product.isActive) throw new Error('Produk tidak aktif');

  // Cek stok
  const stockCount = await productService.getStockCount(productId);
  if (stockCount < quantity) {
    throw new Error(`Stok tidak mencukupi. Tersedia: ${stockCount}`);
  }

  const unitPrice = parseFloat(product.price);
  const subtotal = unitPrice * quantity;
  const finalAmount = Math.max(0, subtotal - discount);

  const expiredAt = new Date(Date.now() + config.payment.expiryMinutes * 60 * 1000);

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      productId,
      quantity,
      unitPrice,
      subtotal,
      discount,
      finalAmount,
      paymentMethod,
      voucherId: voucherId || undefined,
      expiredAt,
    },
    include: {
      product: { include: { category: true } },
      user: true,
    },
  });

  await activityLog.log({
    userId,
    action: 'TRANSACTION_CREATE',
    description: `Buat transaksi: ${product.name} x${quantity}`,
    metadata: { transactionId: transaction.id, amount: finalAmount },
  });

  return transaction;
}

/**
 * Get transaction by ID
 */
async function getById(id) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      product: { include: { category: true } },
      user: true,
      payment: true,
      stocks: true,
      voucher: true,
    },
  });
}

/**
 * Get transactions by user
 */
async function getByUser(userId, page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    }),
    prisma.transaction.count({ where: { userId } }),
  ]);
  return { transactions, total };
}

/**
 * Proses pembayaran berhasil — deliver produk
 * @param {string} transactionId
 */
async function processPaymentSuccess(transactionId) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, product: true },
    });

    if (!transaction) throw new Error('Transaksi tidak ditemukan');
    if (transaction.status === 'DELIVERED') {
      logger.warn('Transaction already delivered', { transactionId });
      return transaction;
    }

    // Ambil stok
    const stocks = await productService.takeStocks(
      transaction.productId,
      transactionId,
      transaction.quantity,
    );

    // Update transaksi
    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });

    // Update stats user
    await tx.user.update({
      where: { id: transaction.userId },
      data: {
        totalSpent: { increment: parseFloat(transaction.finalAmount) },
        totalOrders: { increment: 1 },
      },
    });

    await activityLog.log({
      userId: transaction.userId,
      action: 'TRANSACTION_DELIVERED',
      description: `Produk terkirim: ${transaction.product.name}`,
      metadata: { transactionId, stockCount: stocks.length },
    });

    logger.info('Transaction delivered', { transactionId, userId: transaction.userId });

    return { ...transaction, stocks };
  });
}

/**
 * Cancel transaksi
 * @param {string} transactionId
 */
async function cancel(transactionId) {
  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!transaction) throw new Error('Transaksi tidak ditemukan');
  if (['DELIVERED', 'CANCELLED'].includes(transaction.status)) {
    throw new Error('Transaksi tidak bisa dibatalkan');
  }

  return prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'CANCELLED' },
  });
}

/**
 * Expire transaksi yang sudah melewati batas waktu
 */
async function expirePendingTransactions() {
  const result = await prisma.transaction.updateMany({
    where: {
      status: 'PENDING',
      expiredAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });
  if (result.count > 0) {
    logger.info(`Expired ${result.count} pending transactions`);
  }
}

/**
 * Get transaction statistics
 */
async function getStats() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const [totalOrders, ordersToday, successOrders, revenueResult, revenueTodayResult, topProducts] =
    await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.transaction.count({ where: { status: 'DELIVERED' } }),
      prisma.transaction.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { finalAmount: true },
      }),
      prisma.transaction.aggregate({
        where: { status: 'DELIVERED', createdAt: { gte: todayStart } },
        _sum: { finalAmount: true },
      }),
      prisma.transaction.groupBy({
        by: ['productId'],
        where: { status: 'DELIVERED' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

  const totalRevenue = parseFloat(revenueResult._sum.finalAmount || 0);
  const revenueToday = parseFloat(revenueTodayResult._sum.finalAmount || 0);
  const avgOrderValue = successOrders > 0 ? totalRevenue / successOrders : 0;

  // Get product names
  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  const topProductsWithNames = topProducts.map((tp) => {
    const p = products.find((pr) => pr.id === tp.productId);
    return { name: p?.name || '-', count: tp._count.id };
  });

  return {
    totalOrders,
    ordersToday,
    successOrders,
    totalRevenue,
    revenueToday,
    avgOrderValue,
    topProducts: topProductsWithNames,
  };
}

module.exports = {
  create,
  getById,
  getByUser,
  processPaymentSuccess,
  cancel,
  expirePendingTransactions,
  getStats,
};
