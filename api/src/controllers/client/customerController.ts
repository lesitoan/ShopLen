import type { Request, Response } from "express";
import { customerService } from "@/services/client/customerService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

function getCustomerId(request: Request) {
  return request.customerId ?? "";
}

export const customerController = {
  async getMe(request: Request, response: Response) {
    const customer = await customerService.getMe(getCustomerId(request));
    return sendSuccess(response, customer);
  },

  async updateMe(request: Request, response: Response) {
    const customer = await customerService.updateMe(
      getCustomerId(request),
      request.body,
    );
    return sendSuccess(response, customer, "Cập nhật hồ sơ thành công.");
  },

  async changePassword(request: Request, response: Response) {
    const result = await customerService.changePassword(
      getCustomerId(request),
      request.body,
    );
    return sendSuccess(response, result, "Cập nhật mật khẩu thành công.");
  },
};
