export type ApiSuccess<TData> = {
  success: true;
  message?: string;
  data: TData;
};

export type ApiError = {
  success: false;
  message: string;
  errorCode: string;
  internalMessage?: string;
};

export type ApiResponse<TData> = ApiSuccess<TData> | ApiError;
