'use strict';

const logger = require('../../utils/logger');

/**
 * ================================================================
 * LOGGER MIDDLEWARE
 * Log semua incoming messages dan callback queries
 * ================================================================
 */
function botLogger() {
  return async (ctx, next) => {
    const start = Date.now();
    const userId = ctx.from?.id;
    const username = ctx.from?.username;

    let action = '';
    if (ctx.message?.text) {
      action = `MSG: ${ctx.message.text.substring(0, 50)}`;
    } else if (ctx.callbackQuery?.data) {
      action = `CB: ${ctx.callbackQuery.data.substring(0, 50)}`;
    } else if (ctx.updateType) {
      action = ctx.updateType;
    }

    await next();

    const ms = Date.now() - start;
    logger.debug('Bot request', {
      userId,
      username,
      action,
      ms,
    });
  };
}

module.exports = { botLogger };
