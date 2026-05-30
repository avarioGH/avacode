'use strict';

const userService = require('../../services/user');
const config = require('../../config');
const logger = require('../../utils/logger');
const prisma = require('../../database/client');

/**
 * ================================================================
 * AUTH MIDDLEWARE
 * Cek apakah user adalah admin atau owner
 * ================================================================
 */

/**
 * Cek apakah telegram ID adalah owner
 * @param {number|BigInt} telegramId
 */
function isOwner(telegramId) {
  return config.bot.ownerIds.includes(Number(telegramId));
}

/**
 * Cek apakah telegram ID adalah admin (dari DB)
 * @param {number|BigInt} telegramId
 */
async function isAdmin(telegramId) {
  if (isOwner(telegramId)) return true;
  const admin = await prisma.admin.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });
  return admin?.isActive === true;
}

/**
 * Middleware: pastikan user sudah terdaftar di database
 * dan update info terakhir aktif
 */
async function requireUser(ctx, next) {
  try {
    const from = ctx.from;
    if (!from) return;

    // Cek apakah ada referral dari start command
    const startPayload = ctx.startPayload;
    let referralCode = null;
    if (startPayload?.startsWith('ref_')) {
      referralCode = startPayload.replace('ref_', '');
    }

    const user = await userService.findOrCreate(from, referralCode);
    ctx.dbUser = user;

    if (user.isBlocked) {
      await ctx.reply(
        '🚫 Akun kamu telah diblokir. Hubungi admin jika ada kesalahan.',
      );
      return;
    }

    return next();
  } catch (error) {
    logger.error('requireUser middleware error:', error.message);
    return next();
  }
}

/**
 * Middleware: pastikan user adalah admin atau owner
 */
async function requireAdmin(ctx, next) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const adminStatus = await isAdmin(telegramId);
  if (!adminStatus) {
    await ctx.answerCbQuery?.('❌ Akses ditolak. Hanya admin yang bisa melakukan ini.', { show_alert: true });
    return;
  }

  // Attach admin info ke context
  const adminRecord = await prisma.admin.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });

  ctx.admin = adminRecord || {
    telegramId: BigInt(telegramId),
    firstName: ctx.from.first_name,
    role: isOwner(telegramId) ? 'OWNER' : 'ADMIN',
  };

  return next();
}

/**
 * Middleware: pastikan user adalah owner
 */
async function requireOwner(ctx, next) {
  const telegramId = ctx.from?.id;
  if (!telegramId || !isOwner(telegramId)) {
    await ctx.answerCbQuery?.('❌ Akses ditolak. Hanya owner yang bisa melakukan ini.', { show_alert: true });
    return;
  }

  ctx.isOwner = true;
  return next();
}

module.exports = { requireUser, requireAdmin, requireOwner, isAdmin, isOwner };
