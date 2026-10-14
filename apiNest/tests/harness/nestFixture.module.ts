import { Controller, Get, HttpCode, Module, Post, Query, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import multer from "multer";
import { AppModule } from "@/app.module.js";
import { AppError } from "@/common/errors/appError.js";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { createdResponse, paginatedResponse, successResponse } from "@/common/responses/httpResponse.js";
import { fixtureValue } from "../fixtures/httpCases.js";
import { requestSchema, type RequestFixture } from "../fixtures/requestSchema.js";

@Controller("fixtures")
class FixtureController {
  @Get("success")
  success(@Query("value") value?: string) { return successResponse(fixtureValue(value)); }

  @Post("created")
  created() { return createdResponse({ id: "fixture-created" }); }

  @Get("paginated")
  paginated() { return paginatedResponse([], { page: 1, limit: 20, total: 0 }); }

  @Get("featured")
  featured() { return { success: true, message: "Thanh cong.", data: null }; }

  @Get("missing-blog")
  missingBlog(@Res() response: Response) {
    return response.status(404).json({ success: false, message: "Không tìm thấy bài viết.", data: null });
  }

  @Post("webhook")
  @HttpCode(200)
  webhook(@Req() request: Request & { rawBody: Buffer }) {
    if (request.rawBody.toString("utf8") !== '{ "amount": 100 }') {
      throw new AppError("Raw body changed", 400, "RAW_BODY_CHANGED");
    }
    return { success: true };
  }

  @Get("error")
  error() { throw new AppError("Không hợp lệ.", 409, "FIXTURE_CONFLICT", "fixture-private"); }

  @Get("unhandled")
  unhandled() { throw new Error("fixture-error"); }

  @Get("upload-error")
  uploadError() { throw new multer.MulterError("LIMIT_FILE_SIZE"); }

  @Post("request/:id")
  @HttpCode(200)
  request(@ValidatedRequest(requestSchema) input: RequestFixture) { return successResponse(input); }
}

@Module({ imports: [AppModule], controllers: [FixtureController] })
export class NestFixtureModule {}
