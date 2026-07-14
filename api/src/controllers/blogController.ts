import type { Request, Response } from "express";
import { blogService } from "../services/blogService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const blogController = {
  async listPosts(_request: Request, response: Response) {
    const posts = await blogService.listPosts();
    return sendSuccess(response, posts);
  },
  async getPostDetail(request: Request, response: Response) {
    const post = await blogService.getPostDetail(request.params.slug);
    return sendSuccess(response, post);
  },
};
