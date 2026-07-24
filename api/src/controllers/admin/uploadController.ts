import type { Request, Response } from "express";
import { uploadService } from "@/services/admin/uploadService.js";
import { sendCreated } from "@/utils/httpResponse.js";

export const uploadController = {
  async createUploadTarget(_request: Request, response: Response) {
    const uploadTarget = await uploadService.createUploadTarget();
    return sendCreated(response, uploadTarget);
  },
};
