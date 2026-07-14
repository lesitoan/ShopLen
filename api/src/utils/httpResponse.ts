import type { Response } from "express";

export function sendSuccess<TData>(
  response: Response,
  data: TData,
  message = "Thành công.",
) {
  return response.json({
    success: true,
    message,
    data,
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
