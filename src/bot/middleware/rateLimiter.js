'use strict';

const config = require('../../config');

/**
 * ================================================================
 * RATE LIMITER MIDDLEWARE
 * Mencegah spam dengan membatasi request per user per window
 * ================================================================
 */

const userRateLimits = new Map();
const userLastRequest = new Map();

/**
 * Rate limiter middleware
 * @param {number} maxRequests - max request per window
 * @param {number} windowMs - window dalam milidetik
 */
function rateLimiter(maxRequests = config.rateLimit.max, windowMs = config.rateLimit.windowMs) {
  return async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    const now = Date.now();
    const key = String(userId);

    if (!userRateLimits.has(key)) {
      userRateLimits.set(key, { count: 0, resetAt: now + windowMs });
    }

    const limit = userRateLimits.get(key);

    // Reset jika window sudah lewat
    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + windowMs;
    }

    limit.count++;

    if (limit.count > maxRequests) {
      const resetIn = Math.ceil((limit.resetAt - now) / 1000);
      await ctx.answerCbQuery?.(
        `⏳ Terlalu banyak permintaan. Coba lagi dalam ${resetIn} detik.`,
        { show_alert: true },
      );
      return; // Drop request
    }

    return next();
  };
}

/**
 * Anti-spam middleware: throttle request per user
 * Mencegah klik cepat berulang pada button yang sama
 */
function antiSpam(throttleMs = config.rateLimit.spamThrottleMs) {
  return async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    const key = String(userId);
    const now = Date.now();
    const lastReq = userLastRequest.get(key) || 0;

    if (now - lastReq < throttleMs) {
      await ctx.answerCbQuery?.('⏳ Harap tunggu sebentar...').catch(() => {});
      return;
    }

    userLastRequest.set(key, now);
    return next();
  };
}

// Cleanup map setiap 10 menit untuk mencegah memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of userRateLimits.entries()) {
    if (now > limit.resetAt) userRateLimits.delete(key);
  }
  // Hapus last request yang sudah > 5 menit
  for (const [key, lastReq] of userLastRequest.entries()) {
    if (now - lastReq > 5 * 60 * 1000) userLastRequest.delete(key);
  }
}, 10 * 60 * 1000);

module.exports = { rateLimiter, antiSpam };
