'use strict';

const {
  formatCurrency,
  formatDate,
  formatTransactionStatus,
  formatPaymentMethod,
  formatRelativeTime,
  escapeHtml,
  formatNumber,
} = require('./formatter');

/**
 * ================================================================
 * MESSAGE TEMPLATES
 * Semua template pesan HTML Telegram terpusat di sini
 * ================================================================
 */

// ============================================================
// USER MESSAGES
// ============================================================

/**
 * Welcome / Start message
 */
function welcomeMessage(user, settings) {
  const shopName = settings.shopName || 'AVA Shop';
  const shopDesc = settings.shopDesc || 'Selamat datang di toko digital kami!';

  return (
    `✨ <b>Selamat datang di ${escapeHtml(shopName)}!</b>\n\n` +
    `👋 Halo, <b>${escapeHtml(user.firstName)}</b>!\n\n` +
    `${escapeHtml(shopDesc)}\n\n` +
    `💰 <b>Saldo kamu:</b> ${formatCurrency(user.balance)}\n\n` +
    `Pilih menu di bawah untuk memulai:`
  );
}

/**
 * Channel join required message
 */
function channelJoinRequired() {
  return (
    `⚠️ <b>Wajib Join Channel!</b>\n\n` +
    `Untuk menggunakan bot ini, kamu harus bergabung ke channel kami terlebih dahulu.\n\n` +
    `📢 Klik tombol di bawah untuk bergabung, lalu tekan <b>✅ Saya Sudah Join</b>.`
  );
}

/**
 * Product category list message
 */
function categoryListMessage(shopName) {
  return (
    `🛒 <b>Pilih Kategori Produk</b>\n\n` +
    `Selamat berbelanja di <b>${escapeHtml(shopName || 'toko kami')}</b>!\n` +
    `Pilih kategori produk yang ingin kamu beli:`
  );
}

/**
 * Product list message
 * @param {Object} category
 * @param {Array} products
 */
function productListMessage(category, products) {
  const total = products.reduce((sum, p) => {
    const stock = p.stocks ? p.stocks.filter((s) => !s.isUsed).length : 0;
    return sum + stock;
  }, 0);

  return (
    `${category.emoji || '📁'} <b>${escapeHtml(category.name)}</b>\n\n` +
    `📦 <b>${products.length}</b> produk tersedia\n\n` +
    `Pilih produk yang ingin kamu beli:`
  );
}

/**
 * Product detail message
 * @param {Object} product
 * @param {number} stockCount
 */
function productDetailMessage(product, stockCount) {
  return (
    `🏷️ <b>${escapeHtml(product.name)}</b>\n\n` +
    `${product.description ? `📝 ${escapeHtml(product.description)}\n\n` : ''}` +
    `💰 <b>Harga:</b> ${formatCurrency(product.price)}\n` +
    `📦 <b>Stok:</b> ${stockCount > 0 ? `${formatNumber(stockCount)} item` : '❌ Habis'}\n\n` +
    `${stockCount > 0 ? '✅ Produk tersedia, klik <b>Beli Sekarang</b> untuk melanjutkan.' : '⚠️ Stok sedang habis. Silakan cek kembali nanti.'}`
  );
}

/**
 * Payment method selection message
 * @param {Object} product
 * @param {number} finalAmount
 * @param {number} discount
 */
function paymentMethodMessage(product, finalAmount, discount = 0) {
  return (
    `💳 <b>Pilih Metode Pembayaran</b>\n\n` +
    `🏷️ <b>Produk:</b> ${escapeHtml(product.name)}\n` +
    `💰 <b>Harga:</b> ${formatCurrency(product.price)}\n` +
    `${discount > 0 ? `🎟️ <b>Diskon:</b> -${formatCurrency(discount)}\n` : ''}` +
    `💵 <b>Total Bayar:</b> ${formatCurrency(finalAmount)}\n\n` +
    `Pilih metode pembayaran:`
  );
}

/**
 * Payment invoice message
 * @param {Object} transaction
 * @param {Object} payment
 * @param {string} gateway
 */
function paymentInvoiceMessage(transaction, payment, gateway) {
  const expiry = payment.expiredAt
    ? `⌛ <b>Batas Waktu:</b> ${formatDate(payment.expiredAt)}\n`
    : '';

  return (
    `🧾 <b>Invoice Pembayaran</b>\n\n` +
    `🆔 <b>ID Transaksi:</b> <code>${transaction.id.substring(0, 12)}</code>\n` +
    `🏷️ <b>Produk:</b> ${escapeHtml(transaction.product?.name || '')}\n` +
    `💵 <b>Total:</b> ${formatCurrency(transaction.finalAmount)}\n` +
    `💳 <b>Via:</b> ${escapeHtml(gateway)}\n` +
    `${expiry}` +
    `📊 <b>Status:</b> ⏳ Menunggu Pembayaran\n\n` +
    `Klik <b>Bayar Sekarang</b> atau <b>Cek Status</b> setelah melakukan pembayaran.`
  );
}

/**
 * Payment success + product delivery message
 * @param {Object} transaction
 * @param {Array} stocks
 */
function paymentSuccessMessage(transaction, stocks) {
  const productContent = stocks.map((s, i) => `<code>${escapeHtml(s.content)}</code>`).join('\n');

  return (
    `✅ <b>Pembayaran Berhasil!</b>\n\n` +
    `🆔 <b>ID Transaksi:</b> <code>${transaction.id.substring(0, 12)}</code>\n` +
    `🏷️ <b>Produk:</b> ${escapeHtml(transaction.product?.name || '')}\n` +
    `💵 <b>Total:</b> ${formatCurrency(transaction.finalAmount)}\n` +
    `📅 <b>Waktu:</b> ${formatDate(new Date())}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 <b>Detail Produk:</b>\n\n` +
    `${productContent}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⚠️ <i>Simpan detail produk di atas dengan aman. Terima kasih telah berbelanja!</i>`
  );
}

/**
 * Transaction list message (header)
 * @param {number} total
 * @param {number} page
 */
function transactionListHeader(total, page) {
  return (
    `📦 <b>Riwayat Transaksi</b>\n\n` +
    `Total transaksi: <b>${total}</b>\n` +
    `Halaman: <b>${page}</b>\n\n` +
    `Pilih transaksi untuk melihat detail:`
  );
}

/**
 * Transaction detail message
 * @param {Object} transaction
 */
function transactionDetailMessage(transaction) {
  return (
    `📋 <b>Detail Transaksi</b>\n\n` +
    `🆔 <b>ID:</b> <code>${transaction.id}</code>\n` +
    `🏷️ <b>Produk:</b> ${escapeHtml(transaction.product?.name || '-')}\n` +
    `💰 <b>Harga:</b> ${formatCurrency(transaction.unitPrice)}\n` +
    `${transaction.discount > 0 ? `🎟️ <b>Diskon:</b> -${formatCurrency(transaction.discount)}\n` : ''}` +
    `💵 <b>Total:</b> ${formatCurrency(transaction.finalAmount)}\n` +
    `💳 <b>Metode:</b> ${formatPaymentMethod(transaction.paymentMethod)}\n` +
    `📊 <b>Status:</b> ${formatTransactionStatus(transaction.status)}\n` +
    `📅 <b>Tanggal:</b> ${formatDate(transaction.createdAt)}\n` +
    `${transaction.deliveredAt ? `✅ <b>Diterima:</b> ${formatDate(transaction.deliveredAt)}\n` : ''}`
  );
}

/**
 * Profile message
 * @param {Object} user
 */
function profileMessage(user) {
  return (
    `👤 <b>Profil Saya</b>\n\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegramId}</code>\n` +
    `👤 <b>Nama:</b> ${escapeHtml(user.firstName)}${user.lastName ? ` ${escapeHtml(user.lastName)}` : ''}\n` +
    `📱 <b>Username:</b> ${user.username ? `@${escapeHtml(user.username)}` : '-'}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 <b>Saldo:</b> ${formatCurrency(user.balance)}\n` +
    `📦 <b>Total Pembelian:</b> ${formatNumber(user.totalOrders)} transaksi\n` +
    `💵 <b>Total Pengeluaran:</b> ${formatCurrency(user.totalSpent)}\n` +
    `📅 <b>Bergabung:</b> ${formatDate(user.joinedAt, false)}\n\n` +
    `🎁 <b>Kode Referral:</b> <code>${user.referralCode}</code>`
  );
}

/**
 * Referral info message
 * @param {Object} user
 * @param {number} totalReferrals
 * @param {number} totalBonus
 * @param {string} botUsername
 * @param {string} referralBonus
 */
function referralMessage(user, totalReferrals, totalBonus, botUsername, referralBonus) {
  const referralLink = `https://t.me/${botUsername}?start=ref_${user.referralCode}`;
  return (
    `🎁 <b>Program Referral</b>\n\n` +
    `Dapatkan bonus saldo setiap kali teman kamu bergabung menggunakan kode referralmu!\n\n` +
    `💎 <b>Bonus per Referral:</b> ${formatCurrency(referralBonus)}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔗 <b>Link Referral Kamu:</b>\n` +
    `<code>${referralLink}</code>\n\n` +
    `🎟️ <b>Kode Referral:</b> <code>${user.referralCode}</code>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👥 <b>Total Referral:</b> ${totalReferrals} orang\n` +
    `💰 <b>Total Bonus:</b> ${formatCurrency(totalBonus)}\n\n` +
    `<i>Bagikan link atau kode referralmu kepada teman-teman!</i>`
  );
}

/**
 * Deposit message
 */
function depositMessage(user) {
  return (
    `💰 <b>Deposit Saldo</b>\n\n` +
    `💳 <b>Saldo Saat Ini:</b> ${formatCurrency(user.balance)}\n\n` +
    `Pilih metode deposit yang kamu inginkan. Saldo akan otomatis ditambahkan setelah pembayaran berhasil.`
  );
}

// ============================================================
// ADMIN MESSAGES
// ============================================================

/**
 * Admin panel message
 * @param {Object} admin
 * @param {Object} quickStats
 */
function adminPanelMessage(admin, quickStats) {
  return (
    `👑 <b>Panel Admin</b>\n\n` +
    `Halo, <b>${escapeHtml(admin.firstName)}</b>! (${admin.role === 'OWNER' ? '👑 Owner' : '🛡️ Admin'})\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 <b>Statistik Hari Ini:</b>\n` +
    `👥 Total User: <b>${formatNumber(quickStats.totalUsers)}</b>\n` +
    `📦 Total Order: <b>${formatNumber(quickStats.totalOrders)}</b>\n` +
    `💰 Pendapatan: <b>${formatCurrency(quickStats.totalRevenue)}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Pilih menu di bawah:`
  );
}

/**
 * Product detail admin view
 * @param {Object} product
 * @param {number} stockCount
 */
function adminProductDetailMessage(product, stockCount) {
  return (
    `📦 <b>Detail Produk</b>\n\n` +
    `🆔 <b>ID:</b> <code>${product.id}</code>\n` +
    `📁 <b>Kategori:</b> ${escapeHtml(product.category?.name || '-')}\n` +
    `🏷️ <b>Nama:</b> ${escapeHtml(product.name)}\n` +
    `📝 <b>Deskripsi:</b> ${escapeHtml(product.description || '-')}\n` +
    `💰 <b>Harga:</b> ${formatCurrency(product.price)}\n` +
    `📦 <b>Stok:</b> ${formatNumber(stockCount)} item\n` +
    `✅ <b>Status:</b> ${product.isActive ? 'Aktif' : 'Nonaktif'}\n` +
    `📅 <b>Dibuat:</b> ${formatDate(product.createdAt, false)}`
  );
}

/**
 * Statistics message
 * @param {Object} stats
 */
function statsMessage(stats) {
  return (
    `📊 <b>Statistik Bot</b>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👥 <b>Data User:</b>\n` +
    `• Total User: <b>${formatNumber(stats.totalUsers)}</b>\n` +
    `• User Aktif (30 hari): <b>${formatNumber(stats.activeUsers)}</b>\n` +
    `• User Baru Hari Ini: <b>${formatNumber(stats.newUsersToday)}</b>\n\n` +
    `📦 <b>Data Transaksi:</b>\n` +
    `• Total Order: <b>${formatNumber(stats.totalOrders)}</b>\n` +
    `• Order Hari Ini: <b>${formatNumber(stats.ordersToday)}</b>\n` +
    `• Order Sukses: <b>${formatNumber(stats.successOrders)}</b>\n\n` +
    `💰 <b>Data Keuangan:</b>\n` +
    `• Total Pendapatan: <b>${formatCurrency(stats.totalRevenue)}</b>\n` +
    `• Pendapatan Hari Ini: <b>${formatCurrency(stats.revenueToday)}</b>\n` +
    `• Rata-rata per Order: <b>${formatCurrency(stats.avgOrderValue)}</b>\n\n` +
    `🏆 <b>Produk Terlaris:</b>\n` +
    `${stats.topProducts.map((p, i) => `${i + 1}. ${escapeHtml(p.name)} (${p.count} terjual)`).join('\n')}\n\n` +
    `📅 <i>Data diperbarui: ${formatDate(new Date())}</i>`
  );
}

/**
 * User detail admin view
 * @param {Object} user
 */
function adminUserDetailMessage(user) {
  return (
    `👤 <b>Detail User</b>\n\n` +
    `🆔 <b>ID:</b> <code>${user.id}</code>\n` +
    `📱 <b>Telegram ID:</b> <code>${user.telegramId}</code>\n` +
    `👤 <b>Nama:</b> ${escapeHtml(user.firstName)}${user.lastName ? ` ${escapeHtml(user.lastName)}` : ''}\n` +
    `📱 <b>Username:</b> ${user.username ? `@${escapeHtml(user.username)}` : '-'}\n\n` +
    `💰 <b>Saldo:</b> ${formatCurrency(user.balance)}\n` +
    `📦 <b>Total Order:</b> ${formatNumber(user.totalOrders)}\n` +
    `💵 <b>Total Spent:</b> ${formatCurrency(user.totalSpent)}\n` +
    `🎁 <b>Referral Code:</b> <code>${user.referralCode}</code>\n` +
    `🚫 <b>Status:</b> ${user.isBlocked ? 'Diblokir' : 'Aktif'}\n` +
    `📅 <b>Bergabung:</b> ${formatDate(user.joinedAt, false)}\n` +
    `🕐 <b>Terakhir Aktif:</b> ${formatRelativeTime(user.lastActiveAt)}`
  );
}

/**
 * Broadcast confirmation message
 * @param {string} messagePreview
 * @param {number} totalUsers
 * @param {boolean} hasImage
 */
function broadcastConfirmMessage(messagePreview, totalUsers, hasImage) {
  return (
    `📢 <b>Konfirmasi Broadcast</b>\n\n` +
    `${hasImage ? '🖼️ Dengan gambar\n\n' : ''}` +
    `<b>Preview Pesan:</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `${messagePreview}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `👥 <b>Target:</b> ${formatNumber(totalUsers)} user\n\n` +
    `⚠️ Apakah kamu yakin ingin mengirim broadcast ini?`
  );
}

/**
 * Error message generic
 * @param {string} detail
 */
function errorMessage(detail) {
  return (
    `❌ <b>Terjadi Kesalahan</b>\n\n` +
    `${escapeHtml(detail || 'Ada kesalahan yang tidak terduga. Silakan coba lagi.')}\n\n` +
    `Jika masalah berlanjut, hubungi admin kami.`
  );
}

/**
 * Success message generic
 * @param {string} message
 */
function successMessage(message) {
  return `✅ <b>Berhasil!</b>\n\n${escapeHtml(message)}`;
}

/**
 * Auto-post transaction to channel
 * @param {Object} transaction
 * @param {Object} user
 */
function channelTransactionPost(transaction, user) {
  return (
    `🎉 <b>Transaksi Berhasil!</b>\n\n` +
    `👤 <b>Pembeli:</b> ${user.firstName}${user.username ? ` (@${user.username})` : ''}\n` +
    `🏷️ <b>Produk:</b> ${escapeHtml(transaction.product?.name || '-')}\n` +
    `💵 <b>Nilai:</b> ${formatCurrency(transaction.finalAmount)}\n` +
    `📅 <b>Waktu:</b> ${formatDate(new Date())}\n\n` +
    `<i>Terima kasih telah berbelanja! 🛍️</i>`
  );
}

module.exports = {
  welcomeMessage,
  channelJoinRequired,
  categoryListMessage,
  productListMessage,
  productDetailMessage,
  paymentMethodMessage,
  paymentInvoiceMessage,
  paymentSuccessMessage,
  transactionListHeader,
  transactionDetailMessage,
  profileMessage,
  referralMessage,
  depositMessage,
  adminPanelMessage,
  adminProductDetailMessage,
  statsMessage,
  adminUserDetailMessage,
  broadcastConfirmMessage,
  errorMessage,
  successMessage,
  channelTransactionPost,
};
