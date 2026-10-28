import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";
import type { AiProductsDto } from "@/modules/ai/dto/ai.dto.js";

const publicWhere = { status: "ACTIVE", deletedAt: null, category: { status: "ACTIVE" } } satisfies Prisma.ProductWhereInput;
const publicSelect = {
  id: true, code: true, name: true, slug: true, shortDescription: true, descriptionHtml: true, careInstructionHtml: true,
  originalPrice: true, salePrice: true, stockQuantity: true, updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: [{ isThumbnail: "desc" }, { displayOrder: "asc" }], take: 5, select: { id: true, url: true, altText: true } },
  options: { select: { optionType: true, name: true, values: true } },
} satisfies Prisma.ProductSelect;

@Injectable()
export class InternalCatalogService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async products(input: AiProductsDto) {
    const rows = await this.prisma.product.findMany({ where: { ...publicWhere, ...(input.cursor ? { id: { gt: input.cursor } } : {}) }, orderBy: { id: "asc" }, take: input.limit + 1, select: publicSelect });
    const items = rows.slice(0, input.limit);
    return { items, nextCursor: rows.length > input.limit ? items.at(-1)?.id : null };
  }
  categories() {
    return this.prisma.category.findMany({ where: { status: "ACTIVE" }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }], select: { id: true, name: true, slug: true, description: true, updatedAt: true } });
  }
  resolve(ids: string[]) {
    return this.prisma.product.findMany({ where: { ...publicWhere, id: { in: [...new Set(ids)] } }, select: publicSelect });
  }
}
