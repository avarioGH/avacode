'use strict';

const { Markup } = require('telegraf');

/**
 * ================================================================
 * KEYBOARD BUILDERS
 * Semua inline keyboard builder terpusat di sini
 * ================================================================
 */

// ============================================================
// USER KEYBOARDS
// ============================================================

/**
 * Main menu keyboard
 */
function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🛒 Beli Produk', 'menu:shop'),
      Markup.button.callback('💰 Deposit Saldo', 'menu:deposit'),
    ],
    [
      Markup.button.callback('📦 Riwayat Transaksi', 'menu:history'),
      Markup.button.callback('👤 Profil Saya', 'menu:profile'),
    ],
    [
      Markup.button.callback('🎁 Referral', 'menu:referral'),
      Markup.button.callback('🎟️ Kode Promo', 'menu:voucher'),
    ],
    [
      Markup.button.url('📢 Channel Kami', 'https://t.me/example'),
      Markup.button.callback('📞 Hubungi Admin', 'menu:contact'),
    ],
  ]);
}

/**
 * Join channel keyboard
 * @param {Array} channels
 */
function joinChannel(channels) {
  const buttons = channels.map((ch) => [
    Markup.button.url(`📢 Gabung ${ch.channelName}`, ch.inviteLink),
  ]);
  buttons.push([Markup.button.callback('✅ Saya Sudah Join', 'channel:verify')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Back to main menu
 */
function backToMain() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🏠 Menu Utama', 'menu:main')],
  ]);
}

/**
 * Back button
 * @param {string} callbackData
 * @param {string} label
 */
function backButton(callbackData, label = '⬅️ Kembali') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(label, callbackData)],
    [Markup.button.callback('🏠 Menu Utama', 'menu:main')],
  ]);
}

/**
 * Category list keyboard
 * @param {Array} categories
 */
function categoryList(categories) {
  const buttons = [];
  const perRow = 2;
  for (let i = 0; i < categories.length; i += perRow) {
    const row = categories.slice(i, i + perRow).map((cat) =>
      Markup.button.callback(
        `${cat.emoji || '📁'} ${cat.name}`,
        `cat:${cat.id}`,
      ),
    );
    buttons.push(row);
  }
  buttons.push([Markup.button.callback('🏠 Menu Utama', 'menu:main')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Product list keyboard
 * @param {Array} products
 * @param {string} categoryId
 */
function productList(products, categoryId) {
  const buttons = products.map((prod) => [
    Markup.button.callback(
      `${prod.name} — Rp${parseInt(prod.price).toLocaleString('id-ID')}`,
      `prod:${prod.id}`,
    ),
  ]);
  buttons.push([
    Markup.button.callback('⬅️ Kategori', 'menu:shop'),
    Markup.button.callback('🏠 Menu Utama', 'menu:main'),
  ]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Product detail keyboard
 * @param {Object} product
 * @param {number} stock
 */
function productDetail(product, stock) {
  const buttons = [];
  if (stock > 0) {
    buttons.push([
      Markup.button.callback('🛒 Beli Sekarang', `buy:${product.id}`),
    ]);
  } else {
    buttons.push([
      Markup.button.callback('❌ Stok Habis', 'noop'),
    ]);
  }
  buttons.push([
    Markup.button.callback('⬅️ Kembali', `cat:${product.categoryId}`),
    Markup.button.callback('🏠 Menu Utama', 'menu:main'),
  ]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Payment method selection keyboard
 * @param {string} transactionId
 * @param {boolean} hasBalance
 * @param {number} userBalance
 * @param {number} amount
 */
function paymentMethodSelect(transactionId, hasBalance, userBalance, amount) {
  const buttons = [];

  if (hasBalance && userBalance >= amount) {
    buttons.push([
      Markup.button.callback('💰 Bayar dengan Saldo', `pay:balance:${transactionId}`),
    ]);
  }

  // Cek gateway apa yang aktif di .env
  if (process.env.PAYDISINI_API_KEY) {
    buttons.push([
      Markup.button.callback('📱 Bayar via QRIS', `paych:paydisini:QRIS:${transactionId}`),
    ]);
  } else if (process.env.PAKASIR_API_KEY) {
    buttons.push([
      Markup.button.callback('📱 Bayar via QRIS', `paych:pakasir:QRIS:${transactionId}`),
    ]);
  } else {
    // Jika tidak ada gateway yang diatur
    buttons.push([
      Markup.button.callback('⚠️ Gateway Belum Diatur', 'noop'),
    ]);
  }

  buttons.push([
    Markup.button.callback('❌ Batalkan', `pay:cancel:${transactionId}`),
  ]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Payment channel selection keyboard (Paydisini/Pakasir)
 * @param {string} gateway
 * @param {string} transactionId
 * @param {Array} channels
 */
function paymentChannelSelect(gateway, transactionId, channels) {
  const channelEmojis = {
    QRIS: '📱 QRIS',
    GOPAY: '💚 GoPay',
    OVO: '💜 OVO',
    DANA: '🔵 DANA',
    SHOPEEPAY: '🧡 ShopeePay',
    BCA: '🏦 BCA Virtual Account',
    BNI: '🏦 BNI Virtual Account',
    BRI: '🏦 BRI Virtual Account',
    MANDIRI: '🏦 Mandiri Virtual Account',
  };

  const buttons = channels.map((ch) => [
    Markup.button.callback(
      channelEmojis[ch] || `💳 ${ch}`,
      `paych:${gateway}:${ch}:${transactionId}`,
    ),
  ]);
  buttons.push([
    Markup.button.callback('⬅️ Metode Lain', `buy:method:${transactionId}`),
  ]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Payment status keyboard
 * @param {string} transactionId
 * @param {string} paymentUrl
 */
function paymentStatus(transactionId, paymentUrl) {
  const buttons = [];
  if (paymentUrl) {
    buttons.push([Markup.button.url('💳 Bayar Sekarang', paymentUrl)]);
  }
  buttons.push([
    Markup.button.callback('🔄 Cek Status Pembayaran', `pay:check:${transactionId}`),
  ]);
  buttons.push([
    Markup.button.callback('❌ Batalkan', `pay:cancel:${transactionId}`),
  ]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Transaction history keyboard
 * @param {Array} transactions
 * @param {number} page
 * @param {number} total
 * @param {number} perPage
 */
function transactionHistory(transactions, page, total, perPage) {
  const buttons = transactions.map((trx) => [
    Markup.button.callback(
      `#${trx.id.substring(0, 8)} — ${trx.product.name}`,
      `trx:${trx.id}`,
    ),
  ]);

  const nav = [];
  if (page > 1) nav.push(Markup.button.callback('⬅️ Prev', `history:${page - 1}`));
  if (page * perPage < total) nav.push(Markup.button.callback('Next ➡️', `history:${page + 1}`));
  if (nav.length > 0) buttons.push(nav);

  buttons.push([Markup.button.callback('🏠 Menu Utama', 'menu:main')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Profile keyboard
 */
function profileMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('💰 Deposit Saldo', 'menu:deposit'),
      Markup.button.callback('🎁 Referral Saya', 'menu:referral'),
    ],
    [Markup.button.callback('🏠 Menu Utama', 'menu:main')],
  ]);
}

/**
 * Deposit method selection
 */
function depositMethodSelect() {
  const buttons = [];

  if (process.env.PAYDISINI_API_KEY) {
    buttons.push([Markup.button.callback('📱 Deposit via QRIS', 'deposit:paydisini')]); // Ini nanti bisa diarahkan langsung ke QRIS di deposit.js jika perlu, tapi sementara labelnya saja yang diubah
  } else if (process.env.PAKASIR_API_KEY) {
    buttons.push([Markup.button.callback('📱 Deposit via QRIS', 'deposit:pakasir')]);
  } else {
    buttons.push([Markup.button.callback('⚠️ Gateway Belum Diatur', 'noop')]);
  }

  buttons.push([Markup.button.callback('🏠 Menu Utama', 'menu:main')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Confirm action keyboard
 * @param {string} confirmCallback
 * @param {string} cancelCallback
 */
function confirmAction(confirmCallback, cancelCallback = 'menu:main') {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Ya, Konfirmasi', confirmCallback),
      Markup.button.callback('❌ Batal', cancelCallback),
    ],
  ]);
}

// ============================================================
// ADMIN KEYBOARDS
// ============================================================

/**
 * Admin main panel keyboard
 */
function adminPanel() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📦 Kelola Produk', 'adm:product'),
      Markup.button.callback('👥 Kelola User', 'adm:user'),
    ],
    [
      Markup.button.callback('📊 Statistik', 'adm:stats'),
      Markup.button.callback('📢 Broadcast', 'adm:broadcast'),
    ],
    [
      Markup.button.callback('🎟️ Voucher', 'adm:voucher'),
      Markup.button.callback('⚙️ Pengaturan', 'adm:settings'),
    ],
    [
      Markup.button.callback('📋 Log Aktivitas', 'adm:logs'),
      Markup.button.callback('📣 Kelola Channel', 'adm:channel'),
    ],
  ]);
}

/**
 * Admin product panel
 */
function adminProductPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Tambah Kategori', 'adm:cat:add')],
    [Markup.button.callback('📋 Daftar Kategori', 'adm:cat:list')],
    [Markup.button.callback('➕ Tambah Produk', 'adm:prod:add')],
    [Markup.button.callback('📋 Daftar Produk', 'adm:prod:list')],
    [Markup.button.callback('📦 Kelola Stok', 'adm:stock:list')],
    [Markup.button.callback('⬅️ Panel Admin', 'adm:main')],
  ]);
}

/**
 * Admin product list
 * @param {Array} products
 * @param {number} page
 * @param {number} total
 */
function adminProductList(products, page = 1, total = 0) {
  const buttons = products.map((p) => [
    Markup.button.callback(
      `${p.isActive ? '✅' : '❌'} ${p.name}`,
      `adm:prod:view:${p.id}`,
    ),
  ]);

  const nav = [];
  if (page > 1) nav.push(Markup.button.callback('⬅️', `adm:prod:list:${page - 1}`));
  if (page * 10 < total) nav.push(Markup.button.callback('➡️', `adm:prod:list:${page + 1}`));
  if (nav.length > 0) buttons.push(nav);

  buttons.push([
    Markup.button.callback('⬅️ Produk', 'adm:product'),
    Markup.button.callback('🏠 Admin', 'adm:main'),
  ]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Admin product actions
 * @param {string} productId
 * @param {boolean} isActive
 */
function adminProductActions(productId, isActive) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✏️ Edit', `adm:prod:edit:${productId}`),
      Markup.button.callback(isActive ? '🔴 Nonaktifkan' : '🟢 Aktifkan', `adm:prod:toggle:${productId}`),
    ],
    [
      Markup.button.callback('📦 Tambah Stok', `adm:stock:add:${productId}`),
      Markup.button.callback('🗑️ Hapus Stok', `adm:stock:del:${productId}`),
    ],
    [
      Markup.button.callback('👁️ Lihat Stok', `adm:stock:view:${productId}`),
      Markup.button.callback('🗑️ Hapus Produk', `adm:prod:del:${productId}`),
    ],
    [Markup.button.callback('⬅️ Daftar Produk', 'adm:prod:list')],
  ]);
}

/**
 * Admin user list
 * @param {Array} users
 * @param {number} page
 * @param {number} total
 */
function adminUserList(users, page = 1, total = 0, perPage = 10) {
  const buttons = users.map((u) => [
    Markup.button.callback(
      `${u.isBlocked ? '🚫' : '👤'} ${u.firstName} ${u.username ? `(@${u.username})` : ''}`,
      `adm:user:view:${u.id}`,
    ),
  ]);

  const nav = [];
  if (page > 1) nav.push(Markup.button.callback('⬅️', `adm:user:list:${page - 1}`));
  if (page * perPage < total) nav.push(Markup.button.callback('➡️', `adm:user:list:${page + 1}`));
  if (nav.length > 0) buttons.push(nav);

  buttons.push([Markup.button.callback('⬅️ Panel Admin', 'adm:main')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Admin user actions
 * @param {string} userId
 * @param {boolean} isBlocked
 */
function adminUserActions(userId, isBlocked) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('💰 Tambah Saldo', `adm:user:addbal:${userId}`),
      Markup.button.callback('💸 Kurangi Saldo', `adm:user:subbal:${userId}`),
    ],
    [
      Markup.button.callback(
        isBlocked ? '🟢 Unblock' : '🚫 Block',
        `adm:user:toggle:${userId}`,
      ),
    ],
    [Markup.button.callback('⬅️ Daftar User', 'adm:user:list')],
  ]);
}

/**
 * Admin settings panel
 */
function adminSettingsPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🏪 Nama Toko', 'adm:set:shopname')],
    [Markup.button.callback('📝 Deskripsi Toko', 'adm:set:shopdesc')],
    [Markup.button.callback('🖼️ Banner Bot', 'adm:set:banner')],
    [Markup.button.callback('📣 Channel Wajib Join', 'adm:channel')],
    [Markup.button.callback('🎁 Bonus Referral', 'adm:set:referral')],
    [Markup.button.callback('🔗 URL Kontak Admin', 'adm:set:contact')],
    [Markup.button.callback('⬅️ Panel Admin', 'adm:main')],
  ]);
}

/**
 * Admin broadcast panel
 */
function adminBroadcastPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📝 Broadcast Teks', 'adm:bc:text')],
    [Markup.button.callback('🖼️ Broadcast dengan Gambar', 'adm:bc:image')],
    [Markup.button.callback('⬅️ Panel Admin', 'adm:main')],
  ]);
}

/**
 * Admin voucher panel
 */
function adminVoucherPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Buat Voucher', 'adm:voucher:add')],
    [Markup.button.callback('📋 Daftar Voucher', 'adm:voucher:list')],
    [Markup.button.callback('⬅️ Panel Admin', 'adm:main')],
  ]);
}

/**
 * Admin voucher actions
 * @param {string} voucherId
 * @param {boolean} isActive
 */
function adminVoucherActions(voucherId, isActive) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        isActive ? '🔴 Nonaktifkan' : '🟢 Aktifkan',
        `adm:voucher:toggle:${voucherId}`,
      ),
      Markup.button.callback('🗑️ Hapus', `adm:voucher:del:${voucherId}`),
    ],
    [Markup.button.callback('⬅️ Voucher', 'adm:voucher:list')],
  ]);
}

/**
 * Admin channel management
 */
function adminChannelPanel(channels) {
  const buttons = channels.map((ch) => [
    Markup.button.callback(
      `${ch.isActive ? '✅' : '❌'} ${ch.channelName}`,
      `adm:ch:view:${ch.id}`,
    ),
  ]);
  buttons.push([Markup.button.callback('➕ Tambah Channel', 'adm:ch:add')]);
  buttons.push([Markup.button.callback('⬅️ Panel Admin', 'adm:main')]);
  return Markup.inlineKeyboard(buttons);
}

// ============================================================
// OWNER KEYBOARDS
// ============================================================

/**
 * Owner panel keyboard
 */
function ownerPanel() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('👑 Kelola Admin', 'own:admin'),
      Markup.button.callback('💾 Backup DB', 'own:backup'),
    ],
    [
      Markup.button.callback('📊 Monitoring', 'own:monitor'),
      Markup.button.callback('📤 Export Data', 'own:export'),
    ],
    [Markup.button.callback('🔄 Restart Bot', 'own:restart')],
    [Markup.button.callback('⬅️ Panel Admin', 'adm:main')],
  ]);
}

/**
 * Admin list for owner
 * @param {Array} admins
 */
function ownerAdminList(admins) {
  const buttons = admins.map((adm) => [
    Markup.button.callback(
      `${adm.role === 'OWNER' ? '👑' : '👤'} ${adm.firstName}`,
      `own:admin:view:${adm.id}`,
    ),
  ]);
  buttons.push([Markup.button.callback('➕ Tambah Admin', 'own:admin:add')]);
  buttons.push([Markup.button.callback('⬅️ Panel Owner', 'own:main')]);
  return Markup.inlineKeyboard(buttons);
}

/**
 * Export data keyboard
 */
function ownerExportPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('👥 Export Data User', 'own:export:users')],
    [Markup.button.callback('📦 Export Data Transaksi', 'own:export:transactions')],
    [Markup.button.callback('⬅️ Panel Owner', 'own:main')],
  ]);
}

// Keyboard noop (button tidak aktif)
function noop(label = '—') {
  return Markup.inlineKeyboard([[Markup.button.callback(label, 'noop')]]);
}

module.exports = {
  // User
  mainMenu,
  joinChannel,
  backToMain,
  backButton,
  categoryList,
  productList,
  productDetail,
  paymentMethodSelect,
  paymentChannelSelect,
  paymentStatus,
  transactionHistory,
  profileMenu,
  depositMethodSelect,
  confirmAction,
  // Admin
  adminPanel,
  adminProductPanel,
  adminProductList,
  adminProductActions,
  adminUserList,
  adminUserActions,
  adminSettingsPanel,
  adminBroadcastPanel,
  adminVoucherPanel,
  adminVoucherActions,
  adminChannelPanel,
  // Owner
  ownerPanel,
  ownerAdminList,
  ownerExportPanel,
  // Misc
  noop,
};
