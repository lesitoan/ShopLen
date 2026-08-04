-- CreateEnum
CREATE TYPE "blog_tag_status" AS ENUM ('ACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "blog_post_status" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(60) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "blog_tag_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(40) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "title" VARCHAR(220) NOT NULL,
    "excerpt" VARCHAR(500) NOT NULL,
    "content_html" TEXT NOT NULL,
    "toc" JSONB,
    "tag_id" UUID NOT NULL,
    "author_user_id" UUID NOT NULL,
    "read_time_minutes" INTEGER NOT NULL DEFAULT 1,
    "status" "blog_post_status" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "show_on_home" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "meta_title" VARCHAR(180),
    "meta_description" VARCHAR(300),
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blog_post_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" VARCHAR(255),
    "alt_text" VARCHAR(255),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_thumbnail" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blog_post_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_code_key" ON "blog_tags"("code");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- CreateIndex
CREATE INDEX "blog_tags_status_display_order_idx" ON "blog_tags"("status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_code_key" ON "blog_posts"("code");

-- CreateIndex
CREATE INDEX "blog_posts_status_published_at_idx" ON "blog_posts"("status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_tag_status_published_at_idx" ON "blog_posts"("tag_id", "status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_featured_status_published_at_idx" ON "blog_posts"("is_featured", "status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_home_status_published_at_idx" ON "blog_posts"("show_on_home", "status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "blog_post_images_post_display_order_idx" ON "blog_post_images"("blog_post_id", "display_order");

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "blog_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_images" ADD CONSTRAINT "blog_post_images_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
