'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');

/**
 * ================================================================
 * ACTIVITY LOG SERVICE
 * ================================================================
 */

/**
 * Log aktivitas
 * @param {Object} params
 */
async function log({ userId = null, telegramId = null, action, description, metadata = null }) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || undefined,
        telegramId: telegramId ? BigInt(telegramId) : undefined,
        action,
        description,
        metadata: metadata || undefined,
      },
    });
  } catch (error) {
    logger.error('ActivityLog.log error:', { error: error.message, action });
  }
}

/**
 * Get recent logs (paginated)
 */
async function getRecent(page = 1, perPage = 20) {
  const skip = (page - 1) * perPage;
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, username: true } } },
    }),
    prisma.activityLog.count(),
  ]);
  return { logs, total };
}

/**
 * Get logs by user
 */
async function getByUser(userId, limit = 20) {
  return prisma.activityLog.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { log, getRecent, getByUser };
