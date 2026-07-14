import type { Request, Response } from "express";
import { productService } from "../services/productService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const productController = {
  async listProducts(_request: Request, response: Response) {
    const products = await productService.listProducts();
    return sendSuccess(response, products);
  },
  async getProductDetail(request: Request, response: Response) {
    const product = await productService.getProductDetail(request.params.id);
    return sendSuccess(response, product);
  },
};
