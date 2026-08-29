import type { Request, Response } from "express";
import type {
  AdminProductListQueryDto,
  CreateAdminProductDto,
} from "@/dto/admin/adminProductDto.js";
import { adminProductService } from "@/services/admin/adminProductService.js";
import { sendCreated, sendPaginated } from "@/utils/httpResponse.js";

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
};
