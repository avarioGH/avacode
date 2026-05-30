'use strict';

const productService = require('../../../services/product');
const kb = require('../../../utils/keyboard');
const msg = require('../../../utils/message');
const logger = require('../../../utils/logger');
const { formatCurrency, formatNumber } = require('../../../utils/formatter');
const prisma = require('../../../database/client');

/**
 * ================================================================
 * ADMIN PRODUCT HANDLER
 * ================================================================
 */

// --- Tampilkan panel produk ---
async function showProductPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, '📦 <b>Kelola Produk</b>\n\nPilih tindakan:', {
    parse_mode: 'HTML',
    ...kb.adminProductPanel(),
  });
}

// --- Daftar produk (paginated) ---
async function showProductList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const page = parseInt(ctx.callbackQuery.data.split(':')[3]) || 1;
  const { products, total } = await productService.getAllProducts(page, 10);

  await safeEdit(ctx,
    `📋 <b>Daftar Produk</b> (${total} total)\n\nPilih produk:`,
    { parse_mode: 'HTML', ...kb.adminProductList(products, page, total) },
  );
}

// --- Detail produk ---
async function showProductDetail(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const product = await productService.getProductById(productId);
  if (!product) { await ctx.answerCbQuery('Produk tidak ditemukan.', { show_alert: true }); return; }

  const stockCount = product._count?.stocks || 0;
  await safeEdit(ctx, msg.adminProductDetailMessage(product, stockCount), {
    parse_mode: 'HTML',
    ...kb.adminProductActions(productId, product.isActive),
  });
}

// --- Toggle aktif/nonaktif produk ---
async function toggleProduct(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const product = await productService.toggleProduct(productId);
  await ctx.answerCbQuery(`Produk ${product.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
  await showProductDetail(ctx);
}

// --- Hapus produk ---
async function deleteProduct(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const { Markup } = require('telegraf');
  await safeEdit(ctx,
    '⚠️ <b>Hapus Produk</b>\n\nYakin ingin menghapus produk ini? Semua stok yang belum digunakan juga akan dihapus.',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Ya, Hapus', `adm:prod:delconfirm:${productId}`)],
        [Markup.button.callback('❌ Batal', `adm:prod:view:${productId}`)],
      ]),
    },
  );
}

async function confirmDeleteProduct(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  await productService.deleteProduct(productId);
  await safeEdit(ctx, '✅ Produk berhasil dihapus.', {
    parse_mode: 'HTML',
    ...kb.backButton('adm:prod:list', '⬅️ Daftar Produk'),
  });
}

// --- STOK ---

// View stock
async function showStockView(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const product = await productService.getProductById(productId);
  if (!product) return;

  const stockCount = await productService.getStockCount(productId);
  const { stocks } = await productService.getStocks(productId, 1, 10);

  const preview = stocks.slice(0, 5).map((s, i) => `${i + 1}. ${s.isUsed ? '✅' : '📦'} <code>${s.content.substring(0, 30)}</code>`).join('\n');

  await safeEdit(ctx,
    `📦 <b>Stok Produk: ${product.name}</b>\n\n` +
    `Total Stok Tersedia: <b>${formatNumber(stockCount)}</b>\n\n` +
    `Preview:\n${preview || '-'}`,
    {
      parse_mode: 'HTML',
      ...kb.adminProductActions(productId, product.isActive),
    },
  );
}

// Add stock (via text)
async function promptAddStock(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];

  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_stock', productId };

  await safeEdit(ctx,
    `📦 <b>Tambah Stok Produk</b>\n\n` +
    `Kirim isi stok produk, satu per baris:\n\n` +
    `<code>PRODUCT001\nPRODUCT002\nPRODUCT003</code>\n\n` +
    `<i>Setiap baris adalah satu item stok.</i>`,
    { parse_mode: 'HTML', ...kb.backButton(`adm:prod:view:${productId}`) },
  );
}

// Delete unused stock
async function promptDeleteStock(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const { Markup } = require('telegraf');

  await safeEdit(ctx,
    `🗑️ <b>Hapus Stok</b>\n\nPilih tindakan:`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🗑️ Hapus Semua Stok Unused', `adm:stock:clearall:${productId}`)],
        [Markup.button.callback('⬅️ Kembali', `adm:prod:view:${productId}`)],
      ]),
    },
  );
}

async function confirmClearStock(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const productId = ctx.callbackQuery.data.split(':')[3];
  const result = await productService.clearUnusedStocks(productId);
  await ctx.answerCbQuery(`✅ ${result.count} stok dihapus.`);
  const prod = await productService.getProductById(productId);
  if (prod) await showProductDetail(ctx);
}

// Handle text input untuk add stock
async function handleAddStockInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_stock') return false;

  const productId = session.productId;
  const lines = ctx.message.text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  if (lines.length === 0) {
    await ctx.reply('❌ Tidak ada stok yang valid.');
    return true;
  }

  await productService.addStocks(productId, lines);
  ctx.session.adminAction = null;

  await ctx.reply(
    `✅ <b>Stok berhasil ditambahkan!</b>\n\n` +
    `📦 Jumlah: <b>${lines.length} item</b>`,
    { parse_mode: 'HTML' },
  );

  return true;
}

// --- ADD PRODUK FLOW ---
async function promptAddProduct(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const categories = await productService.getAllCategories();

  if (categories.length === 0) {
    await safeEdit(ctx,
      '⚠️ Belum ada kategori. Buat kategori terlebih dahulu.',
      { parse_mode: 'HTML', ...kb.backButton('adm:product') },
    );
    return;
  }

  const { Markup } = require('telegraf');
  const buttons = categories.map((c) => [
    Markup.button.callback(`${c.emoji || '📁'} ${c.name}`, `adm:prod:setcat:${c.id}`),
  ]);
  buttons.push([Markup.button.callback('⬅️ Kembali', 'adm:product')]);

  await safeEdit(ctx,
    '➕ <b>Tambah Produk Baru</b>\n\nPilih kategori:',
    { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) },
  );
}

async function handleSetCategory(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const categoryId = ctx.callbackQuery.data.split(':')[3];

  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_product', step: 'name', categoryId };

  await safeEdit(ctx,
    '➕ <b>Tambah Produk</b>\n\nMasukkan nama produk:',
    { parse_mode: 'HTML', ...kb.backButton('adm:prod:add') },
  );
}

async function handleAddProductInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_product') return false;

  const text = ctx.message.text.trim();

  if (session.step === 'name') {
    session.name = text;
    session.step = 'price';
    await ctx.reply('Masukkan harga produk (angka saja, contoh: 25000):', { parse_mode: 'HTML' });
    return true;
  }

  if (session.step === 'price') {
    const price = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(price) || price <= 0) {
      await ctx.reply('❌ Harga tidak valid. Masukkan angka positif.');
      return true;
    }
    session.price = price;
    session.step = 'description';
    await ctx.reply('Masukkan deskripsi produk (atau ketik "skip" untuk melewati):');
    return true;
  }

  if (session.step === 'description') {
    session.description = text.toLowerCase() === 'skip' ? null : text;

    // Buat produk
    const product = await productService.createProduct({
      categoryId: session.categoryId,
      name: session.name,
      price: session.price,
      description: session.description,
    });

    ctx.session.adminAction = null;

    await ctx.reply(
      `✅ <b>Produk berhasil dibuat!</b>\n\n` +
      `🏷️ Nama: <b>${product.name}</b>\n` +
      `💰 Harga: <b>${formatCurrency(product.price)}</b>\n\n` +
      `Sekarang tambahkan stok produk melalui panel admin.`,
      { parse_mode: 'HTML' },
    );

    return true;
  }

  return false;
}

// --- ADD KATEGORI ---
async function promptAddCategory(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'add_category', step: 'name' };

  await safeEdit(ctx,
    '➕ <b>Tambah Kategori</b>\n\nMasukkan nama kategori:',
    { parse_mode: 'HTML', ...kb.backButton('adm:product') },
  );
}

async function handleAddCategoryInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'add_category') return false;

  const text = ctx.message.text.trim();

  if (session.step === 'name') {
    session.categoryName = text;
    session.step = 'emoji';
    await ctx.reply('Masukkan emoji untuk kategori (opsional, ketik "skip"):');
    return true;
  }

  if (session.step === 'emoji') {
    const emoji = text.toLowerCase() === 'skip' ? null : text;
    const category = await productService.createCategory({
      name: session.categoryName,
      emoji,
    });

    ctx.session.adminAction = null;
    await ctx.reply(
      `✅ Kategori <b>${category.emoji || ''} ${category.name}</b> berhasil dibuat!`,
      { parse_mode: 'HTML' },
    );
    return true;
  }

  return false;
}

async function showCategoryList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const categories = await productService.getAllCategories();
  const { Markup } = require('telegraf');

  const buttons = categories.map((c) => [
    Markup.button.callback(`${c.emoji || '📁'} ${c.name}`, `adm:cat:view:${c.id}`),
  ]);
  buttons.push([Markup.button.callback('⬅️ Panel Produk', 'adm:product')]);

  await safeEdit(ctx,
    `📋 <b>Daftar Kategori</b> (${categories.length})\n\nPilih kategori:`,
    { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) },
  );
}

// === LIST STOCK (per product, untuk panel admin) ===
async function showStockList(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await showProductList(ctx); // Redirect ke product list
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showProductPanel,
  showProductList,
  showProductDetail,
  toggleProduct,
  deleteProduct,
  confirmDeleteProduct,
  showStockView,
  promptAddStock,
  promptDeleteStock,
  confirmClearStock,
  handleAddStockInput,
  promptAddProduct,
  handleSetCategory,
  handleAddProductInput,
  promptAddCategory,
  handleAddCategoryInput,
  showCategoryList,
  showStockList,
};
