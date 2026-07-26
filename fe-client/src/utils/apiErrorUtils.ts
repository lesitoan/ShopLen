import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Có lỗi xảy ra, vui lòng thử lại.",
) {
  if (isRecord(error) && "data" in error) {
    const queryError = error as FetchBaseQueryError;

    if (isRecord(queryError.data) && typeof queryError.data.message === "string") {
      return queryError.data.message;
    }

    if ("error" in queryError && typeof queryError.error === "string") {
      return queryError.error;
    }
  }

  if (isRecord(error) && typeof (error as SerializedError).message === "string") {
    return (error as SerializedError).message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
