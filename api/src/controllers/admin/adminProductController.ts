import type { Request, Response } from "express";
import type {
  AdminProductListQueryDto,
  CreateAdminProductDto,
  UpdateAdminProductDto,
} from "@/dto/admin/adminProductDto.js";
import { adminProductService } from "@/services/admin/adminProductService.js";
import { sendCreated, sendPaginated, sendSuccess } from "@/utils/httpResponse.js";

export const adminProductController = {
  async listProducts(request: Request, response: Response) {
    const query = request.query as unknown as AdminProductListQueryDto;
    const result = await adminProductService.listProducts(query);
    return sendPaginated(response, result.items, result.pagination);
  },

  async createProduct(request: Request, response: Response) {
    const payload = request.body as CreateAdminProductDto;
    const product = await adminProductService.createProduct(payload);
    return sendCreated(response, product, "Tạo sản phẩm thành công.");
  },

  async getProductDetail(request: Request, response: Response) {
    const product = await adminProductService.getProductDetail(request.params.id);
    return sendSuccess(response, product);
  },

  async updateProduct(request: Request, response: Response) {
    const payload = request.body as UpdateAdminProductDto;
    const product = await adminProductService.updateProduct(
      request.params.id,
      payload,
    );
    return sendSuccess(response, product, "Cập nhật sản phẩm thành công.");
  },

  async deleteProduct(request: Request, response: Response) {
    await adminProductService.deleteProduct(request.params.id);
    return sendSuccess(response, undefined, "Xóa sản phẩm thành công.");
  },
};
