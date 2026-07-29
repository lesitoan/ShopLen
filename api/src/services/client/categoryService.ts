import { prisma } from "@/config/prismaClient.js";

export const categoryService = {
  async listCategories() {
    return prisma.category.findMany({
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
    });
  },
};
