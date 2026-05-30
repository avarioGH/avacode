'use strict';

const backupService = require('../../../services/backup');
const activityLog = require('../../../services/activityLog');
const kb = require('../../../utils/keyboard');
const logger = require('../../../utils/logger');
const config = require('../../../config');
const { formatDate, formatNumber } = require('../../../utils/formatter');
const prisma = require('../../../database/client');
const os = require('os');

/**
 * ================================================================
 * OWNER HANDLER
 * ================================================================
 */

// --- Panel owner ---
async function showOwnerPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, `👑 <b>Panel Owner</b>\n\nPilih tindakan:`, {
    parse_mode: 'HTML',
    ...kb.ownerPanel(),
  });
}

// --- Kelola Admin ---
async function showAdminList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const admins = await prisma.admin.findMany({ where: { isActive: true }, orderBy: { addedAt: 'asc' } });

  await safeEdit(ctx, `👥 <b>Daftar Admin</b> (${admins.length})\n\nPilih admin:`, {
    parse_mode: 'HTML',
    ...kb.ownerAdminList(admins),
  });
}

async function showAdminDetail(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const adminId = ctx.callbackQuery.data.split(':')[3];
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return;

  const { Markup } = require('telegraf');
  await safeEdit(ctx,
    `👤 <b>Detail Admin</b>\n\n` +
    `🆔 TG ID: <code>${admin.telegramId}</code>\n` +
    `👤 Nama: ${admin.firstName}\n` +
    `📱 Username: ${admin.username ? `@${admin.username}` : '-'}\n` +
    `👑 Role: ${admin.role}\n` +
    `📅 Ditambahkan: ${formatDate(admin.addedAt, false)}`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🗑️ Hapus Admin', `own:admin:del:${adminId}`)],
        [Markup.button.callback('⬅️ Daftar Admin', 'own:admin')],
      ]),
    },
  );
}

async function promptAddAdmin(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_admin', step: 'id' };

  await safeEdit(ctx,
    `➕ <b>Tambah Admin</b>\n\nMasukkan Telegram ID admin baru:`,
    { parse_mode: 'HTML', ...kb.backButton('own:admin') },
  );
}

async function handleAddAdminInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_admin') return false;

  const text = ctx.message.text.trim();

  if (session.step === 'id') {
    const telegramId = parseInt(text);
    if (isNaN(telegramId)) { await ctx.reply('❌ ID tidak valid.'); return true; }

    session.telegramId = telegramId;
    session.step = 'name';
    await ctx.reply('Masukkan nama admin:');
    return true;
  }

  if (session.step === 'name') {
    const firstName = text;
    const telegramId = session.telegramId;
    ctx.session.adminAction = null;

    const existing = await prisma.admin.findUnique({ where: { telegramId: BigInt(telegramId) } });
    if (existing) {
      await ctx.reply('⚠️ Admin ini sudah terdaftar.');
      return true;
    }

    await prisma.admin.create({
      data: {
        telegramId: BigInt(telegramId),
        firstName,
        role: 'ADMIN',
        addedBy: BigInt(ctx.from.id),
      },
    });

    await ctx.reply(`✅ Admin <b>${firstName}</b> (ID: <code>${telegramId}</code>) berhasil ditambahkan!`, {
      parse_mode: 'HTML',
    });

    await activityLog.log({
      telegramId: ctx.from.id,
      action: 'ADMIN_ADD',
      description: `Tambah admin: ${firstName} (${telegramId})`,
    });

    return true;
  }

  return false;
}

async function deleteAdmin(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const adminId = ctx.callbackQuery.data.split(':')[3];
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return;

  // Jangan hapus owner dari env
  if (config.bot.ownerIds.includes(Number(admin.telegramId))) {
    await ctx.answerCbQuery('❌ Tidak bisa menghapus owner.', { show_alert: true });
    return;
  }

  await prisma.admin.update({ where: { id: adminId }, data: { isActive: false } });
  await ctx.answerCbQuery('✅ Admin dihapus.');

  await activityLog.log({
    telegramId: ctx.from.id,
    action: 'ADMIN_REMOVE',
    description: `Hapus admin: ${admin.firstName}`,
  });

  await showAdminList(ctx);
}

// --- Backup ---
async function createBackup(ctx) {
  await ctx.answerCbQuery('⏳ Membuat backup...').catch(() => {});
  await safeEdit(ctx, '💾 <b>Membuat backup database...</b>', { parse_mode: 'HTML' });

  try {
    const result = await backupService.createBackup();
    await ctx.reply(
      `✅ <b>Backup Berhasil!</b>\n\n` +
      `📁 File: <code>${result.filename}</code>\n` +
      `📦 Ukuran: ${result.size}\n` +
      `📅 Waktu: ${formatDate(new Date())}`,
      { parse_mode: 'HTML', ...kb.backButton('own:main') },
    );
  } catch (error) {
    await ctx.reply(`❌ Backup gagal: ${error.message}`, { parse_mode: 'HTML' });
  }
}

// --- Monitoring ---
async function showMonitoring(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const uptime = process.uptime();

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return `${h}j ${m}m ${sec}d`;
  };

  const formatMem = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  await safeEdit(ctx,
    `📊 <b>Monitoring Server</b>\n\n` +
    `🖥️ <b>System:</b>\n` +
    `• OS: ${os.platform()} ${os.release()}\n` +
    `• CPU: ${os.cpus()[0]?.model || 'Unknown'}\n` +
    `• CPU Cores: ${os.cpus().length}\n\n` +
    `💾 <b>Memory:</b>\n` +
    `• Total: ${formatMem(totalMem)}\n` +
    `• Digunakan: ${formatMem(usedMem)}\n` +
    `• Bebas: ${formatMem(freeMem)}\n\n` +
    `⏱️ <b>Bot Uptime:</b> ${formatUptime(uptime)}\n` +
    `📅 <b>Waktu:</b> ${formatDate(new Date())}\n` +
    `🔢 <b>Node.js:</b> ${process.version}`,
    {
      parse_mode: 'HTML',
      ...kb.backButton('own:main', '⬅️ Panel Owner'),
    },
  );
}

// --- Export Data ---
async function showExportPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, '📤 <b>Export Data</b>\n\nPilih data yang ingin diexport:', {
    parse_mode: 'HTML',
    ...kb.ownerExportPanel(),
  });
}

async function exportUsers(ctx) {
  await ctx.answerCbQuery('⏳ Mengexport data...').catch(() => {});

  const users = await prisma.user.findMany({
    orderBy: { joinedAt: 'desc' },
    select: {
      telegramId: true,
      username: true,
      firstName: true,
      lastName: true,
      balance: true,
      totalOrders: true,
      totalSpent: true,
      joinedAt: true,
      isBlocked: true,
    },
  });

  const csv = [
    'Telegram ID,Username,Nama Depan,Nama Belakang,Saldo,Total Order,Total Spent,Tanggal Join,Status',
    ...users.map((u) =>
      `${u.telegramId},${u.username || ''},${u.firstName},${u.lastName || ''},${u.balance},${u.totalOrders},${u.totalSpent},${u.joinedAt.toISOString()},${u.isBlocked ? 'Blocked' : 'Active'}`
    ),
  ].join('\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const filename = `users-${timestamp}.csv`;

  await ctx.replyWithDocument(
    { source: Buffer.from(csv, 'utf-8'), filename },
    { caption: `📤 Export ${formatNumber(users.length)} user berhasil.`, parse_mode: 'HTML' },
  );
}

async function exportTransactions(ctx) {
  await ctx.answerCbQuery('⏳ Mengexport data...').catch(() => {});

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5000, // Limit
    include: {
      user: { select: { firstName: true, username: true, telegramId: true } },
      product: { select: { name: true } },
    },
  });

  const csv = [
    'ID,User ID,Username,Produk,Jumlah,Diskon,Total,Metode,Status,Tanggal',
    ...transactions.map((t) =>
      `${t.id},${t.user.telegramId},${t.user.username || ''},${t.product.name},${t.finalAmount},${t.discount},${t.finalAmount},${t.paymentMethod},${t.status},${t.createdAt.toISOString()}`
    ),
  ].join('\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const filename = `transactions-${timestamp}.csv`;

  await ctx.replyWithDocument(
    { source: Buffer.from(csv, 'utf-8'), filename },
    { caption: `📤 Export ${formatNumber(transactions.length)} transaksi berhasil.`, parse_mode: 'HTML' },
  );
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showOwnerPanel,
  showAdminList,
  showAdminDetail,
  promptAddAdmin,
  handleAddAdminInput,
  deleteAdmin,
  createBackup,
  showMonitoring,
  showExportPanel,
  exportUsers,
  exportTransactions,
};
