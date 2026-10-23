export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode: string;
  internalMessage?: string;
};
