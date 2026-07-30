import type { Request, Response } from "express";
import type { CartProductListDto } from "@/dto/client/cartDto.js";
import { cartService } from "@/services/client/cartService.js";
import { sendSuccess } from "@/utils/httpResponse.js";

export const cartController = {
  async listCartProducts(request: Request, response: Response) {
    const products = await cartService.listCartProducts(
      request.body as CartProductListDto,
    );

    return sendSuccess(response, products);
  },
};
