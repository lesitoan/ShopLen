import { ProductOptionType } from "@prisma/client";
import { prisma } from "@/config/prismaClient.js";
import {
  DEFAULT_PRODUCT_RECOMMENDATION_LIMIT,
  PRODUCT_RECOMMENDATION_FRESHNESS_DAYS,
  PRODUCT_RECOMMENDATION_WEIGHTS,
} from "@/constants/productRecommendation.js";
import type {
  ProductRecommendationSource,
  ScoredProductRecommendation,
} from "@/types/productRecommendation.type.js";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getColorCodes(product: ProductRecommendationSource) {
  const colorCodes = new Set<string>();

  for (const option of product.options) {
    if (!Array.isArray(option.values)) continue;

    for (const value of option.values) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value.code === "string"
      ) {
        colorCodes.add(value.code.trim().toUpperCase());
      }
    }
  }

  return colorCodes;
}

function calculatePriceScore(
  candidate: ProductRecommendationSource,
  reference: ProductRecommendationSource,
) {
  const referencePrice = reference.salePrice ?? reference.originalPrice;
  if (referencePrice <= 0) return 0;

  return Math.max(
    0,
    1 - Math.abs(candidate.salePrice ?? candidate.originalPrice - referencePrice) / referencePrice,
  );
}

function calculateColorScore(
  candidate: ProductRecommendationSource,
  reference: ProductRecommendationSource,
) {
  const candidateColors = getColorCodes(candidate);
  const referenceColors = getColorCodes(reference);

  if (candidateColors.size === 0 || referenceColors.size === 0) return 0;

  const sharedColorCount = [...candidateColors].filter((colorCode) =>
    referenceColors.has(colorCode),
  ).length;
  const uniqueColorCount = new Set([...candidateColors, ...referenceColors]).size;

  return sharedColorCount / uniqueColorCount;
}

function calculatePopularityScore(soldCount: number, maxSoldCount: number) {
  if (maxSoldCount <= 0) return 0;
  return Math.log1p(soldCount) / Math.log1p(maxSoldCount);
}

function calculateFreshnessScore(createdAt: Date) {
  const ageInDays = Math.max(
    0,
    (Date.now() - createdAt.getTime()) / MILLISECONDS_PER_DAY,
  );

  return Math.max(0, 1 - ageInDays / PRODUCT_RECOMMENDATION_FRESHNESS_DAYS);
}

function calculateSimilarityScore(
  candidate: ProductRecommendationSource,
  reference: ProductRecommendationSource,
  maxSoldCount: number,
) {
  const categoryScore = candidate.categoryId === reference.categoryId ? 1 : 0;

  return (
    categoryScore * PRODUCT_RECOMMENDATION_WEIGHTS.category +
    calculatePriceScore(candidate, reference) * PRODUCT_RECOMMENDATION_WEIGHTS.price +
    calculateColorScore(candidate, reference) * PRODUCT_RECOMMENDATION_WEIGHTS.color +
    calculatePopularityScore(candidate.soldCount, maxSoldCount) *
      PRODUCT_RECOMMENDATION_WEIGHTS.popularity +
    calculateFreshnessScore(candidate.createdAt) *
      PRODUCT_RECOMMENDATION_WEIGHTS.freshness
  );
}

function formatRecommendationItem(
  product: Awaited<ReturnType<typeof findRecommendationCandidates>>[number],
) {
  const thumbnail = product.images[0] ?? null;

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    category: product.category,
    thumbnail: thumbnail
      ? {
          id: thumbnail.id,
          url: thumbnail.url,
          altText: thumbnail.altText,
        }
      : null,
    originalPrice: product.originalPrice,
    salePrice: product.salePrice,
    price: product.salePrice ?? product.originalPrice,
    stockQuantity: product.stockQuantity,
    soldCount: product.soldCount,
    highlightType: product.highlightType,
  };
}

function findReferenceProducts(productIds: string[]) {
  return prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
      deletedAt: null,
    },
    select: {
      id: true,
      categoryId: true,
      originalPrice: true,
      salePrice: true,
      soldCount: true,
      createdAt: true,
      options: {
        where: { optionType: ProductOptionType.COLOR },
        select: { values: true },
      },
    },
  });
}

function findRecommendationCandidates(excludedProductIds: string[]) {
  return prisma.product.findMany({
    where: {
      id: { notIn: excludedProductIds },
      status: "ACTIVE",
      deletedAt: null,
      stockQuantity: { gt: 0 },
    },
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      categoryId: true,
      shortDescription: true,
      originalPrice: true,
      salePrice: true,
      stockQuantity: true,
      soldCount: true,
      highlightType: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isThumbnail: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          id: true,
          url: true,
          altText: true,
        },
      },
      options: {
        where: { optionType: ProductOptionType.COLOR },
        select: { values: true },
      },
    },
  });
}

export const productRecommendationService = {
  async recommendByProductIds(
    productIds: string[],
    limit = DEFAULT_PRODUCT_RECOMMENDATION_LIMIT,
  ) {
    const uniqueProductIds = [...new Set(productIds)];
    const [referenceProducts, candidates] = await prisma.$transaction([
      findReferenceProducts(uniqueProductIds),
      findRecommendationCandidates(uniqueProductIds),
    ]);

    if (candidates.length === 0) return [];

    const maxSoldCount = Math.max(...candidates.map((product) => product.soldCount));
    const scoredCandidates: Array<
      ScoredProductRecommendation<(typeof candidates)[number]>
    > = candidates.map((candidate) => {
      const score =
        referenceProducts.length > 0
          ? Math.max(
              ...referenceProducts.map((reference) =>
                calculateSimilarityScore(candidate, reference, maxSoldCount),
              ),
            )
          : calculatePopularityScore(candidate.soldCount, maxSoldCount) * 0.7 +
            calculateFreshnessScore(candidate.createdAt) * 0.3;

      return { product: candidate, score };
    });

    return scoredCandidates
      .sort(
        (first, second) =>
          second.score - first.score ||
          second.product.soldCount - first.product.soldCount ||
          second.product.createdAt.getTime() - first.product.createdAt.getTime(),
      )
      .slice(0, limit)
      .map(({ product }) => formatRecommendationItem(product));
  },
};

