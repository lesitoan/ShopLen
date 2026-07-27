import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";

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

export const customerAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => "/addresses",
      transformResponse: unwrapApiResponse<CustomerAddress[]>,
      providesTags: ["CustomerAddress"],
    }),

    createCustomerAddress: builder.mutation<null, CreateCustomerAddressRequest>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<null>,
      invalidatesTags: ["CustomerAddress"],
    }),

    updateCustomerAddress: builder.mutation<null, UpdateCustomerAddressRequest>({
      query: ({ id, isDefault }) => ({
        url: `/addresses/${id}`,
        method: "PATCH",
        body: { isDefault },
      }),
      transformResponse: unwrapApiResponse<null>,
      invalidatesTags: ["CustomerAddress"],
    }),

    deleteCustomerAddress: builder.mutation<null, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<null>,
      invalidatesTags: ["CustomerAddress"],
    }),
  }),
});

export const {
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
} = customerAddressApi;
