import type { Request, Response } from "express";
import type {
  AdminCustomerListQueryDto,
  UpdateAdminCustomerStatusDto,
} from "@/dto/admin/adminCustomerDto.js";
import { adminCustomerService } from "@/services/admin/adminCustomerService.js";
import { sendPaginated, sendSuccess } from "@/utils/httpResponse.js";

export const adminCustomerController = {
  async listCustomers(request: Request, response: Response) {
    const query = request.query as unknown as AdminCustomerListQueryDto;
    const result = await adminCustomerService.listCustomers(query);
    return sendPaginated(response, result.items, result.pagination);
  },

  async updateCustomerStatus(request: Request, response: Response) {
    const payload = request.body as UpdateAdminCustomerStatusDto;
    const customer = await adminCustomerService.updateCustomerStatus(
      request.params.id,
      payload,
    );
    return sendSuccess(
      response,
      customer,
      "Cập nhật trạng thái tài khoản thành công.",
    );
  },

  async getCustomerDetail(request: Request, response: Response) {
    const customer = await adminCustomerService.getCustomerDetail(request.params.id);
    return sendSuccess(response, customer);
  },
};
