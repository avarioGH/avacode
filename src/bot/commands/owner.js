'use strict';

const kb = require('../../utils/keyboard');
const logger = require('../../utils/logger');
const prisma = require('../../database/client');

/**
 * ================================================================
 * OWNER COMMAND
 * ================================================================
 */

async function handleOwnerCommand(ctx) {
  try {
    const { isOwner } = require('../middleware/auth');
    if (!isOwner(ctx.from.id)) {
      await ctx.reply('❌ Akses ditolak.');
      return;
    }
    await showOwnerPanel(ctx);
  } catch (error) {
    logger.error('handleOwnerCommand error:', error.message);
  }
}

async function showOwnerPanel(ctx) {
  try {
    const message =
      `👑 <b>Panel Owner</b>\n\n` +
      `Selamat datang, <b>${ctx.from.first_name}</b>!\n\n` +
      `Pilih menu:`;

    const opts = {
      parse_mode: 'HTML',
      ...kb.ownerPanel(),
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
    logger.error('showOwnerPanel error:', error.message);
  }
}

module.exports = { handleOwnerCommand, showOwnerPanel };
