import {
  CHAT_HISTORY_CONTENT_LIMIT,
  CHAT_HISTORY_LIMIT,
} from "@/constants/chat";
import type { ChatHistoryTurn, ChatMessage } from "@/types/chat.type";

export function getChatHistory(messages: ChatMessage[]): ChatHistoryTurn[] {
  return messages.slice(-CHAT_HISTORY_LIMIT).map((message) => ({
    role: message.role === "USER" ? "user" : "assistant",
    content: message.content.slice(0, CHAT_HISTORY_CONTENT_LIMIT),
  }));
}

export function getChatSourceHref(path?: string) {
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(path)
  )
    return null;
  return path;
}

export function formatChatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
