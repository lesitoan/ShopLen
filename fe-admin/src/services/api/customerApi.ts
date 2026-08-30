import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminCustomerListItem,
  AdminCustomerListQueryDto,
  AdminCustomerListResponse,
  UpdateAdminCustomerStatusDto,
} from "@/types/customer.type";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<
      AdminCustomerListResponse,
      AdminCustomerListQueryDto | void
    >({
      query: (params) => ({
        url: "/admin/customers",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminCustomerListResponse>,
      providesTags: ["Customer"],
    }),
    updateCustomerStatus: builder.mutation<
      AdminCustomerListItem,
      { id: string; body: UpdateAdminCustomerStatusDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/customers/${id}/status`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminCustomerListItem>,
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useListCustomersQuery,
  useUpdateCustomerStatusMutation,
} = customerApi;
