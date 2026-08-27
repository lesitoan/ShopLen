import type { Request, Response } from "express";
import type { AdminProductListQueryDto } from "@/dto/admin/adminProductDto.js";
import { adminProductService } from "@/services/admin/adminProductService.js";
import { sendPaginated } from "@/utils/httpResponse.js";

export const adminProductController = {
  async listProducts(request: Request, response: Response) {
    const query = request.query as unknown as AdminProductListQueryDto;
    const result = await adminProductService.listProducts(query);
    return sendPaginated(response, result.items, result.pagination);
  },
};
