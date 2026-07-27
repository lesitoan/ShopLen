import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  CustomerAddress,
  CreateCustomerAddressRequest,
  UpdateCustomerAddressRequest,
} from "@/types/customerAddress.type";

export type {
  CustomerAddress,
  CreateCustomerAddressRequest,
  UpdateCustomerAddressRequest,
};

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
