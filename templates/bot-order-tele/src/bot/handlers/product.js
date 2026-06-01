'use strict';

const productService = require('../../services/product');
const settingsService = require('../../services/settings');
const kb = require('../../utils/keyboard');
const msg = require('../../utils/message');
const logger = require('../../utils/logger');

/**
 * ================================================================
 * PRODUCT HANDLER (USER)
 * ================================================================
 */

/**
 * Tampilkan daftar kategori
 */
async function handleShop(ctx) {
  try {
    await ctx.answerCbQuery();
    const categories = await productService.getAllCategories();
    const shopName = await settingsService.get('shopName');

    if (categories.length === 0) {
      await ctx.editMessageText(
        '😔 Belum ada produk yang tersedia saat ini. Silakan cek kembali nanti.',
        { parse_mode: 'HTML', ...kb.backToMain() },
      );
      return;
    }

    await safeEdit(ctx, msg.categoryListMessage(shopName), {
      parse_mode: 'HTML',
      ...kb.categoryList(categories),
    });
  } catch (error) {
    logger.error('handleShop error:', error.message);
    await ctx.answerCbQuery('Terjadi kesalahan.', { show_alert: true });
  }
}

/**
 * Tampilkan daftar produk dalam kategori
 */
async function handleCategory(ctx) {
  try {
    await ctx.answerCbQuery();
    const categoryId = ctx.callbackQuery.data.split(':')[1];
    const category = await productService.getCategoryById(categoryId);

    if (!category) {
      await ctx.answerCbQuery('Kategori tidak ditemukan.', { show_alert: true });
      return;
    }

    const products = await productService.getProductsByCategory(categoryId);

    if (products.length === 0) {
      await safeEdit(ctx,
        `${category.emoji || '📁'} <b>${category.name}</b>\n\n😔 Belum ada produk di kategori ini.`,
        { parse_mode: 'HTML', ...kb.backButton('menu:shop', '⬅️ Kategori') },
      );
      return;
    }

    await safeEdit(ctx, msg.productListMessage(category, products), {
      parse_mode: 'HTML',
      ...kb.productList(products, categoryId),
    });
  } catch (error) {
    logger.error('handleCategory error:', error.message);
  }
}

/**
 * Tampilkan detail produk
 */
async function handleProduct(ctx) {
  try {
    await ctx.answerCbQuery();
    const productId = ctx.callbackQuery.data.split(':')[1];
    const product = await productService.getProductById(productId);

    if (!product) {
      await ctx.answerCbQuery('Produk tidak ditemukan.', { show_alert: true });
      return;
    }

    const stockCount = product._count?.stocks || 0;

    await safeEdit(ctx, msg.productDetailMessage(product, stockCount), {
      parse_mode: 'HTML',
      ...kb.productDetail(product, stockCount),
    });
  } catch (error) {
    logger.error('handleProduct error:', error.message);
  }
}

/**
 * Helper: edit message atau kirim baru jika gagal
 */
async function safeEdit(ctx, text, options) {
  try {
    await ctx.editMessageText(text, options);
  } catch {
    await ctx.reply(text, options);
  }
}

module.exports = { handleShop, handleCategory, handleProduct };
