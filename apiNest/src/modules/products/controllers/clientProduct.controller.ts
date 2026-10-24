import { Controller, Get, HttpCode, Inject, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { ClientProductService } from "@/modules/products/services/clientProduct.service.js";
import { productListQueryDto, homeProductSectionsQueryDto, productRecommendationsBodyDto, productSlugParamDto, type ProductListQueryDto, type HomeProductSectionsQueryDto, type ProductRecommendationsBodyDto } from "@/modules/products/dto/clientProduct.dto.js";

@Controller("products")
export class ClientProductController {
  constructor(@Inject(ClientProductService) private readonly service: ClientProductService) {}

  @Get("home")
  async home(@ValidatedRequest(homeProductSectionsQueryDto) input: { query: HomeProductSectionsQueryDto }, @Res({ passthrough: true }) response: Response) {
    response.set("Cache-Control", "public, max-age=60, s-maxage=600, stale-while-revalidate=300");
    return successResponse(await this.service.listHomeProductSections(input.query));
  }

  @Get()
  async list(@ValidatedRequest(productListQueryDto) input: { query: ProductListQueryDto }) {
    return successResponse(await this.service.listProducts(input.query));
  }

  @Post("recommendations")
  @HttpCode(200)
  async recommendations(@ValidatedRequest(productRecommendationsBodyDto) input: { body: ProductRecommendationsBodyDto }) {
    return successResponse({ items: await this.service.listProductRecommendations(input.body) });
  }

  @Get(":slug")
  async detail(@ValidatedRequest(productSlugParamDto) input: { params: { slug: string } }) {
    return successResponse(await this.service.getProductDetailBySlug(input.params.slug));
  }
}
