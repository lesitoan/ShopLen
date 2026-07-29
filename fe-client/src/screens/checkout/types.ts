export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  note?: string;
  confirmTerms: boolean;
}
