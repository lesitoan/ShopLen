import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { CloudinaryService } from "@/infrastructure/cloudinary/cloudinary.service.js";

@Module({ imports: [EnvModule], providers: [CloudinaryService], exports: [CloudinaryService] })
export class CloudinaryModule {}
