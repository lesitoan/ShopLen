import { Inject, Injectable } from "@nestjs/common";
import { EnvService } from "@/config/env.service.js";
import { AppError } from "@/common/errors/appError.js";
import type { AiChatDto } from "@/modules/ai/dto/ai.dto.js";

@Injectable()
export class ChatProxyService {
  constructor(@Inject(EnvService) private readonly config: EnvService) {}
  async send(input: AiChatDto) {
    const { AI_SERVICE_URL: url, AI_INTERNAL_KEY: key } = this.config.values;
    if (!url || !key) throw new AppError("Chatbot chưa được cấu hình.", 503, "AI_NOT_CONFIGURED");
    let response: Response;
    try {
      response = await fetch(`${url.replace(/\/$/, "")}/internal/chat`, { method: "POST", headers: { "content-type": "application/json", "x-internal-key": key }, body: JSON.stringify(input), signal: AbortSignal.timeout(60000), redirect: "error" });
    } catch { throw new AppError("Chatbot tạm thời không khả dụng.", 503, "AI_UNAVAILABLE"); }
    if (!response.ok) throw new AppError(response.status === 429 ? "Chatbot đang bận. Vui lòng thử lại sau." : "Chatbot tạm thời không khả dụng.", response.status === 429 ? 429 : 503, response.status === 429 ? "AI_BUSY" : "AI_UNAVAILABLE");
    try {
      const body: unknown = await response.json();
      if (!body || typeof body !== "object" || !("answer" in body) || typeof body.answer !== "string" || !("sources" in body) || !Array.isArray(body.sources) || !("products" in body) || !Array.isArray(body.products)) throw new Error("Invalid AI response");
      return body;
    } catch { throw new AppError("Phản hồi chatbot không hợp lệ.", 502, "AI_INVALID_RESPONSE"); }
  }
}
