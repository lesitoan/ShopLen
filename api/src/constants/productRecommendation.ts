export const PRODUCT_RECOMMENDATION_WEIGHTS = {
  category: 0.5,
  price: 0.25,
  color: 0.1,
  popularity: 0.1,
  freshness: 0.05,
} as const;

export const PRODUCT_RECOMMENDATION_FRESHNESS_DAYS = 60;
export const DEFAULT_PRODUCT_RECOMMENDATION_LIMIT = 4;

