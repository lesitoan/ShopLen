import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CacheModule } from "@/infrastructure/cache/cache.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { ClientCategoryController } from "@/modules/categories/controllers/clientCategory.controller.js";
import { AdminCategoryController } from "@/modules/categories/controllers/adminCategory.controller.js";
import { ClientCategoryService } from "@/modules/categories/services/clientCategory.service.js";
import { AdminCategoryService } from "@/modules/categories/services/adminCategory.service.js";
import { CategoryCacheService } from "@/modules/categories/services/categoryCache.service.js";

@Module({
  imports: [PrismaModule, CacheModule, AuthModule],
  controllers: [ClientCategoryController, AdminCategoryController],
  providers: [
    ClientCategoryService,
    AdminCategoryService,
    CategoryCacheService,
  ],
})
export class CategoryModule {}
