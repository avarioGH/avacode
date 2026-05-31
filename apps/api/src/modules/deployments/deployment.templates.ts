import { ProductKind } from '@prisma/client';

export const DEPLOYMENT_TEMPLATES: Record<
  ProductKind,
  {
    defaultImage: string;
    expectedConfig: string[];
  }
> = {
  TELEGRAM_AUTO_ORDER: {
    defaultImage: 'ghcr.io/automationhub/telegram-auto-order:latest',
    expectedConfig: [
      'botToken',
      'telegramAdminId',
      'testimonialChannel',
      'pakasirApiKey',
      'storeName',
      'logoUrl',
    ],
  },
  TELEGRAM_FORWARD: {
    defaultImage: 'ghcr.io/automationhub/telegram-forward:latest',
    expectedConfig: ['apiId', 'apiHash', 'sessionString', 'sourceChannel', 'targetChannel'],
  },
  DIGITAL_PRODUCT_SITE: {
    defaultImage: 'ghcr.io/automationhub/digital-product-site:latest',
    expectedConfig: ['siteName', 'logoUrl', 'domain', 'paymentGateway'],
  },
  PHYSICAL_PRODUCT_SITE: {
    defaultImage: 'ghcr.io/automationhub/physical-product-site:latest',
    expectedConfig: ['storeName', 'domain', 'logoUrl', 'paymentGateway'],
  },
  EMAIL_OTP_SITE: {
    defaultImage: 'ghcr.io/automationhub/email-otp-site:latest',
    expectedConfig: ['brandName', 'domain', 'smtpHost', 'smtpUser', 'smtpPass'],
  },
  TELEGRAM_OTP_EMAIL_DOMAIN: {
    defaultImage: 'ghcr.io/automationhub/telegram-otp-email-domain:latest',
    expectedConfig: ['botToken', 'smtpHost', 'smtpUser', 'smtpPass', 'domain'],
  },
};
