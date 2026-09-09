import type { Request, Response } from "express";
import { adminBlogService } from "@/services/admin/adminBlogService.js";
import { sendCreated, sendPaginated, sendSuccess } from "@/utils/httpResponse.js";
import type {
  AdminBlogPostListQueryDto,
  CreateAdminBlogPostDto,
  UpdateAdminBlogPostDto,
} from "@/dto/admin/adminBlogDto.js";
import type { BlogPostStatus } from "@prisma/client";

export const adminBlogController = {
  async listTags(_req: Request, res: Response) {
    const tags = await adminBlogService.listTags();
    return sendSuccess(res, tags, "Lấy danh sách chủ đề thành công.");
  },

  async createTag(req: Request, res: Response) {
    const tag = await adminBlogService.createTag(req.body);
    return sendCreated(res, tag, "Tạo chủ đề bài viết thành công.");
  },

  async updateTag(req: Request, res: Response) {
    const { id } = req.params;
    const tag = await adminBlogService.updateTag(id, req.body);
    return sendSuccess(res, tag, "Cập nhật chủ đề thành công.");
  },

  async deleteTag(req: Request, res: Response) {
    const { id } = req.params;
    await adminBlogService.deleteTag(id);
    return sendSuccess(res, undefined, "Xóa chủ đề thành công.");
  },

  async listPosts(req: Request, res: Response) {
    const result = await adminBlogService.listPosts(
      req.query as unknown as AdminBlogPostListQueryDto
    );
    return sendPaginated(res, result.items, result.pagination);
  },

  async getPostDetail(req: Request, res: Response) {
    const { id } = req.params;
    const post = await adminBlogService.getPostDetail(id);
    return sendSuccess(res, post);
  },

  async createPost(req: Request, res: Response) {
    const authorUserId = req.adminUserId;
    const post = await adminBlogService.createPost(
      req.body as CreateAdminBlogPostDto,
      authorUserId
    );
    return sendCreated(res, post, "Tạo bài viết mới thành công.");
  },

  async updatePost(req: Request, res: Response) {
    const { id } = req.params;
    const post = await adminBlogService.updatePost(
      id,
      req.body as UpdateAdminBlogPostDto
    );
    return sendSuccess(res, post, "Cập nhật bài viết thành công.");
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as { status: BlogPostStatus };
    await adminBlogService.updateStatus(id, status);
    return sendSuccess(res, undefined, "Cập nhật trạng thái bài viết thành công.");
  },

  async deletePost(req: Request, res: Response) {
    const { id } = req.params;
    await adminBlogService.deletePost(id);
    return sendSuccess(res, undefined, "Xóa bài viết thành công.");
  },
};
