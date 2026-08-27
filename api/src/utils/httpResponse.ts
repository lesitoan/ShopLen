import type { Response } from "express";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export function sendSuccess<TData>(
  response: Response,
  data: TData,
  message = "Thành công.",
) {
  return response.json({
    success: true,
    message,
    ...(data !== undefined && data !== null && data ? { data } : {}),
  });
}

export function sendCreated<TData>(
  response: Response,
  data: TData,
  message = "Tạo mới thành công.",
) {
  return response.status(201).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<TItem>(
  response: Response,
  items: TItem[],
  pagination: PaginationMeta,
  message = "Thành công.",
) {
  return response.json({
    success: true,
    message,
    data: {
      items,
      pagination,
    },
  });
}
