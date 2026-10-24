import { Controller, HttpCode, Inject, Post } from "@nestjs/common";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { CartService } from "@/modules/cart/services/cart.service.js";
import { cartProductListDto, type CartProductListDto } from "@/modules/cart/dto/cart.dto.js";

@Controller("cart")
export class CartController {
  constructor(@Inject(CartService) private readonly service: CartService) {}

  @Post("products")
  @HttpCode(200)
  async products(@ValidatedRequest(cartProductListDto) input: { body: CartProductListDto }) {
    return successResponse(await this.service.listCartProducts(input.body));
  }
}
