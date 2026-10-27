import { Controller, Get, Header, Inject } from "@nestjs/common";
import { ClientCategoryService } from "@/modules/categories/services/clientCategory.service.js";
import { successResponse } from "@/common/responses/httpResponse.js";

@Controller("categories")
export class ClientCategoryController {
  constructor(
    @Inject(ClientCategoryService)
    private readonly service: ClientCategoryService,
  ) {}

  @Get()
  @Header(
    "Cache-Control",
    "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400",
  )
  async list() {
    return successResponse(await this.service.listCategories());
  }
}
