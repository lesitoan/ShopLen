-- EnableExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('ACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF_ORDER', 'STAFF_CONTENT');

-- CreateEnum
CREATE TYPE "gender_type" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "category_status" AS ENUM ('ACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('ACTIVE', 'HIDDEN', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "product_highlight_type" AS ENUM ('HOT_PRODUCT', 'TODAY_DEAL', 'HOT_TIKTOK');

-- CreateEnum
CREATE TYPE "product_option_type" AS ENUM ('COLOR', 'SIZE');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PACKING', 'SHIPPING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'MISMATCHED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_provider" AS ENUM ('VIETQR', 'SEPAY', 'CASSO', 'MANUAL');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "loyalty_transaction_type" AS ENUM ('EARN', 'REDEEM', 'REFUND', 'ADJUST');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_manual_login" BOOLEAN NOT NULL DEFAULT false,
    "is_google_login" BOOLEAN NOT NULL DEFAULT false,
    "google_account_id" VARCHAR(255),
    "phone" VARCHAR(20),
    "gender" "gender_type",
    "birthday" DATE,
    "avatar" TEXT,
    "status" "account_status" NOT NULL DEFAULT 'ACTIVE',
    "reward_points" INTEGER NOT NULL DEFAULT 0,
    "total_spent" INTEGER NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address_line" TEXT NOT NULL,
    "province_name" VARCHAR(120) NOT NULL,
    "district_name" VARCHAR(120),
    "ward_name" VARCHAR(120),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "avatar" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'STAFF_ORDER',
    "status" "account_status" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "category_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "category_id" UUID NOT NULL,
    "short_description" TEXT,
    "description_html" TEXT,
    "care_instruction_html" TEXT,
    "original_price" INTEGER NOT NULL,
    "sale_price" INTEGER,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "status" "product_status" NOT NULL DEFAULT 'ACTIVE',
    "highlight_type" "product_highlight_type",
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "meta_title" VARCHAR(180),
    "meta_description" VARCHAR(300),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" VARCHAR(255),
    "alt_text" VARCHAR(255),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_thumbnail" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "option_type" "product_option_type" NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "values" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_code" VARCHAR(40) NOT NULL,
    "customer_id" UUID NOT NULL,
    "customer_name" VARCHAR(120) NOT NULL,
    "customer_phone" VARCHAR(20) NOT NULL,
    "customer_email" VARCHAR(255),
    "shipping_address" TEXT NOT NULL,
    "shipping_province" VARCHAR(120),
    "shipping_district" VARCHAR(120),
    "shipping_ward" VARCHAR(120),
    "customer_note" TEXT,
    "admin_notes" TEXT,
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "shipping_fee" INTEGER NOT NULL DEFAULT 0,
    "discount_amount" INTEGER NOT NULL DEFAULT 0,
    "points_discount" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL DEFAULT 0,
    "used_points" INTEGER NOT NULL DEFAULT 0,
    "earned_points" INTEGER NOT NULL DEFAULT 0,
    "payment_method" "payment_method" NOT NULL DEFAULT 'BANK_TRANSFER',
    "payment_status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "order_status" "order_status" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "paid_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "cancel_reason" TEXT,
    "shipping_unit" VARCHAR(120),
    "tracking_code" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID,
    "unit_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "product_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "provider" "payment_provider" NOT NULL,
    "method" "payment_method" NOT NULL DEFAULT 'BANK_TRANSFER',
    "bank_name" VARCHAR(120) NOT NULL,
    "bank_bin" VARCHAR(30) NOT NULL,
    "account_no" VARCHAR(60) NOT NULL,
    "account_name" VARCHAR(160) NOT NULL,
    "amount" INTEGER NOT NULL,
    "transfer_content" VARCHAR(120) NOT NULL,
    "qr_image_url" TEXT,
    "transaction_ref" VARCHAR(120),
    "raw_webhook_payload" JSONB,
    "is_matched" BOOLEAN NOT NULL DEFAULT false,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "order_id" UUID,
    "change" INTEGER NOT NULL,
    "type" "loyalty_transaction_type" NOT NULL,
    "reason" TEXT NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "actor_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "action" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" UUID,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_google_account_id_key" ON "customers"("google_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customer_addresses_customer_id_idx" ON "customer_addresses"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_status_display_order_idx" ON "categories"("status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_category_status_deleted_at_idx" ON "products"("category_id", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "products_highlight_status_deleted_at_idx" ON "products"("highlight_type", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at" DESC);

-- CreateIndex
CREATE INDEX "products_sold_count_idx" ON "products"("sold_count" DESC);

-- CreateIndex
CREATE INDEX "product_images_product_display_order_idx" ON "product_images"("product_id", "display_order");

-- CreateIndex
CREATE INDEX "product_options_product_display_order_idx" ON "product_options"("product_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_options_product_option_type_key" ON "product_options"("product_id", "option_type");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");

-- CreateIndex
CREATE INDEX "orders_customer_created_at_idx" ON "orders"("customer_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_order_status_created_at_idx" ON "orders"("order_status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_payment_status_created_at_idx" ON "orders"("payment_status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_expires_at_idx" ON "orders"("expires_at");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX "payments_order_created_at_idx" ON "payments"("order_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "payments_transfer_content_idx" ON "payments"("transfer_content");

-- CreateIndex
CREATE INDEX "payments_status_created_at_idx" ON "payments"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "loyalty_transactions_customer_created_at_idx" ON "loyalty_transactions"("customer_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "loyalty_transactions_order_id_idx" ON "loyalty_transactions"("order_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_created_at_idx" ON "audit_logs"("actor_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_created_at_idx" ON "audit_logs"("entity_type", "entity_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CustomConstraint
CREATE UNIQUE INDEX "customer_addresses_default_address_key" ON "customer_addresses"("customer_id") WHERE "is_default" = true;

-- CustomConstraint
CREATE UNIQUE INDEX "products_slug_active_key" ON "products"("slug") WHERE "deleted_at" IS NULL;

-- CustomConstraint
CREATE UNIQUE INDEX "product_images_thumbnail_key" ON "product_images"("product_id") WHERE "is_thumbnail" = true;

-- CustomConstraint
CREATE UNIQUE INDEX "payments_provider_transaction_ref_key" ON "payments"("provider", "transaction_ref") WHERE "transaction_ref" IS NOT NULL;

-- CustomConstraint
ALTER TABLE "customers" ADD CONSTRAINT "customers_reward_points_check" CHECK ("reward_points" >= 0);
ALTER TABLE "customers" ADD CONSTRAINT "customers_total_spent_check" CHECK ("total_spent" >= 0);
ALTER TABLE "customers" ADD CONSTRAINT "customers_total_orders_check" CHECK ("total_orders" >= 0);
ALTER TABLE "customers" ADD CONSTRAINT "customers_login_method_check" CHECK ("is_manual_login" = true OR "is_google_login" = true);

-- CustomConstraint
ALTER TABLE "products" ADD CONSTRAINT "products_original_price_check" CHECK ("original_price" >= 0);
ALTER TABLE "products" ADD CONSTRAINT "products_sale_price_check" CHECK ("sale_price" IS NULL OR ("sale_price" >= 0 AND "sale_price" <= "original_price"));
ALTER TABLE "products" ADD CONSTRAINT "products_stock_quantity_check" CHECK ("stock_quantity" >= 0);
ALTER TABLE "products" ADD CONSTRAINT "products_sold_count_check" CHECK ("sold_count" >= 0);

-- CustomConstraint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_values_array_check" CHECK (jsonb_typeof("values") = 'array');

-- CustomConstraint
ALTER TABLE "orders" ADD CONSTRAINT "orders_money_fields_check" CHECK (
  "subtotal" >= 0
  AND "shipping_fee" >= 0
  AND "discount_amount" >= 0
  AND "points_discount" >= 0
  AND "total_amount" >= 0
  AND "used_points" >= 0
  AND "earned_points" >= 0
);

-- CustomConstraint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_price_quantity_check" CHECK ("unit_price" >= 0 AND "quantity" > 0 AND "total_price" >= 0);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_snapshot_object_check" CHECK (jsonb_typeof("product_snapshot") = 'object');

-- CustomConstraint
ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_check" CHECK ("amount" >= 0);

-- CustomConstraint
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_balance_after_check" CHECK ("balance_after" >= 0);
