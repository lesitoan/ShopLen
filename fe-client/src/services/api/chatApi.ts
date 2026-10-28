import { baseApi, unwrapApiResponse } from "@/services/api/baseApi";
import { CHAT_REQUEST_TIMEOUT } from "@/constants/chat";
import type { ChatRequest, ChatResponse } from "@/types/chat.type";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (body) => ({
        url: "/chat/messages",
        method: "POST",
        body,
        timeout: CHAT_REQUEST_TIMEOUT,
      }),
      transformResponse: unwrapApiResponse<ChatResponse>,
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
