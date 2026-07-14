export type LoyaltyTransactionType = "earn" | "redeem" | "adjust";

export type LoyaltyTransactionModel = {
  id: string;
  userId: string;
  orderId?: string;
  transactionType: LoyaltyTransactionType;
  points: number;
  note?: string;
  createdAt: Date;
};
