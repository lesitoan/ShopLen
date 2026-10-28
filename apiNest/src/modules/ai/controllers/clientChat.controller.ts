import { Controller, Post, HttpCode, Inject } from "@nestjs/common";
import { ValidatedRequest } from "@/common/decorators/validatedRequest.decorator.js";
import { successResponse } from "@/common/responses/httpResponse.js";
import { ChatProxyService } from "@/modules/ai/services/chatProxy.service.js";
import { aiChatDto, type AiChatDto } from "@/modules/ai/dto/ai.dto.js";

@Controller("chat")
export class ClientChatController {
  constructor(@Inject(ChatProxyService) private readonly service: ChatProxyService) {}
  @Post("messages")
  @HttpCode(200)
  async send(@ValidatedRequest(aiChatDto) input: { body: AiChatDto }) { return successResponse(await this.service.send(input.body)); }
}
