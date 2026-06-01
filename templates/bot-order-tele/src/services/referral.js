'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');
const settingsService = require('./settings');
const userService = require('./user');
const activityLog = require('./activityLog');

/**
 * ================================================================
 * REFERRAL SERVICE
 * ================================================================
 */

/**
 * Proses referral ketika user baru bergabung
 * @param {Object} newUser - user yang baru bergabung
 * @param {string} referralCode - kode referral yang digunakan
 */
async function processReferral(newUser, referralCode) {
  if (!referralCode || !newUser) return;

  // Cari owner referral code
  const referralOwner = await prisma.user.findUnique({
    where: { referralCode },
  });

  if (!referralOwner) {
    logger.warn('Referral code not found', { referralCode });
    return;
  }

  // Jangan referral diri sendiri
  if (referralOwner.id === newUser.id) return;

  // Cek apakah sudah pernah direferral
  const existing = await prisma.referral.findUnique({
    where: { ownerId_referredId: { ownerId: referralOwner.id, referredId: newUser.id } },
  });

  if (existing) return;

  // Ambil bonus dari settings
  const bonusStr = await settingsService.get('referralBonus');
  const bonus = parseFloat(bonusStr) || 0;

  await prisma.$transaction(async (tx) => {
    // Buat referral record
    await tx.referral.create({
      data: {
        ownerId: referralOwner.id,
        referredId: newUser.id,
        bonus,
        isPaid: bonus > 0,
        paidAt: bonus > 0 ? new Date() : undefined,
      },
    });

    // Tambah bonus ke owner jika ada
    if (bonus > 0) {
      await tx.user.update({
        where: { id: referralOwner.id },
        data: { balance: { increment: bonus } },
      });
    }
  });

  logger.info('Referral processed', {
    ownerId: referralOwner.id,
    referredId: newUser.id,
    bonus,
  });

  await activityLog.log({
    userId: referralOwner.id,
    action: 'REFERRAL_BONUS',
    description: `Bonus referral dari ${newUser.firstName}`,
    metadata: { referredId: newUser.id, bonus },
  });

  return { referralOwner, bonus };
}

/**
 * Get referral stats untuk user
 * @param {string} userId
 */
async function getUserStats(userId) {
  const [totalReferrals, totalBonus] = await Promise.all([
    prisma.referral.count({ where: { ownerId: userId } }),
    prisma.referral.aggregate({
      where: { ownerId: userId, isPaid: true },
      _sum: { bonus: true },
    }),
  ]);

  return {
    totalReferrals,
    totalBonus: parseFloat(totalBonus._sum.bonus || 0),
  };
}

module.exports = { processReferral, getUserStats };
