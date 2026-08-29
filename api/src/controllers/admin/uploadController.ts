import type { Request, Response } from "express";
import type { AdminUploadImageQueryDto } from "@/dto/admin/uploadDto.js";
import { uploadService } from "@/services/admin/uploadService.js";
import { sendCreated } from "@/utils/httpResponse.js";

export const uploadController = {
  async uploadImage(request: Request, response: Response) {
    const query = request.query as unknown as AdminUploadImageQueryDto;
    const uploadedImage = await uploadService.uploadImage({
      file: request.file,
      target: query.target,
      adminUser: request.adminUser,
    });

    return sendCreated(response, uploadedImage, "Tải ảnh lên thành công.");
  },

  async uploadManyImages(request: Request, response: Response) {
    const query = request.query as unknown as AdminUploadImageQueryDto;
    const uploadedImages = await uploadService.uploadManyImages({
      files: Array.isArray(request.files)
        ? request.files
        : Object.values(request.files ?? {}).flat(),
      target: query.target,
      adminUser: request.adminUser,
    });

    return sendCreated(response, uploadedImages, "Tải ảnh lên thành công.");
  },
};
