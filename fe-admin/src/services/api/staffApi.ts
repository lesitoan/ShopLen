import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import type {
  AdminUserItem,
  AdminUserListQueryDto,
  AdminUserListResponse,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  UpdateAdminUserPasswordDto,
} from "@/types/staff.type";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listStaff: builder.query<AdminUserListResponse, AdminUserListQueryDto | void>({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      transformResponse: unwrapApiResponse<AdminUserListResponse>,
      providesTags: ["User"],
    }),
    getStaffDetail: builder.query<AdminUserItem, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: unwrapApiResponse<AdminUserItem>,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createStaff: builder.mutation<AdminUserItem, CreateAdminUserDto>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminUserItem>,
      invalidatesTags: ["User"],
    }),
    updateStaff: builder.mutation<
      AdminUserItem,
      { id: string; body: UpdateAdminUserDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<AdminUserItem>,
      invalidatesTags: (_result, _error, { id }) => [
        "User",
        { type: "User", id },
      ],
    }),
    updateStaffPassword: builder.mutation<
      void,
      { id: string; body: UpdateAdminUserPasswordDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}/password`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiResponse<void>,
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapApiResponse<void>,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useListStaffQuery,
  useGetStaffDetailQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffPasswordMutation,
  useDeleteStaffMutation,
} = staffApi;
