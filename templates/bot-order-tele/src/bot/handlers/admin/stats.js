'use strict';

const transactionService = require('../../../services/transaction');
const userService = require('../../../services/user');
const productService = require('../../../services/product');
const msg = require('../../../utils/message');
const kb = require('../../../utils/keyboard');
const logger = require('../../../utils/logger');

/**
 * ================================================================
 * ADMIN STATS HANDLER
 * ================================================================
 */

async function showStats(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const [txStats, userStats, topProducts] = await Promise.all([
    transactionService.getStats(),
    userService.getStats(),
    productService.getTopProducts(5),
  ]);

  const stats = {
    ...txStats,
    ...userStats,
    topProducts: topProducts.map((p) => ({
      name: p.name,
      count: p._count?.transactions || 0,
    })),
  };

  await safeEdit(ctx, msg.statsMessage(stats), {
    parse_mode: 'HTML',
    ...kb.backButton('adm:main', '⬅️ Panel Admin'),
  });
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = { showStats };
