import { Controller, Get, Post, HttpCode, Inject, UseGuards } from "@nestjs/common";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { InternalAiGuard } from "@/modules/ai/guards/internalAi.guard.js";
import { InternalCatalogService } from "@/modules/ai/services/internalCatalog.service.js";
import { aiProductsDto, aiResolveDto, type AiProductsDto, type AiResolveDto } from "@/modules/ai/dto/ai.dto.js";

@Controller("internal/ai")
@UseGuards(InternalAiGuard)
export class InternalCatalogController {
  constructor(@Inject(InternalCatalogService) private readonly service: InternalCatalogService) {}
  @Get("products")
  async products(@ValidatedRequest(aiProductsDto) input: { query: AiProductsDto }) { return successResponse(await this.service.products(input.query)); }
  @Get("categories")
  async categories() { return successResponse(await this.service.categories()); }
  @Post("products/resolve")
  @HttpCode(200)
  async resolve(@ValidatedRequest(aiResolveDto) input: { body: AiResolveDto }) { return successResponse(await this.service.resolve(input.body.ids)); }
}
