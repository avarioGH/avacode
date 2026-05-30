'use strict';

const { Telegraf, session } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const config = require('../config');
const logger = require('../utils/logger');

// Middleware
const { requireUser, requireAdmin, requireOwner } = require('./middleware/auth');
const { rateLimiter, antiSpam } = require('./middleware/rateLimiter');
const { channelCheck, handleChannelVerify } = require('./middleware/channelCheck');
const { botLogger } = require('./middleware/logger');

// Commands
const { handleStart, handleMainMenu } = require('./commands/start');
const { handleAdminCommand, showAdminPanel } = require('./commands/admin');
const { handleOwnerCommand, showOwnerPanel: showOwnerPanelCmd } = require('./commands/owner');

// User Handlers
const productHandler = require('./handlers/product');
const paymentHandler = require('./handlers/payment');
const profileHandler = require('./handlers/profile');
const historyHandler = require('./handlers/history');
const depositHandler = require('./handlers/deposit');
const referralHandler = require('./handlers/referral');

// Admin Handlers
const adminProductHandler = require('./handlers/admin/product');
const adminUserHandler = require('./handlers/admin/user');
const adminStatsHandler = require('./handlers/admin/stats');
const adminSettingsHandler = require('./handlers/admin/settings');
const adminBroadcastHandler = require('./handlers/admin/broadcast');
const adminVoucherHandler = require('./handlers/admin/voucher');
const adminChannelHandler = require('./handlers/admin/channel');

// Owner Handler
const ownerHandler = require('./handlers/owner');

/**
 * ================================================================
 * BOT INITIALIZATION
 * ================================================================
 */
function createBot() {
  const bot = new Telegraf(config.bot.token);

  // ============================================================
  // SESSION
  // ============================================================
  const localSession = new LocalSession({
    database: config.session.dbPath,
    property: 'session',
    storage: LocalSession.storageFileAsync,
    format: { serialize: JSON.stringify, deserialize: JSON.parse },
  });
  bot.use(localSession.middleware());

  // ============================================================
  // GLOBAL MIDDLEWARE
  // ============================================================
  bot.use(botLogger());
  bot.use(rateLimiter());

  // ============================================================
  // COMMANDS
  // ============================================================

  // /start — dengan requireUser (daftar user otomatis)
  bot.start(requireUser, channelCheck(), handleStart);

  // /admin
  bot.command('admin', requireUser, handleAdminCommand);

  // /owner
  bot.command('owner', requireUser, handleOwnerCommand);

  // /help
  bot.command('help', requireUser, async (ctx) => {
    await ctx.reply(
      `ℹ️ <b>Bantuan Bot</b>\n\n` +
      `/start — Mulai bot\n` +
      `/admin — Panel admin\n\n` +
      `Hubungi admin jika ada kendala.`,
      { parse_mode: 'HTML' },
    );
  });

  // ============================================================
  // CALLBACK QUERY HANDLER
  // ============================================================
  bot.on('callback_query', requireUser, antiSpam(), async (ctx) => {
    const data = ctx.callbackQuery?.data || '';

    // Noop
    if (data === 'noop') {
      await ctx.answerCbQuery();
      return;
    }

    // Channel verify (skip channel check)
    if (data === 'channel:verify') {
      return handleChannelVerify(ctx);
    }

    // Semua callback lain melewati channel check
    await channelCheck()(ctx, async () => {
      try {
        // ===========================
        // USER CALLBACKS
        // ===========================
        if (data === 'menu:main') return handleMainMenu(ctx);
        if (data === 'menu:shop') return productHandler.handleShop(ctx);
        if (data === 'menu:profile') return profileHandler.handleProfile(ctx);
        if (data === 'menu:history') return historyHandler.handleHistory(ctx);
        if (data === 'menu:deposit') return depositHandler.handleDeposit(ctx);
        if (data === 'menu:referral') return referralHandler.handleReferral(ctx);
        if (data === 'menu:voucher') return depositHandler.handleVoucherMenu(ctx);
        if (data === 'menu:contact') {
          await ctx.answerCbQuery();
          return;
        }

        // Kategori
        if (data.startsWith('cat:')) return productHandler.handleCategory(ctx);
        // Produk
        if (data.startsWith('prod:')) return productHandler.handleProduct(ctx);
        // Beli
        if (data.startsWith('buy:') && !data.startsWith('buy:method:')) return paymentHandler.handleBuy(ctx);
        // Pilih metode bayar
        if (data.startsWith('pay:balance:')) return paymentHandler.handlePayWithBalance(ctx);
        if (data.startsWith('pay:paydisini:')) return paymentHandler.handlePaydisiniSelect(ctx);
        if (data.startsWith('pay:pakasir:')) return paymentHandler.handlePakasirSelect(ctx);
        if (data.startsWith('pay:check:')) return paymentHandler.handleCheckPayment(ctx);
        if (data.startsWith('pay:cancel:')) return paymentHandler.handleCancelPayment(ctx);
        // Payment channel
        if (data.startsWith('paych:')) return paymentHandler.handleCreateInvoice(ctx);
        // History
        if (data.startsWith('history:')) return historyHandler.handleHistoryPage(ctx);
        if (data.startsWith('trx:')) return historyHandler.handleTransactionDetail(ctx);
        // Deposit
        if (data.startsWith('deposit:')) return depositHandler.handleDepositMethod(ctx);
        if (data.startsWith('dep:check:')) return depositHandler.handleCheckDeposit(ctx);

        // ===========================
        // ADMIN CALLBACKS
        // ===========================
        if (data.startsWith('adm:') || data.startsWith('own:')) {
          const adminOk = await requireAdmin(ctx, () => Promise.resolve());
          // requireAdmin sets ctx.admin and calls next if ok
          // We call it directly
          const { isAdmin } = require('./middleware/auth');
          if (!(await isAdmin(ctx.from.id))) {
            await ctx.answerCbQuery('❌ Akses ditolak.', { show_alert: true });
            return;
          }

          // Set admin context
          const prisma = require('../database/client');
          const adminRecord = await prisma.admin.findUnique({
            where: { telegramId: BigInt(ctx.from.id) },
          });
          const { isOwner } = require('./middleware/auth');
          ctx.admin = adminRecord || {
            telegramId: BigInt(ctx.from.id),
            firstName: ctx.from.first_name,
            role: isOwner(ctx.from.id) ? 'OWNER' : 'ADMIN',
          };

          // Admin Panel
          if (data === 'adm:main') return showAdminPanel(ctx);
          if (data === 'adm:product') return adminProductHandler.showProductPanel(ctx);
          if (data === 'adm:prod:list' || data.startsWith('adm:prod:list:')) return adminProductHandler.showProductList(ctx);
          if (data.startsWith('adm:prod:view:')) return adminProductHandler.showProductDetail(ctx);
          if (data.startsWith('adm:prod:toggle:')) return adminProductHandler.toggleProduct(ctx);
          if (data.startsWith('adm:prod:del:')) return adminProductHandler.deleteProduct(ctx);
          if (data.startsWith('adm:prod:delconfirm:')) return adminProductHandler.confirmDeleteProduct(ctx);
          if (data === 'adm:prod:add') return adminProductHandler.promptAddProduct(ctx);
          if (data.startsWith('adm:prod:setcat:')) return adminProductHandler.handleSetCategory(ctx);
          if (data === 'adm:cat:add') return adminProductHandler.promptAddCategory(ctx);
          if (data === 'adm:cat:list') return adminProductHandler.showCategoryList(ctx);
          if (data.startsWith('adm:stock:view:')) return adminProductHandler.showStockView(ctx);
          if (data.startsWith('adm:stock:add:')) return adminProductHandler.promptAddStock(ctx);
          if (data.startsWith('adm:stock:del:')) return adminProductHandler.promptDeleteStock(ctx);
          if (data.startsWith('adm:stock:clearall:')) return adminProductHandler.confirmClearStock(ctx);
          if (data === 'adm:stock:list') return adminProductHandler.showStockList(ctx);

          // User
          if (data === 'adm:user' || data === 'adm:user:list' || data.startsWith('adm:user:list:')) return adminUserHandler.showUserList(ctx);
          if (data.startsWith('adm:user:view:')) return adminUserHandler.showUserDetail(ctx);
          if (data.startsWith('adm:user:addbal:')) return adminUserHandler.promptAddBalance(ctx);
          if (data.startsWith('adm:user:subbal:')) return adminUserHandler.promptSubBalance(ctx);
          if (data.startsWith('adm:user:toggle:')) return adminUserHandler.toggleUserBlock(ctx);

          // Stats
          if (data === 'adm:stats') return adminStatsHandler.showStats(ctx);

          // Broadcast
          if (data === 'adm:broadcast') return adminBroadcastHandler.showBroadcastPanel(ctx);
          if (data === 'adm:bc:text') return adminBroadcastHandler.promptBroadcastText(ctx);
          if (data === 'adm:bc:image') return adminBroadcastHandler.promptBroadcastImage(ctx);
          if (data === 'adm:bc:confirm') return adminBroadcastHandler.confirmBroadcast(ctx);

          // Settings
          if (data === 'adm:settings') return adminSettingsHandler.showSettingsPanel(ctx);
          if (data === 'adm:set:shopname') return adminSettingsHandler.handleShopName(ctx);
          if (data === 'adm:set:shopdesc') return adminSettingsHandler.handleShopDesc(ctx);
          if (data === 'adm:set:banner') return adminSettingsHandler.handleBannerUrl(ctx);
          if (data === 'adm:set:referral') return adminSettingsHandler.handleReferralBonus(ctx);
          if (data === 'adm:set:contact') return adminSettingsHandler.handleContactUrl(ctx);

          // Voucher
          if (data === 'adm:voucher') return adminVoucherHandler.showVoucherPanel(ctx);
          if (data === 'adm:voucher:list') return adminVoucherHandler.showVoucherList(ctx);
          if (data.startsWith('adm:voucher:view:')) return adminVoucherHandler.showVoucherDetail(ctx);
          if (data === 'adm:voucher:add') return adminVoucherHandler.promptAddVoucher(ctx);
          if (data.startsWith('adm:voucher:toggle:')) return adminVoucherHandler.toggleVoucher(ctx);
          if (data.startsWith('adm:voucher:del:')) return adminVoucherHandler.deleteVoucher(ctx);

          // Channel
          if (data === 'adm:channel') return adminChannelHandler.showChannelPanel(ctx);
          if (data === 'adm:ch:add') return adminChannelHandler.promptAddChannel(ctx);
          if (data.startsWith('adm:ch:view:')) return adminChannelHandler.showChannelDetail(ctx);
          if (data.startsWith('adm:ch:toggle:')) return adminChannelHandler.toggleChannel(ctx);
          if (data.startsWith('adm:ch:del:')) return adminChannelHandler.deleteChannel(ctx);

          // Logs
          if (data === 'adm:logs') {
            const activityLog = require('../services/activityLog');
            const { logs, total } = await activityLog.getRecent(1, 10);
            const { formatRelativeTime } = require('../utils/formatter');
            const logText = logs.map((l) =>
              `• [${formatRelativeTime(l.createdAt)}] <b>${l.action}</b>: ${l.description}`
            ).join('\n');
            await ctx.answerCbQuery();
            try {
              await ctx.editMessageText(
                `📋 <b>Log Aktivitas Terbaru</b>\n\n${logText || 'Belum ada log.'}`,
                { parse_mode: 'HTML', ...require('../utils/keyboard').backButton('adm:main') },
              );
            } catch {
              await ctx.reply(`📋 <b>Log Aktivitas Terbaru</b>\n\n${logText}`, { parse_mode: 'HTML' });
            }
            return;
          }

          // ===========================
          // OWNER CALLBACKS
          // ===========================
          if (data.startsWith('own:')) {
            if (!isOwner(ctx.from.id)) {
              await ctx.answerCbQuery('❌ Hanya owner yang bisa mengakses ini.', { show_alert: true });
              return;
            }
            if (data === 'own:main') return ownerHandler.showOwnerPanel(ctx);
            if (data === 'own:admin') return ownerHandler.showAdminList(ctx);
            if (data === 'own:admin:add') return ownerHandler.promptAddAdmin(ctx);
            if (data.startsWith('own:admin:view:')) return ownerHandler.showAdminDetail(ctx);
            if (data.startsWith('own:admin:del:')) return ownerHandler.deleteAdmin(ctx);
            if (data === 'own:backup') return ownerHandler.createBackup(ctx);
            if (data === 'own:monitor') return ownerHandler.showMonitoring(ctx);
            if (data === 'own:export') return ownerHandler.showExportPanel(ctx);
            if (data === 'own:export:users') return ownerHandler.exportUsers(ctx);
            if (data === 'own:export:transactions') return ownerHandler.exportTransactions(ctx);
            if (data === 'own:restart') {
              await ctx.answerCbQuery();
              await ctx.reply('🔄 Bot akan restart...');
              setTimeout(() => process.exit(0), 1000);
              return;
            }
          }
        }

        // Unknown callback
        await ctx.answerCbQuery().catch(() => {});
      } catch (error) {
        logger.error('Callback handler error:', { data, error: error.message });
        await ctx.answerCbQuery('❌ Terjadi kesalahan. Coba lagi.', { show_alert: true }).catch(() => {});
      }
    });
  });

  // ============================================================
  // TEXT MESSAGE HANDLER
  // Router untuk input yang menunggu dari admin/user session
  // ============================================================
  bot.on('text', requireUser, channelCheck(), async (ctx) => {
    try {
      const session = ctx.session?.adminAction;

      // Admin input handlers
      if (session) {
        const { isAdmin } = require('./middleware/auth');
        if (await isAdmin(ctx.from.id)) {
          if (await adminProductHandler.handleAddStockInput(ctx)) return;
          if (await adminProductHandler.handleAddProductInput(ctx)) return;
          if (await adminProductHandler.handleAddCategoryInput(ctx)) return;
          if (await adminUserHandler.handleBalanceInput(ctx)) return;
          if (await adminSettingsHandler.handleSettingInput(ctx)) return;
          if (await adminBroadcastHandler.handleBroadcastInput(ctx)) return;
          if (await adminVoucherHandler.handleAddVoucherInput(ctx)) return;
          if (await adminChannelHandler.handleAddChannelInput(ctx)) return;
          if (await ownerHandler.handleAddAdminInput(ctx)) return;
        }
      }

      // User input handlers
      if (ctx.session?.awaitingDepositAmount) {
        if (await depositHandler.handleDepositAmountInput(ctx)) return;
      }

      if (ctx.session?.awaitingVoucher) {
        if (await depositHandler.handleVoucherInput(ctx)) return;
      }
    } catch (error) {
      logger.error('Text handler error:', error.message);
    }
  });

  // ============================================================
  // ERROR HANDLER
  // ============================================================
  bot.catch((err, ctx) => {
    logger.error('Bot error', {
      error: err.message,
      stack: err.stack,
      userId: ctx.from?.id,
      updateType: ctx.updateType,
    });
  });

  return bot;
}

module.exports = { createBot };
