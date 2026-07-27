import type { Request, Response } from "express";
import { customerAddressService } from "@/services/client/customerAddressService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

function getCustomerId(request: Request) {
  return request.customerId ?? "";
}

export const customerAddressController = {
  async listAddresses(request: Request, response: Response) {
    const addresses = await customerAddressService.listAddresses(
      getCustomerId(request),
    );
    return sendSuccess(response, addresses);
  },

  async createAddress(request: Request, response: Response) {
    await customerAddressService.createAddress(
      getCustomerId(request),
      request.body,
    );
    return sendSuccess(response, null, "Thêm địa chỉ thành công.");
  },

  async updateAddress(request: Request, response: Response) {
    await customerAddressService.updateAddress(
      getCustomerId(request),
      request.params.id,
      request.body,
    );
    return sendSuccess(response, null, "Cập nhật địa chỉ thành công.");
  },

  async deleteAddress(request: Request, response: Response) {
    await customerAddressService.deleteAddress(
      getCustomerId(request),
      request.params.id,
    );
    return sendSuccess(response, null, "Xóa địa chỉ thành công.");
  },
};
