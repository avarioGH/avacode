'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Seed default settings ke database
 */
async function main() {
  console.log('🌱 Seeding database...');

  const settings = [
    { key: 'shopName', value: 'AVA Shop' },
    { key: 'shopDesc', value: '🛍️ Selamat datang di toko digital kami! Kami menyediakan produk digital berkualitas dengan harga terbaik dan proses otomatis 24 jam!' },
    { key: 'bannerUrl', value: '' },
    { key: 'channelUrl', value: 'https://t.me/example' },
    { key: 'contactUrl', value: 'https://t.me/admin' },
    { key: 'referralBonus', value: '5000' },
    { key: 'autoPostTransaction', value: 'true' },
    { key: 'autoPostTestimoni', value: 'false' },
    { key: 'postChannelId', value: '' },
    { key: 'maintenanceMode', value: 'false' },
    { key: 'maintenanceMessage', value: 'Bot sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`  ✅ Setting: ${setting.key}`);
  }

  // Contoh kategori
  const categories = [
    { name: 'Game Voucher', emoji: '🎮', sortOrder: 1 },
    { name: 'Streaming', emoji: '📺', sortOrder: 2 },
    { name: 'Social Media', emoji: '📱', sortOrder: 3 },
    { name: 'VPN & Keamanan', emoji: '🔒', sortOrder: 4 },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`  ✅ Category: ${cat.emoji} ${cat.name}`);
    }
  }

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
