export type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

