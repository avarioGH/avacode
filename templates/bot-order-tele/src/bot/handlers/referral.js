'use strict';

const userService = require('../../services/user');
const referralService = require('../../services/referral');
const settingsService = require('../../services/settings');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');
const config = require('../../config');

/**
 * Handler: tampilkan info referral
 */
async function handleReferral(ctx) {
  try {
    await ctx.answerCbQuery();
    const user = ctx.dbUser;
    const { totalReferrals, totalBonus } = await referralService.getUserStats(user.id);
    const referralBonus = await settingsService.get('referralBonus');
    const botUsername = config.bot.username;

    await safeEdit(
      ctx,
      msg.referralMessage(user, totalReferrals, totalBonus, botUsername, referralBonus),
      { parse_mode: 'HTML', ...kb.backToMain() },
    );
  } catch (error) {
    logger.error('handleReferral error:', error.message);
  }
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = { handleReferral };
