'use strict';

const userService = require('../../services/user');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');

/**
 * Handler: tampilkan profil user
 */
async function handleProfile(ctx) {
  try {
    await ctx.answerCbQuery();
    const freshUser = await userService.getById(ctx.dbUser.id);
    await safeEdit(ctx, msg.profileMessage(freshUser), {
      parse_mode: 'HTML',
      ...kb.profileMenu(),
    });
  } catch (error) {
    logger.error('handleProfile error:', error.message);
  }
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = { handleProfile };
