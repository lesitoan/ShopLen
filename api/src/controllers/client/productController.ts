import type { Request, Response } from "express";
import type { ProductListQueryDto } from "@/dto/client/productDto.js";
import { productService } from "@/services/client/productService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const productController = {
  async listProducts(request: Request, response: Response) {
    const products = await productService.listProducts(
      request.query as unknown as ProductListQueryDto,
    );
    return sendSuccess(response, products);
  },
  async getProductDetail(request: Request, response: Response) {
    const product = await productService.getProductDetail(request.params.id);
    return sendSuccess(response, product);
  },
};
