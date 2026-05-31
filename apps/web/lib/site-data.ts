export type ProductPackage = {
  code: string;
  name: string;
  durationLabel: string;
  price: number;
  popular?: boolean;
};

export type ProductEntry = {
  slug: string;
  kind: string;
  name: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  thumbnailUrl: string;
  demoUrl: string;
  features: string[];
  faq: Array<{ question: string; answer: string }>;
  setupFields: string[];
  packages: ProductPackage[];
};

export type ServiceEntry = {
  id: string;
  name: string;
  slug: string;
  productSlug: string;
  productName: string;
  status: 'Running' | 'Stopped' | 'Deploying' | 'Suspended' | 'Error';
  expiresAt: string;
  domain?: string;
  setupFields: string[];
  config: Record<string, string>;
};

export const products: ProductEntry[] = [
  {
    slug: 'bot-auto-order-telegram',
    kind: 'TELEGRAM_AUTO_ORDER',
    name: 'Bot Auto Order Telegram',
    shortDescription: 'Bot penjualan otomatis untuk seller digital, OTP, dan bot ecosystem.',
    description:
      'Layanan bot Telegram subscription-based dengan setup wizard, payment integration, testimonial channel, dan deploy otomatis lewat Docker Engine.',
    startingPrice: 149000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/telegram-auto-order',
    features: [
      'Setup wizard 6 langkah',
      'Integrasi Pakasir / Paydisini',
      'Auto renewal dan suspend',
      'Monitor deploy dan error log',
    ],
    faq: [
      {
        question: 'Apakah saya mendapatkan source code?',
        answer: 'Tidak. Anda hanya mengelola layanan dari dashboard AutomationHub.',
      },
      {
        question: 'Bagaimana saat langganan habis?',
        answer: 'Subscription menjadi suspended dan container dihentikan otomatis sampai renewal.',
      },
    ],
    setupFields: [
      'Bot Token',
      'Telegram Admin ID',
      'Channel Testimoni',
      'API Pakasir',
      'Nama Toko',
      'Logo URL',
    ],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 149000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 399000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 749000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 1399000 },
    ],
  },
  {
    slug: 'bot-forward-promosi-telegram',
    kind: 'TELEGRAM_FORWARD',
    name: 'Bot Forward / Promosi Telegram',
    shortDescription: 'Automasi forward channel promosi dengan session string dan routing target.',
    description:
      'Bot promosi Telegram untuk forward konten dari source channel ke target channel tanpa perlu setup manual di VPS.',
    startingPrice: 119000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/telegram-forward',
    features: ['Input API ID & HASH', 'Source-target routing', 'Deploy ulang satu klik', 'Audit deploy'],
    faq: [],
    setupFields: ['API ID', 'API HASH', 'Session String', 'Source Channel', 'Target Channel'],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 119000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 319000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 599000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 1099000 },
    ],
  },
  {
    slug: 'website-digital-product',
    kind: 'DIGITAL_PRODUCT_SITE',
    name: 'Website Digital Product',
    shortDescription: 'Website cepat untuk jual ebook, akun, file, dan membership.',
    description:
      'Website digital product dengan branding toko, domain custom, payment gateway, dan deploy otomatis ke Docker.',
    startingPrice: 249000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/digital-product',
    features: ['Checkout otomatis', 'Branding domain', 'Dashboard manajemen', 'Renewal subscription'],
    faq: [],
    setupFields: ['Nama Website', 'Logo URL', 'Domain', 'Payment Gateway'],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 249000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 679000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 1249000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 2299000 },
    ],
  },
  {
    slug: 'website-physical-product',
    kind: 'PHYSICAL_PRODUCT_SITE',
    name: 'Website Physical Product',
    shortDescription: 'Toko online cepat untuk produk fisik, katalog, dan landing campaign.',
    description:
      'Website produk fisik dengan payment gateway, domain, dan visual branding yang bisa diatur dari dashboard.',
    startingPrice: 279000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/physical-product',
    features: ['Domain custom', 'Branding toko', 'Checkout ringan', 'Deploy tanpa coding'],
    faq: [],
    setupFields: ['Nama Toko', 'Domain', 'Logo URL', 'Payment Gateway'],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 279000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 759000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 1429000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 2599000 },
    ],
  },
  {
    slug: 'website-email-otp',
    kind: 'EMAIL_OTP_SITE',
    name: 'Website Email OTP',
    shortDescription: 'Website OTP email dengan SMTP dan brand sendiri.',
    description:
      'Platform OTP email berbasis domain untuk seller OTP yang membutuhkan deploy cepat dan operasi terkelola.',
    startingPrice: 219000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/email-otp',
    features: ['SMTP custom', 'Brand email', 'Deploy otomatis', 'Subscription management'],
    faq: [],
    setupFields: ['Brand Name', 'Domain', 'SMTP Host', 'SMTP User', 'SMTP Pass'],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 219000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 599000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 1149000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 2099000 },
    ],
  },
  {
    slug: 'bot-telegram-otp-email-domain',
    kind: 'TELEGRAM_OTP_EMAIL_DOMAIN',
    name: 'Bot Telegram OTP Email Domain',
    shortDescription: 'Bot domain OTP dengan SMTP custom dan deploy instan.',
    description:
      'Bot Telegram untuk seller OTP email domain yang ingin operasional cepat tanpa mengelola server sendiri.',
    startingPrice: 169000,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.automationhub.local/otp-domain',
    features: ['SMTP integration', 'Domain-aware config', 'Suspend on expiry', 'Audit logs'],
    faq: [],
    setupFields: ['Bot Token', 'SMTP Host', 'SMTP User', 'SMTP Pass', 'Domain'],
    packages: [
      { code: '1m', name: '1 Bulan', durationLabel: '30 hari', price: 169000 },
      { code: '3m', name: '3 Bulan', durationLabel: '90 hari', price: 459000, popular: true },
      { code: '6m', name: '6 Bulan', durationLabel: '180 hari', price: 869000 },
      { code: '12m', name: '12 Bulan', durationLabel: '365 hari', price: 1599000 },
    ],
  },
];

export const serviceEntries: ServiceEntry[] = [
  {
    id: 'svc-auto-order',
    name: 'AVA Digital Express',
    slug: 'ava-digital-express',
    productSlug: 'bot-auto-order-telegram',
    productName: 'Bot Auto Order Telegram',
    status: 'Running',
    expiresAt: '20 Juni 2026',
    domain: 'ava-bot.automationhub.local',
    setupFields: products[0].setupFields,
    config: {
      botToken: '553300:AA-demo-token',
      telegramAdminId: '73829291',
      testimonialChannel: '@ava_testimoni',
      pakasirApiKey: 'pk_live_demo',
      storeName: 'AVA Digital Express',
      logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'svc-digital-site',
    name: 'Nexa Courses',
    slug: 'nexa-courses',
    productSlug: 'website-digital-product',
    productName: 'Website Digital Product',
    status: 'Deploying',
    expiresAt: '11 Agustus 2026',
    domain: 'nexa.automationhub.local',
    setupFields: products[2].setupFields,
    config: {
      siteName: 'Nexa Courses',
      logoUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80',
      domain: 'nexa.automationhub.local',
      paymentGateway: 'PAYDISINI',
    },
  },
];

export const testimonials = [
  {
    name: 'Raka, Seller OTP',
    quote: 'Kami pindah dari setup manual ke deploy dashboard. Tim support dan renewal flow-nya bikin operasional jauh lebih tenang.',
  },
  {
    name: 'Salsa, Telegram Seller',
    quote: 'Checkout masuk, webhook jalan, bot aktif. Yang saya pegang cuma dashboard dan branding toko.',
  },
];

export const faqItems = [
  {
    question: 'Apakah saya bisa upload domain sendiri?',
    answer: 'Bisa. Setiap layanan yang mendukung domain memiliki field domain di setup wizard dan bisa diperbarui dari dashboard.',
  },
  {
    question: 'Bagaimana jika deployment gagal?',
    answer: 'Status service akan berubah menjadi error dan deployment log tersimpan di panel agar admin bisa menindaklanjuti cepat.',
  },
  {
    question: 'Apakah tersedia auto renewal?',
    answer: 'Ya. Subscription dapat diperpanjang dari dashboard billing dan layanan dapat diaktifkan kembali setelah renewal.',
  },
];
