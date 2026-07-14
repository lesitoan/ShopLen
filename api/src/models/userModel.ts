export type UserRole = "customer" | "staff" | "admin";

export type UserModel = {
  id: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
};
