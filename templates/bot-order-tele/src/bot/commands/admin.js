'use strict';

const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const settingsService = require('../../services/settings');
const userService = require('../../services/user');
const transactionService = require('../../services/transaction');
const activityLog = require('../../services/activityLog');
const logger = require('../../utils/logger');
const prisma = require('../../database/client');
const { formatDate } = require('../../utils/formatter');

/**
 * ================================================================
 * ADMIN COMMAND & PANEL
 * ================================================================
 */

/**
 * Handler /admin command
 */
async function handleAdminCommand(ctx) {
  try {
    const telegramId = ctx.from.id;
    const { isAdmin } = require('../middleware/auth');
    const adminOk = await isAdmin(telegramId);

    if (!adminOk) {
      await ctx.reply('❌ Akses ditolak. Kamu bukan admin.');
      return;
    }

    await showAdminPanel(ctx);
  } catch (error) {
    logger.error('handleAdminCommand error:', error.message);
  }
}

/**
 * Tampilkan panel admin
 */
async function showAdminPanel(ctx) {
  try {
    const admin = ctx.admin || {
      firstName: ctx.from.first_name,
      role: 'ADMIN',
    };

    // Quick stats
    const [userStats, txStats] = await Promise.all([
      userService.getStats(),
      transactionService.getStats(),
    ]);

    const quickStats = {
      totalUsers: userStats.totalUsers,
      totalOrders: txStats.totalOrders,
      totalRevenue: txStats.totalRevenue,
    };

    const message = msg.adminPanelMessage(admin, quickStats);

    const opts = {
      parse_mode: 'HTML',
      ...kb.adminPanel(),
    };

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      try {
        await ctx.editMessageText(message, opts);
      } catch {
        await ctx.reply(message, opts);
      }
    } else {
      await ctx.reply(message, opts);
    }
  } catch (error) {
    logger.error('showAdminPanel error:', error.message);
  }
}

module.exports = { handleAdminCommand, showAdminPanel };
