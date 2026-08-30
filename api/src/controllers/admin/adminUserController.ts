import type { Request, Response } from "express";
import type {
  AdminUserListQueryDto,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  UpdateAdminUserPasswordDto,
} from "@/dto/admin/adminUserDto.js";
import { adminUserService } from "@/services/admin/adminUserService.js";
import { sendCreated, sendPaginated, sendSuccess } from "@/utils/httpResponse.js";

export const adminUserController = {
  async listUsers(request: Request, response: Response) {
    const query = request.query as unknown as AdminUserListQueryDto;
    const result = await adminUserService.listUsers(query);
    return sendPaginated(response, result.items, result.pagination);
  },

  async getUserDetail(request: Request, response: Response) {
    const user = await adminUserService.getUserDetail(
      request.params.id,
      request.adminUser!,
    );
    return sendSuccess(response, user);
  },

  async createUser(request: Request, response: Response) {
    const user = await adminUserService.createUser(
      request.body as CreateAdminUserDto,
      request.adminUser!,
    );
    return sendCreated(response, user, "Tạo nhân viên thành công.");
  },

  async updateUser(request: Request, response: Response) {
    const user = await adminUserService.updateUser(
      request.params.id,
      request.body as UpdateAdminUserDto,
      request.adminUser!,
    );
    return sendSuccess(response, user, "Cập nhật nhân viên thành công.");
  },

  async updateUserPassword(request: Request, response: Response) {
    await adminUserService.updateUserPassword(
      request.params.id,
      request.body as UpdateAdminUserPasswordDto,
      request.adminUser!,
    );
    return sendSuccess(response, undefined, "Cập nhật mật khẩu thành công.");
  },

  async deleteUser(request: Request, response: Response) {
    await adminUserService.deleteUser(request.params.id, request.adminUser!);
    return sendSuccess(response, undefined, "Xóa nhân viên thành công.");
  },
};
