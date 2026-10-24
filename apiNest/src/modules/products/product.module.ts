import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CacheModule } from "@/infrastructure/cache/cache.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { ClientProductController } from "@/modules/products/controllers/clientProduct.controller.js";
import { ClientProductService } from "@/modules/products/services/clientProduct.service.js";
import { ProductRecommendationService } from "@/modules/products/services/productRecommendation.service.js";
import { ProductHomeCacheService } from "@/modules/products/services/productHomeCache.service.js";

@Module({ imports: [PrismaModule, CacheModule, AuthModule], controllers: [ClientProductController], providers: [ClientProductService, ProductRecommendationService, ProductHomeCacheService], exports: [ProductHomeCacheService] })
export class ProductModule {}
