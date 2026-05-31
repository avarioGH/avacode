-- AVA Order Bot - Initial SQL Schema
-- Generated as reference (use Prisma migrations in production)
-- Run: npm run db:migrate

-- Enable UUID extension (opsional, Prisma menggunakan cuid())
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'OWNER');
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'DELIVERED', 'CANCELLED', 'EXPIRED', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('BALANCE', 'PAYDISINI', 'PAKASIR');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'FAILED');
CREATE TYPE "VoucherType" AS ENUM ('PERCENTAGE', 'FIXED');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "username" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "referral_code" TEXT NOT NULL,
    "referred_by" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");

CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "username" TEXT,
    "first_name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "added_by" BIGINT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admins_telegram_id_key" ON "admins"("telegram_id");

CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(15,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_stocks" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_stocks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(15,2) NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "discount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(15,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "voucher_id" TEXT,
    "notes" TEXT,
    "delivered_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "gateway_trx_id" TEXT,
    "channel" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_url" TEXT,
    "qr_code" TEXT,
    "expired_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "raw_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

CREATE TABLE "deposits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "gateway" TEXT NOT NULL,
    "gateway_trx_id" TEXT,
    "channel" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_url" TEXT,
    "qr_code" TEXT,
    "expired_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "raw_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_name" TEXT NOT NULL,
    "invite_link" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "channels_channel_id_key" ON "channels"("channel_id");

CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from_user" TEXT NOT NULL,
    "from_user_id" BIGINT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_posted" BOOLEAN NOT NULL DEFAULT false,
    "posted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "referred_id" TEXT NOT NULL,
    "bonus" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "referrals_owner_id_referred_id_key" ON "referrals"("owner_id", "referred_id");

CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "min_purchase" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "max_discount" DECIMAL(15,2),
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "telegram_id" BIGINT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "broadcasts" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "image_url" TEXT,
    "total_sent" INTEGER NOT NULL DEFAULT 0,
    "total_failed" INTEGER NOT NULL DEFAULT 0,
    "sent_by" BIGINT NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "broadcasts_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- FOREIGN KEYS
-- ============================================================

ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- INDEXES (Performance)
-- ============================================================

CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");
CREATE INDEX "transactions_status_idx" ON "transactions"("status");
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");
CREATE INDEX "product_stocks_product_id_is_used_idx" ON "product_stocks"("product_id", "is_used");
CREATE INDEX "payments_gateway_trx_id_idx" ON "payments"("gateway_trx_id");
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");
CREATE INDEX "users_last_active_at_idx" ON "users"("last_active_at");
