import type { PipeTransform } from "@nestjs/common";
import type { ZodTypeAny, output } from "zod";
import { AppError } from "@/common/errors/appError.js";

export class ZodValidationPipe<
  TSchema extends ZodTypeAny,
> implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): output<TSchema> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new AppError(
        "Dữ liệu gửi lên không hợp lệ.",
        422,
        "VALIDATION_ERROR",
        JSON.stringify(result.error.flatten()),
      );
    }
    return result.data;
  }
}
