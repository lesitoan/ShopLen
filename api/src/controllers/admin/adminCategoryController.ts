import type { Request, Response } from "express";
import type {
  AdminCategoryListQueryDto,
  CreateAdminCategoryDto,
  UpdateAdminCategoryDto,
} from "@/dto/admin/adminCategoryDto.js";
import { adminCategoryService } from "@/services/admin/adminCategoryService.js";
import { sendCreated, sendPaginated, sendSuccess } from "@/utils/httpResponse.js";

export const adminCategoryController = {
  async listCategories(request: Request, response: Response) {
    const query = request.query as unknown as AdminCategoryListQueryDto;
    const result = await adminCategoryService.listCategories(query);
    return sendPaginated(response, result.items, result.pagination);
  },

  async getCategoryDetail(request: Request, response: Response) {
    const category = await adminCategoryService.getCategoryDetail(request.params.id);
    return sendSuccess(response, category);
  },

  async createCategory(request: Request, response: Response) {
    const payload = request.body as CreateAdminCategoryDto;
    await adminCategoryService.createCategory(payload);
    return sendCreated(response, undefined, "Tạo danh mục thành công.");
  },

  async updateCategory(request: Request, response: Response) {
    const payload = request.body as UpdateAdminCategoryDto;
    await adminCategoryService.updateCategory(request.params.id, payload);
    return sendSuccess(response, undefined, "Cập nhật danh mục thành công.");
  },

  async deleteCategory(request: Request, response: Response) {
    await adminCategoryService.deleteCategory(request.params.id);
    return sendSuccess(response, undefined, "Xóa danh mục thành công.");
  },
};
