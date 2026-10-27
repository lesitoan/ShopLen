import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CloudinaryModule } from "@/infrastructure/cloudinary/cloudinary.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { ClientCustomerController } from "@/modules/customers/controllers/clientCustomer.controller.js";
import { ClientCustomerService } from "@/modules/customers/services/clientCustomer.service.js";
import { AvatarUploadInterceptor } from "@/modules/customers/http/avatarUpload.interceptor.js";
import { CustomerAddressController } from "@/modules/customers/controllers/customerAddress.controller.js";
import { CustomerAddressService } from "@/modules/customers/services/customerAddress.service.js";
import { AdminCustomerController } from "@/modules/customers/controllers/adminCustomer.controller.js";
import { AdminCustomerService } from "@/modules/customers/services/adminCustomer.service.js";

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
  controllers: [
    ClientCustomerController,
    CustomerAddressController,
    AdminCustomerController,
  ],
  providers: [
    ClientCustomerService,
    CustomerAddressService,
    AdminCustomerService,
    AvatarUploadInterceptor,
  ],
})
export class CustomerModule {}
