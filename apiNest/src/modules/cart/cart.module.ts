import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CartController } from "@/modules/cart/controllers/cart.controller.js";
import { CartService } from "@/modules/cart/services/cart.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
