import { Controller, Delete, Get, Inject, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "@/modules/auth/guards/adminAuth.guard.js";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { CurrentAdmin } from "@/modules/auth/decorators/authActor.decorator.js";
import type { AdminSession } from "@/modules/auth/types/adminAuth.type.js";
import type { BlogPostStatus } from "@prisma/client";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { createdResponse, paginatedResponse, successResponse } from "@/common/responses/httpResponse.js";
import { AdminBlogService } from "@/modules/blogs/services/adminBlog.service.js";
import { adminBlogPostListQueryDto, adminBlogPostParamsDto, createAdminBlogPostDto, updateAdminBlogPostDto, updateAdminBlogPostStatusDto, createAdminBlogTagDto, updateAdminBlogTagDto, type AdminBlogPostListQueryDto, type CreateAdminBlogPostDto, type UpdateAdminBlogPostDto, type CreateAdminBlogTagDto, type UpdateAdminBlogTagDto } from "@/modules/blogs/dto/adminBlog.dto.js";

@Controller("admin/blog")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN", "STAFF_CONTENT")
export class AdminBlogController {
  constructor(@Inject(AdminBlogService) private readonly service: AdminBlogService) {}

  @Get("tags")
  async tags() { return successResponse(await this.service.listTags(), "Lấy danh sách chủ đề thành công."); }

  @Post("tags")
  async createTag(@ValidatedRequest(createAdminBlogTagDto) input: { body: CreateAdminBlogTagDto }) {
    return createdResponse(await this.service.createTag(input.body), "Tạo chủ đề bài viết thành công.");
  }

  @Patch("tags/:id")
  async updateTag(@ValidatedRequest(updateAdminBlogTagDto) input: { params: { id: string }; body: UpdateAdminBlogTagDto }) {
    return successResponse(await this.service.updateTag(input.params.id, input.body), "Cập nhật chủ đề thành công.");
  }

  @Delete("tags/:id")
  async deleteTag(@ValidatedRequest(adminBlogPostParamsDto) input: { params: { id: string } }) {
    await this.service.deleteTag(input.params.id);
    return successResponse(undefined, "Xóa chủ đề thành công.");
  }

  @Get("posts")
  async posts(@ValidatedRequest(adminBlogPostListQueryDto) input: { query: AdminBlogPostListQueryDto }) {
    const result = await this.service.listPosts(input.query);
    return paginatedResponse(result.items, result.pagination);
  }

  @Get("posts/:id")
  async detail(@ValidatedRequest(adminBlogPostParamsDto) input: { params: { id: string } }) {
    return successResponse(await this.service.getPostDetail(input.params.id));
  }

  @Post("posts")
  async create(@CurrentAdmin() actor: AdminSession, @ValidatedRequest(createAdminBlogPostDto) input: { body: CreateAdminBlogPostDto }) {
    return createdResponse(await this.service.createPost(input.body, actor.id), "Tạo bài viết mới thành công.");
  }

  @Patch("posts/:id")
  async update(@ValidatedRequest(updateAdminBlogPostDto) input: { params: { id: string }; body: UpdateAdminBlogPostDto }) {
    return successResponse(await this.service.updatePost(input.params.id, input.body), "Cập nhật bài viết thành công.");
  }

  @Patch("posts/:id/status")
  async status(@ValidatedRequest(updateAdminBlogPostStatusDto) input: { params: { id: string }; body: { status: BlogPostStatus } }) {
    await this.service.updateStatus(input.params.id, input.body.status);
    return successResponse(undefined, "Cập nhật trạng thái bài viết thành công.");
  }

  @Delete("posts/:id")
  async delete(@ValidatedRequest(adminBlogPostParamsDto) input: { params: { id: string } }) {
    await this.service.deletePost(input.params.id);
    return successResponse(undefined, "Xóa bài viết thành công.");
  }
}
