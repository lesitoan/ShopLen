import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";

export type UploadTarget = "CATEGORY" | "PRODUCT" | "BLOG";

export type UploadImageResponse = {
  url: string;
  publicId?: string;
};

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<
      UploadImageResponse,
      { file: File; target: UploadTarget }
    >({
      query: ({ file, target }) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: `/admin/upload/images?target=${target}`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: unwrapApiResponse<UploadImageResponse>,
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
