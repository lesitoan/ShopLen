export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  provinceName: string;
  districtName?: string | null;
  wardName?: string | null;
  addressLine: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerAddressRequest {
  fullName: string;
  phone: string;
  provinceName: string;
  addressLine: string;
  districtName?: string;
  wardName?: string;
  isDefault?: boolean;
}

export interface UpdateCustomerAddressRequest {
  id: string;
  isDefault: boolean;
}
