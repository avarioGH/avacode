'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');
const { randomString } = require('../utils/formatter');

/**
 * ================================================================
 * USER SERVICE
 * ================================================================
 */

/**
 * Cari atau buat user berdasarkan Telegram data
 * @param {Object} telegramUser
 * @param {string|null} referralCode - kode referral dari URL
 * @returns {Promise<Object>}
 */
async function findOrCreate(telegramUser, referralCode = null) {
  const telegramId = BigInt(telegramUser.id);

  let user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    // Generate unique referral code
    let code;
    let unique = false;
    while (!unique) {
      code = randomString(8);
      const existing = await prisma.user.findUnique({ where: { referralCode: code } });
      if (!existing) unique = true;
    }

    user = await prisma.user.create({
      data: {
        telegramId,
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || 'User',
        lastName: telegramUser.last_name || null,
        referralCode: code,
        referredBy: referralCode || null,
      },
    });

    logger.info('New user registered', { telegramId: user.telegramId, username: user.username });
  } else {
    // Update info user
    user = await prisma.user.update({
      where: { telegramId },
      data: {
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || user.firstName,
        lastName: telegramUser.last_name || null,
        lastActiveAt: new Date(),
      },
    });
  }

  return user;
}

/**
 * Get user by Telegram ID
 * @param {number|BigInt} telegramId
 */
async function getByTelegramId(telegramId) {
  return prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });
}

/**
 * Get user by internal ID
 * @param {string} id
 */
async function getById(id) {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Get all users (paginated)
 * @param {number} page
 * @param {number} perPage
 */
async function getAll(page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: perPage,
      orderBy: { joinedAt: 'desc' },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
}

/**
 * Tambah saldo user
 * @param {string} userId
 * @param {number} amount
 * @param {string} description
 */
async function addBalance(userId, amount, description = '') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } },
  });
  logger.info('Balance added', { userId, amount, description });
  return user;
}

/**
 * Kurangi saldo user
 * @param {string} userId
 * @param {number} amount
 */
async function deductBalance(userId, amount) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User tidak ditemukan');
  if (parseFloat(user.balance) < amount) throw new Error('Saldo tidak mencukupi');

  return prisma.user.update({
    where: { id: userId },
    data: { balance: { decrement: amount } },
  });
}

/**
 * Block/Unblock user
 * @param {string} userId
 * @param {boolean} blocked
 */
async function setBlocked(userId, blocked) {
  return prisma.user.update({
    where: { id: userId },
    data: { isBlocked: blocked },
  });
}

/**
 * Update total spent & orders setelah transaksi sukses
 * @param {string} userId
 * @param {number} amount
 */
async function incrementStats(userId, amount) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      totalSpent: { increment: amount },
      totalOrders: { increment: 1 },
    },
  });
}

/**
 * Get semua telegram IDs (untuk broadcast)
 */
async function getAllTelegramIds() {
  const users = await prisma.user.findMany({
    where: { isBlocked: false },
    select: { telegramId: true },
  });
  return users.map((u) => u.telegramId);
}

/**
 * Count total users
 */
async function count() {
  return prisma.user.count();
}

/**
 * Get user stats untuk admin
 */
async function getStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const [totalUsers, activeUsers, newUsersToday] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { joinedAt: { gte: todayStart } } }),
  ]);

  return { totalUsers, activeUsers, newUsersToday };
}

module.exports = {
  findOrCreate,
  getByTelegramId,
  getById,
  getAll,
  addBalance,
  deductBalance,
  setBlocked,
  incrementStats,
  getAllTelegramIds,
  count,
  getStats,
};
