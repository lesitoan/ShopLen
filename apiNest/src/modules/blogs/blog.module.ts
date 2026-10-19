import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CacheModule } from "@/infrastructure/cache/cache.module.js";
import { ClientBlogController } from "@/modules/blogs/controllers/clientBlog.controller.js";
import { ClientBlogService } from "@/modules/blogs/services/clientBlog.service.js";
import { BlogCacheService } from "@/modules/blogs/services/blogCache.service.js";

@Module({ imports: [PrismaModule, CacheModule], controllers: [ClientBlogController], providers: [ClientBlogService, BlogCacheService] })
export class BlogModule {}
