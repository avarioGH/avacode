import { PrismaClient, ProductKind, ProductStatus, PackageInterval } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'bot-auto-order-telegram',
    kind: ProductKind.TELEGRAM_AUTO_ORDER,
    name: 'Bot Auto Order Telegram',
    shortDescription: 'Bot pemesanan otomatis untuk seller Telegram dan produk digital.',
    description:
      'Bot Telegram siap deploy untuk menerima order, memvalidasi pembayaran, dan membantu seller menangani transaksi digital secara otomatis.',
    runtimeImage: 'ghcr.io/automationhub/telegram-auto-order:latest',
    runtimePort: 3001,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/telegram-auto-order',
    startingPrice: 149000,
    isFeatured: true,
    status: ProductStatus.PUBLISHED,
    featureList: [
      'Auto checkout workflow',
      'Integrasi Pakasir / Paydisini',
      'Setup wizard tanpa coding',
      'Deploy ulang dari dashboard',
    ],
    faq: [
      {
        question: 'Apakah customer mendapatkan source code?',
        answer: 'Tidak. Customer hanya membeli layanan dan melakukan konfigurasi dari dashboard.',
      },
      {
        question: 'Apakah bot bisa diperpanjang?',
        answer: 'Bisa. Renewal akan memperpanjang subscription dan mengaktifkan layanan kembali.',
      },
    ],
    setupSchema: [
      'botToken',
      'telegramAdminId',
      'testimonialChannel',
      'pakasirApiKey',
      'storeName',
      'logoUrl',
    ],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 149000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 399000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 749000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 1399000, isPopular: false },
    ],
    tutorials: [
      {
        slug: 'setup-bot-auto-order-telegram',
        title: 'Setup Bot Auto Order Telegram',
        excerpt: 'Panduan lengkap mengisi token bot, admin ID, dan gateway pembayaran.',
      },
    ],
  },
  {
    slug: 'bot-forward-promosi-telegram',
    kind: ProductKind.TELEGRAM_FORWARD,
    name: 'Bot Forward / Promosi Telegram',
    shortDescription: 'Automasi forward promosi dari source channel ke target channel.',
    description: 'Bot promosi Telegram dengan input API ID, API HASH, session string, source channel, dan target channel.',
    runtimeImage: 'ghcr.io/automationhub/telegram-forward:latest',
    runtimePort: 3002,
    startingPrice: 119000,
    status: ProductStatus.PUBLISHED,
    featureList: ['Auto forward konten', 'Manajemen session', 'Deploy instan'],
    faq: [],
    setupSchema: ['apiId', 'apiHash', 'sessionString', 'sourceChannel', 'targetChannel'],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 119000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 319000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 599000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 1099000, isPopular: false },
    ],
    tutorials: [],
  },
  {
    slug: 'website-digital-product',
    kind: ProductKind.DIGITAL_PRODUCT_SITE,
    name: 'Website Digital Product',
    shortDescription: 'Website penjualan produk digital dengan checkout otomatis.',
    description: 'Website siap pakai untuk menjual e-book, akun, membership, dan produk digital lain tanpa coding.',
    runtimeImage: 'ghcr.io/automationhub/digital-product-site:latest',
    runtimePort: 3003,
    startingPrice: 249000,
    status: ProductStatus.PUBLISHED,
    featureList: ['Landing page cepat', 'Checkout otomatis', 'Pengaturan domain dan logo'],
    faq: [],
    setupSchema: ['siteName', 'logoUrl', 'domain', 'paymentGateway'],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 249000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 679000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 1249000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 2299000, isPopular: false },
    ],
    tutorials: [],
  },
  {
    slug: 'website-physical-product',
    kind: ProductKind.PHYSICAL_PRODUCT_SITE,
    name: 'Website Physical Product',
    shortDescription: 'Website toko online untuk produk fisik dan katalog COD.',
    description: 'Website optimized untuk seller produk fisik dengan domain custom, branding toko, dan pembayaran terintegrasi.',
    runtimeImage: 'ghcr.io/automationhub/physical-product-site:latest',
    runtimePort: 3004,
    startingPrice: 279000,
    status: ProductStatus.PUBLISHED,
    featureList: ['Catalog toko', 'Konfigurasi domain', 'Checkout dan pembayaran'],
    faq: [],
    setupSchema: ['storeName', 'domain', 'logoUrl', 'paymentGateway'],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 279000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 759000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 1429000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 2599000, isPopular: false },
    ],
    tutorials: [],
  },
  {
    slug: 'website-email-otp',
    kind: ProductKind.EMAIL_OTP_SITE,
    name: 'Website Email OTP',
    shortDescription: 'Website OTP email dengan branding dan SMTP custom.',
    description: 'Platform OTP email berbasis domain dan SMTP untuk seller layanan verifikasi.',
    runtimeImage: 'ghcr.io/automationhub/email-otp-site:latest',
    runtimePort: 3005,
    startingPrice: 219000,
    status: ProductStatus.PUBLISHED,
    featureList: ['Brand email custom', 'SMTP config', 'Deploy otomatis'],
    faq: [],
    setupSchema: ['brandName', 'domain', 'smtpHost', 'smtpUser', 'smtpPass'],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 219000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 599000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 1149000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 2099000, isPopular: false },
    ],
    tutorials: [],
  },
  {
    slug: 'bot-telegram-otp-email-domain',
    kind: ProductKind.TELEGRAM_OTP_EMAIL_DOMAIN,
    name: 'Bot Telegram OTP Email Domain',
    shortDescription: 'Bot Telegram untuk layanan OTP email domain berbasis SMTP.',
    description: 'Bot spesialis OTP email domain yang dikonfigurasi melalui dashboard dan dijalankan di Docker Engine.',
    runtimeImage: 'ghcr.io/automationhub/telegram-otp-email-domain:latest',
    runtimePort: 3006,
    startingPrice: 169000,
    status: ProductStatus.PUBLISHED,
    featureList: ['Bot token custom', 'SMTP integration', 'Domain-aware workflow'],
    faq: [],
    setupSchema: ['botToken', 'smtpHost', 'smtpUser', 'smtpPass', 'domain'],
    packages: [
      { code: '1m', name: '1 Bulan', interval: PackageInterval.MONTHLY, durationMonths: 1, price: 169000, isPopular: false },
      { code: '3m', name: '3 Bulan', interval: PackageInterval.QUARTERLY, durationMonths: 3, price: 459000, isPopular: true },
      { code: '6m', name: '6 Bulan', interval: PackageInterval.SEMI_ANNUAL, durationMonths: 6, price: 869000, isPopular: false },
      { code: '12m', name: '12 Bulan', interval: PackageInterval.ANNUAL, durationMonths: 12, price: 1599000, isPopular: false },
    ],
    tutorials: [],
  },
];

async function main() {
  await prisma.role.upsert({
    where: { code: 'USER' },
    update: {},
    create: { code: 'USER', name: 'User', description: 'Standard customer account' },
  });

  await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { code: 'ADMIN', name: 'Admin', description: 'Backoffice administrator' },
  });

  await prisma.role.upsert({
    where: { code: 'OWNER' },
    update: {},
    create: { code: 'OWNER', name: 'Owner', description: 'Platform owner with full access' },
  });

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        kind: product.kind,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        thumbnailUrl: product.thumbnailUrl,
        demoUrl: product.demoUrl,
        runtimeImage: product.runtimeImage,
        runtimePort: product.runtimePort,
        startingPrice: product.startingPrice,
        status: product.status,
        isFeatured: product.isFeatured ?? false,
        featureList: product.featureList,
        faq: product.faq,
        setupSchema: product.setupSchema,
      },
      create: {
        slug: product.slug,
        kind: product.kind,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        thumbnailUrl: product.thumbnailUrl,
        demoUrl: product.demoUrl,
        runtimeImage: product.runtimeImage,
        runtimePort: product.runtimePort,
        startingPrice: product.startingPrice,
        status: product.status,
        isFeatured: product.isFeatured ?? false,
        featureList: product.featureList,
        faq: product.faq,
        setupSchema: product.setupSchema,
      },
    });

    for (const [index, pkg] of product.packages.entries()) {
      await prisma.package.upsert({
        where: {
          productId_code: {
            productId: created.id,
            code: pkg.code,
          },
        },
        update: {
          name: pkg.name,
          interval: pkg.interval,
          durationMonths: pkg.durationMonths,
          price: pkg.price,
          isPopular: pkg.isPopular,
          sortOrder: index,
        },
        create: {
          productId: created.id,
          code: pkg.code,
          name: pkg.name,
          interval: pkg.interval,
          durationMonths: pkg.durationMonths,
          price: pkg.price,
          isPopular: pkg.isPopular,
          sortOrder: index,
        },
      });
    }

    for (const [index, tutorial] of product.tutorials.entries()) {
      await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          title: tutorial.title,
          excerpt: tutorial.excerpt,
          sortOrder: index,
          contentMarkdown: `# ${tutorial.title}\n\n${tutorial.excerpt}\n\nIsi langkah setup dapat diperluas dari panel admin.`,
        },
        create: {
          productId: created.id,
          slug: tutorial.slug,
          title: tutorial.title,
          excerpt: tutorial.excerpt,
          sortOrder: index,
          contentMarkdown: `# ${tutorial.title}\n\n${tutorial.excerpt}\n\nIsi langkah setup dapat diperluas dari panel admin.`,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
