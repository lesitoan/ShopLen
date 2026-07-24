import type { Request, Response } from "express";
import { categoryService } from "@/services/client/categoryService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const categoryController = {
  async listCategories(_request: Request, response: Response) {
    const categories = await categoryService.listCategories();
    return sendSuccess(response, categories);
  },
};
