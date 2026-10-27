import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import { CategoryCacheService } from "@/modules/categories/services/categoryCache.service.js";

@Injectable()
export class ClientCategoryService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CategoryCacheService) private readonly cache: CategoryCacheService,
  ) {}
  async listCategories() {
    return this.cache.getCachedCategories(() =>
      this.prisma.category.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          displayOrder: true,
        },
      }),
    );
  }
}
