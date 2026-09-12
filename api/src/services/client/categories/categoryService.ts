import { prisma } from "@/config/prismaClient.js";
import { getCachedCategories } from "@/services/client/categories/categoryCacheService.js";

export const categoryService = {
  async listCategories() {
    return getCachedCategories(() => prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [
        { displayOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        displayOrder: true,
      },
    }));
  },
};
