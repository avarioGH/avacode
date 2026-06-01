'use strict';

const userService = require('../../../services/user');
const kb = require('../../../utils/keyboard');
const msg = require('../../../utils/message');
const logger = require('../../../utils/logger');
const { formatCurrency } = require('../../../utils/formatter');

/**
 * ================================================================
 * ADMIN USER HANDLER
 * ================================================================
 */

const PER_PAGE = 10;

async function showUserList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const page = parseInt(ctx.callbackQuery.data.split(':')[3]) || 1;
  const { users, total } = await userService.getAll(page, PER_PAGE);

  await safeEdit(ctx, `👥 <b>Daftar User</b> (${total} total)\n\nPilih user:`, {
    parse_mode: 'HTML',
    ...kb.adminUserList(users, page, total, PER_PAGE),
  });
}

async function showUserDetail(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const userId = ctx.callbackQuery.data.split(':')[3];
  const user = await userService.getById(userId);
  if (!user) { await ctx.answerCbQuery('User tidak ditemukan.', { show_alert: true }); return; }

  await safeEdit(ctx, msg.adminUserDetailMessage(user), {
    parse_mode: 'HTML',
    ...kb.adminUserActions(userId, user.isBlocked),
  });
}

async function promptAddBalance(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const userId = ctx.callbackQuery.data.split(':')[3];
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_balance', userId };

  await safeEdit(ctx,
    '💰 <b>Tambah Saldo</b>\n\nMasukkan jumlah saldo yang ingin ditambahkan:',
    { parse_mode: 'HTML', ...kb.backButton(`adm:user:view:${userId}`) },
  );
}

async function promptSubBalance(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const userId = ctx.callbackQuery.data.split(':')[3];
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'sub_balance', userId };

  await safeEdit(ctx,
    '💸 <b>Kurangi Saldo</b>\n\nMasukkan jumlah saldo yang ingin dikurangi:',
    { parse_mode: 'HTML', ...kb.backButton(`adm:user:view:${userId}`) },
  );
}

async function handleBalanceInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || !['add_balance', 'sub_balance'].includes(session.type)) return false;

  const amount = parseFloat(ctx.message.text.replace(/[^0-9.]/g, ''));
  if (isNaN(amount) || amount <= 0) {
    await ctx.reply('❌ Nominal tidak valid.');
    return true;
  }

  const userId = session.userId;
  ctx.session.adminAction = null;

  if (session.type === 'add_balance') {
    await userService.addBalance(userId, amount, `Admin tambah saldo oleh ${ctx.from.first_name}`);
    await ctx.reply(`✅ Saldo <b>${formatCurrency(amount)}</b> berhasil ditambahkan!`, { parse_mode: 'HTML' });
  } else {
    await userService.deductBalance(userId, amount);
    await ctx.reply(`✅ Saldo <b>${formatCurrency(amount)}</b> berhasil dikurangi!`, { parse_mode: 'HTML' });
  }

  return true;
}

async function toggleUserBlock(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const userId = ctx.callbackQuery.data.split(':')[3];
  const user = await userService.getById(userId);
  if (!user) return;

  await userService.setBlocked(userId, !user.isBlocked);
  await ctx.answerCbQuery(user.isBlocked ? '✅ User di-unblock.' : '🚫 User diblokir.');
  // Refresh detail
  const updated = await userService.getById(userId);
  await safeEdit(ctx, msg.adminUserDetailMessage(updated), {
    parse_mode: 'HTML',
    ...kb.adminUserActions(userId, updated.isBlocked),
  });
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showUserList,
  showUserDetail,
  promptAddBalance,
  promptSubBalance,
  handleBalanceInput,
  toggleUserBlock,
};
