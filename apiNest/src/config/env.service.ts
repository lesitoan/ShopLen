import { Injectable } from "@nestjs/common";
import { env } from "@/config/envValidation.js";

@Injectable()
export class EnvService {
  readonly values = env;
}
