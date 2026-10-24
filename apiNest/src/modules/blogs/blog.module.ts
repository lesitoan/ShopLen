import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CacheModule } from "@/infrastructure/cache/cache.module.js";
import { ClientBlogController } from "@/modules/blogs/controllers/clientBlog.controller.js";
import { ClientBlogService } from "@/modules/blogs/services/clientBlog.service.js";
import { BlogCacheService } from "@/modules/blogs/services/blogCache.service.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { AdminBlogController } from "@/modules/blogs/controllers/adminBlog.controller.js";
import { AdminBlogService } from "@/modules/blogs/services/adminBlog.service.js";

@Module({ imports: [PrismaModule, CacheModule, AuthModule], controllers: [ClientBlogController, AdminBlogController], providers: [ClientBlogService, AdminBlogService, BlogCacheService] })
export class BlogModule {}
