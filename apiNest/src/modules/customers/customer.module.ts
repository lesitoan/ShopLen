import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CloudinaryModule } from "@/infrastructure/cloudinary/cloudinary.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { ClientCustomerController } from "@/modules/customers/controllers/clientCustomer.controller.js";
import { ClientCustomerService } from "@/modules/customers/services/clientCustomer.service.js";
import { AvatarUploadInterceptor } from "@/modules/customers/http/avatarUpload.interceptor.js";

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
  controllers: [ClientCustomerController],
  providers: [ClientCustomerService, AvatarUploadInterceptor],
})
export class CustomerModule {}
