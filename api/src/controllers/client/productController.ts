import type { Request, Response } from "express";
import type {
  HomeProductSectionsQueryDto,
  ProductListQueryDto,
} from "@/dto/client/productDto.js";
import { productService } from "@/services/client/products/productService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const productController = {
  async listHomeProductSections(request: Request, response: Response) {
    response.set("Cache-Control", "public, max-age=60, s-maxage=600, stale-while-revalidate=300");
    const sections = await productService.listHomeProductSections(
      request.query as unknown as HomeProductSectionsQueryDto,
    );
    return sendSuccess(response, sections);
  },
  async listProducts(request: Request, response: Response) {
    const products = await productService.listProducts(
      request.query as unknown as ProductListQueryDto,
    );
    return sendSuccess(response, products);
  },
  async getProductDetailBySlug(request: Request, response: Response) {
    const product = await productService.getProductDetailBySlug(
      request.params.slug,
    );
    return sendSuccess(response, product);
  },
};
