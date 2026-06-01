'use strict';

const prisma = require('../database/client');
const logger = require('../utils/logger');

/**
 * ================================================================
 * PRODUCT SERVICE
 * ================================================================
 */

// ============================================================
// CATEGORIES
// ============================================================

async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getCategoryById(id) {
  return prisma.category.findUnique({ where: { id } });
}

async function createCategory(data) {
  return prisma.category.create({ data });
}

async function updateCategory(id, data) {
  return prisma.category.update({ where: { id }, data });
}

async function deleteCategory(id) {
  // Cek apakah ada produk
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) throw new Error('Tidak bisa menghapus kategori yang masih memiliki produk');
  return prisma.category.delete({ where: { id } });
}

// ============================================================
// PRODUCTS
// ============================================================

async function getProductsByCategory(categoryId) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { stocks: { where: { isUsed: false } } },
      },
    },
  });
}

async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      _count: {
        select: { stocks: { where: { isUsed: false } } },
      },
    },
  });
}

async function getAllProducts(page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        _count: { select: { stocks: { where: { isUsed: false } } } },
      },
    }),
    prisma.product.count(),
  ]);
  return { products, total };
}

async function createProduct(data) {
  return prisma.product.create({
    data,
    include: { category: true },
  });
}

async function updateProduct(id, data) {
  return prisma.product.update({ where: { id }, data });
}

async function deleteProduct(id) {
  // Hapus semua stok yang belum digunakan dulu
  await prisma.productStock.deleteMany({
    where: { productId: id, isUsed: false },
  });
  return prisma.product.delete({ where: { id } });
}

async function toggleProduct(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Produk tidak ditemukan');
  return prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });
}

// ============================================================
// STOCK
// ============================================================

/**
 * Get stock count for a product
 */
async function getStockCount(productId) {
  return prisma.productStock.count({
    where: { productId, isUsed: false },
  });
}

/**
 * Get all stocks for a product (paginated)
 */
async function getStocks(productId, page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  const [stocks, total] = await Promise.all([
    prisma.productStock.findMany({
      where: { productId },
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productStock.count({ where: { productId } }),
  ]);
  return { stocks, total };
}

/**
 * Add stock items to a product
 * @param {string} productId
 * @param {string[]} contents - Array of stock content strings
 */
async function addStocks(productId, contents) {
  const data = contents.map((content) => ({ productId, content: content.trim() }));
  return prisma.productStock.createMany({ data });
}

/**
 * Delete specific stock items
 * @param {string[]} stockIds
 */
async function deleteStocks(stockIds) {
  return prisma.productStock.deleteMany({
    where: { id: { in: stockIds }, isUsed: false },
  });
}

/**
 * Delete all unused stock for a product
 */
async function clearUnusedStocks(productId) {
  return prisma.productStock.deleteMany({
    where: { productId, isUsed: false },
  });
}

/**
 * Take N stocks for a transaction (FIFO)
 * @param {string} productId
 * @param {string} transactionId
 * @param {number} quantity
 * @returns {Promise<ProductStock[]>}
 */
async function takeStocks(productId, transactionId, quantity = 1) {
  return prisma.$transaction(async (tx) => {
    const stocks = await tx.productStock.findMany({
      where: { productId, isUsed: false },
      take: quantity,
      orderBy: { createdAt: 'asc' },
    });

    if (stocks.length < quantity) {
      throw new Error(`Stok tidak mencukupi. Tersedia: ${stocks.length}, dibutuhkan: ${quantity}`);
    }

    const stockIds = stocks.map((s) => s.id);
    await tx.productStock.updateMany({
      where: { id: { in: stockIds } },
      data: {
        isUsed: true,
        usedAt: new Date(),
        transactionId,
      },
    });

    return stocks;
  });
}

/**
 * Get top selling products
 */
async function getTopProducts(limit = 5) {
  return prisma.product.findMany({
    take: limit,
    orderBy: {
      transactions: {
        _count: 'desc',
      },
    },
    include: {
      _count: {
        select: { transactions: { where: { status: 'DELIVERED' } } },
      },
    },
  });
}

module.exports = {
  // Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Products
  getProductsByCategory,
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
  // Stock
  getStockCount,
  getStocks,
  addStocks,
  deleteStocks,
  clearUnusedStocks,
  takeStocks,
  getTopProducts,
};
