import { Controller, Get, Inject, Param, Res } from "@nestjs/common";
import type { Response } from "express";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { ClientBlogService } from "@/modules/blogs/services/clientBlog.service.js";
import {
  blogPostListQueryDto,
  type BlogPostListQueryDto,
} from "@/modules/blogs/dto/clientBlog.dto.js";

@Controller("blog")
export class ClientBlogController {
  constructor(
    @Inject(ClientBlogService) private readonly service: ClientBlogService,
  ) {}

  @Get("tags")
  async tags() {
    return successResponse(await this.service.listTags());
  }

  @Get("posts")
  async list(
    @ValidatedRequest(blogPostListQueryDto)
    input: { query: BlogPostListQueryDto },
    @Res({ passthrough: true }) response: Response,
  ) {
    const query = input.query;
    if (
      query.home &&
      query.page === 1 &&
      query.limit === 4 &&
      !query.tag &&
      !query.search
    ) {
      response.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400",
      );
    }
    return successResponse(await this.service.listPosts(query));
  }

  @Get("posts/featured")
  async featured() {
    return {
      success: true,
      message: "Thanh cong.",
      data: await this.service.getFeaturedPost(),
    };
  }

  @Get("posts/:slug")
  async detail(@Param("slug") slug: string, @Res() response: Response) {
    const post = await this.service.getPostBySlug(slug);
    if (!post)
      return response
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy bài viết.",
          data: null,
        });
    return response.json(successResponse(post));
  }
}
