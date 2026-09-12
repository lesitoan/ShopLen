import type { Request, Response } from "express";
import type { BlogPostListQueryDto } from "@/dto/client/blogDto.js";
import { blogService } from "@/services/client/blogs/blogService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const blogController = {
  async listTags(_request: Request, response: Response) {
    const tags = await blogService.listTags();
    return sendSuccess(response, tags);
  },

  async listPosts(request: Request, response: Response) {
    const query = request.query as unknown as BlogPostListQueryDto;
    if (query.home && query.page === 1 && query.limit === 4 && !query.tag && !query.search) {
      response.set("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400");
    }
    const posts = await blogService.listPosts(
      query,
    );
    return sendSuccess(response, posts);
  },

  async getFeaturedPost(_request: Request, response: Response) {
    const post = await blogService.getFeaturedPost();

    return response.json({
      success: true,
      message: "Thanh cong.",
      data: post,
    });
  },

  async getPostBySlug(request: Request, response: Response) {
    const slug = String(request.params.slug);
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết.",
        data: null,
      });
    }

    return sendSuccess(response, post);
  },
};
