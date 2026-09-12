import type { Request, Response } from "express";
import { categoryService } from "@/services/client/categories/categoryService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const categoryController = {
  async listCategories(_request: Request, response: Response) {
    response.set("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400");
    const categories = await categoryService.listCategories();
    return sendSuccess(response, categories);
  },
};
