export type PromotionType = "fixedAmount" | "percent";

export type PromotionModel = {
  id: string;
  code: string;
  name: string;
  promotionType: PromotionType;
  value: number;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
};
