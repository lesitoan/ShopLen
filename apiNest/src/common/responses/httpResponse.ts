import type { PaginationMeta } from "@/common/types/httpResponse.type.js";

export function successResponse<TData>(data: TData, message = "Thành công.") {
  return { success: true, message, ...(data ? { data } : {}) };
}

export function createdResponse<TData>(
  data: TData,
  message = "Tạo mới thành công.",
) {
  return { success: true, message, data };
}

export function paginatedResponse<TItem>(
  items: TItem[],
  pagination: PaginationMeta,
  message = "Thành công.",
) {
  return { success: true, message, data: { items, pagination } };
}
