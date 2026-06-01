'use strict';

const transactionService = require('../../services/transaction');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');

const PER_PAGE = 10;

/**
 * Handler: tampilkan riwayat transaksi
 */
async function handleHistory(ctx) {
  try {
    await ctx.answerCbQuery();
    const page = 1;
    await showHistory(ctx, page);
  } catch (error) {
    logger.error('handleHistory error:', error.message);
  }
}

/**
 * Handler: navigasi halaman riwayat
 */
async function handleHistoryPage(ctx) {
  try {
    await ctx.answerCbQuery();
    const page = parseInt(ctx.callbackQuery.data.split(':')[1]) || 1;
    await showHistory(ctx, page);
  } catch (error) {
    logger.error('handleHistoryPage error:', error.message);
  }
}

/**
 * Handler: detail transaksi
 */
async function handleTransactionDetail(ctx) {
  try {
    await ctx.answerCbQuery();
    const transactionId = ctx.callbackQuery.data.split(':')[1];
    const transaction = await transactionService.getById(transactionId);

    if (!transaction || transaction.userId !== ctx.dbUser.id) {
      await ctx.answerCbQuery('Transaksi tidak ditemukan.', { show_alert: true });
      return;
    }

    await safeEdit(ctx, msg.transactionDetailMessage(transaction), {
      parse_mode: 'HTML',
      ...kb.backButton('menu:history', '⬅️ Riwayat'),
    });
  } catch (error) {
    logger.error('handleTransactionDetail error:', error.message);
  }
}

async function showHistory(ctx, page) {
  const { transactions, total } = await transactionService.getByUser(
    ctx.dbUser.id,
    page,
    PER_PAGE,
  );

  if (total === 0) {
    await safeEdit(ctx, '📦 <b>Riwayat Transaksi</b>\n\nKamu belum memiliki transaksi.', {
      parse_mode: 'HTML',
      ...kb.backToMain(),
    });
    return;
  }

  await safeEdit(ctx, msg.transactionListHeader(total, page), {
    parse_mode: 'HTML',
    ...kb.transactionHistory(transactions, page, total, PER_PAGE),
  });
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = { handleHistory, handleHistoryPage, handleTransactionDetail };
