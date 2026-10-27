import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { CloudinaryModule } from "@/infrastructure/cloudinary/cloudinary.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { AdminUploadController } from "@/modules/uploads/controllers/adminUpload.controller.js";
import { AdminUploadService } from "@/modules/uploads/services/adminUpload.service.js";
import {
  AdminSingleImageInterceptor,
  AdminManyImagesInterceptor,
} from "@/modules/uploads/http/adminImageUpload.interceptor.js";

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
  controllers: [AdminUploadController],
  providers: [
    AdminUploadService,
    AdminSingleImageInterceptor,
    AdminManyImagesInterceptor,
  ],
})
export class UploadModule {}
