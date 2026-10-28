"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Send, X } from "lucide-react";
import { useSendChatMessageMutation } from "@/services/api/chatApi";
import { CHAT_MESSAGE_LIMIT, CHAT_SUGGESTIONS } from "@/constants/chat";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import {
  formatChatPrice,
  getChatHistory,
  getChatSourceHref,
} from "@/utils/chatUtils";
import type { ChatMessage } from "@/types/chat.type";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function ChatModal({
  isOpen,
  onClose,
  triggerRef,
}: ChatModalProps) {
  const [sendMessage, { isLoading }] = useSendChatMessageMutation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const requestLock = useRef(false);
  const requestRef = useRef<ReturnType<typeof sendMessage> | null>(null);

  useEffect(
    () => () => {
      requestRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const media = window.matchMedia("(max-width: 767px)");
    const previousOverflow = document.body.style.overflow;
    const syncViewport = () => {
      setIsMobile(media.matches);
      document.body.style.overflow = media.matches
        ? "hidden"
        : previousOverflow;
    };
    syncViewport();
    media.addEventListener("change", syncViewport);
    const frame = requestAnimationFrame(() => {
      (media.matches ? panelRef.current : inputRef.current)?.focus({
        preventScroll: true,
      });
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !media.matches &&
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      )
        onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !media.matches) return;
      const elements = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], textarea:not(:disabled), summary, [tabindex="0"]',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      if (!elements?.length) return;
      const first = elements[0],
        last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === panelRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === panelRef.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", syncViewport);
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (isOpen && followRef.current && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages, pendingQuestion, errorMessage, isLoading]);

  async function submit(question: string) {
    const content = question.trim();
    if (!content || content.length > CHAT_MESSAGE_LIMIT || requestLock.current)
      return;
    requestLock.current = true;
    followRef.current = true;
    setPendingQuestion(content);
    setErrorMessage("");
    setDraft("");
    try {
      const request = sendMessage({
        message: content,
        history: getChatHistory(messages),
      });
      requestRef.current = request;
      const response = await request.unwrap();
      const id = crypto.randomUUID();
      setMessages((current) => [
        ...current,
        { id: `${id}-user`, role: "USER", content },
        {
          id: `${id}-assistant`,
          role: "ASSISTANT",
          content: response.answer,
          response,
        },
      ]);
      setPendingQuestion("");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Chưa gửi được tin nhắn. Bạn vui lòng thử lại.",
        ),
      );
    } finally {
      requestRef.current = null;
      requestLock.current = false;
    }
  }

  function resetConversation() {
    if (requestLock.current) return;
    setMessages([]);
    setPendingQuestion("");
    setErrorMessage("");
    setDraft("");
    inputRef.current?.focus({ preventScroll: true });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(draft);
  }

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        id="shop-chat-dialog"
        role="dialog"
        aria-modal={isMobile}
        aria-labelledby="shop-chat-title"
        aria-describedby="shop-chat-description"
        tabIndex={-1}
        className="chat-panel fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-border bg-surface text-text-primary outline-none md:inset-x-auto md:bottom-6 md:right-20 md:h-[560px] md:max-h-[calc(100dvh-48px)] md:w-96 md:rounded-3xl"
      >
        <div
          className="mx-auto my-3 h-1 w-10 shrink-0 rounded-full bg-border md:hidden"
          aria-hidden="true"
        />
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-primary-light px-4 py-4">
          <div className="min-w-0">
            <h2 id="shop-chat-title" className="text-base font-semibold">
              Chat với Tiệm Len
            </h2>
            <p
              id="shop-chat-description"
              className="mt-1 text-xs text-text-secondary"
            >
              Tư vấn sản phẩm và chính sách mua hàng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2">
          <span className="text-[11px] text-text-secondary">
            Trợ lý AI của Tiệm Len Nhà Kiều
          </span>
          <button
            type="button"
            onClick={resetConversation}
            disabled={isLoading}
            className="shrink-0 text-xs font-medium text-secondary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Làm mới
          </button>
        </div>
        <div
          ref={scrollRef}
          onScroll={() => {
            const node = scrollRef.current;
            if (node)
              followRef.current =
                node.scrollHeight - node.scrollTop - node.clientHeight < 96;
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background p-4"
        >
          {!messages.length && !pendingQuestion && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold">
                  Chào bạn, Tiệm Len có thể giúp gì?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Bạn đang tìm một món quà, muốn đặt móc theo ảnh hay cần tìm
                  hiểu cách bảo quản len?
                </p>
              </div>
              <div
                className="flex flex-col items-start gap-2"
                aria-label="Câu hỏi gợi ý"
              >
                {CHAT_SUGGESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void submit(question)}
                    className="rounded-xl border border-primary/50 bg-surface px-3 py-2 text-left text-xs text-secondary transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Nội dung trò chuyện"
            className="space-y-4"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={message.role === "USER" ? "ml-8" : "mr-4"}
              >
                <p
                  className={`mb-1 text-[11px] text-text-secondary ${message.role === "USER" ? "text-right" : ""}`}
                >
                  {message.role === "USER" ? "Bạn" : "Tiệm Len"}
                </p>
                <div
                  className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-3 text-sm leading-relaxed [overflow-wrap:anywhere] ${message.role === "USER" ? "bg-primary-light text-text-primary" : "border border-border bg-surface"}`}
                >
                  {message.content}
                </div>
                {!!message.response?.products.length && (
                  <div className="mt-2 space-y-2">
                    {message.response.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/san-pham/${encodeURIComponent(product.slug)}`}
                        onClick={onClose}
                        className="block rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary"
                      >
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="mt-1 text-sm font-semibold text-secondary">
                          {formatChatPrice(product.price)}
                        </p>
                        {product.color && (
                          <p className="mt-1 text-xs text-text-secondary">
                            Màu: {product.color}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
                {!!message.response?.sources.length && (
                  <details className="mt-2 text-xs text-text-secondary">
                    <summary className="cursor-pointer py-1 font-medium text-secondary">
                      Nguồn tham khảo ({message.response.sources.length})
                    </summary>
                    <div className="mt-1 space-y-3 border-l border-primary pl-3">
                      {message.response.sources.map((source) => {
                        const href = getChatSourceHref(source.sourcePath);
                        return (
                          <div key={source.id}>
                            {href ? (
                              <Link
                                href={href}
                                onClick={onClose}
                                className="font-medium text-secondary hover:underline"
                              >
                                {source.title}
                              </Link>
                            ) : (
                              <p className="font-medium">{source.title}</p>
                            )}
                            <p className="mt-1 whitespace-pre-wrap break-words leading-relaxed [overflow-wrap:anywhere]">
                              {source.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
              </article>
            ))}
            {pendingQuestion && (
              <article className="ml-8">
                <p className="mb-1 text-right text-[11px] text-text-secondary">
                  Bạn
                </p>
                <div className="whitespace-pre-wrap break-words rounded-2xl bg-primary-light px-3 py-3 text-sm leading-relaxed [overflow-wrap:anywhere]">
                  {pendingQuestion}
                </div>
              </article>
            )}
          </div>
          {isLoading && (
            <p
              role="status"
              className="mt-4 text-xs text-text-secondary motion-safe:animate-pulse"
            >
              Tiệm Len đang tìm thông tin và trả lời bạn...
            </p>
          )}
          {errorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-error/30 bg-surface p-3 text-sm"
            >
              <p className="text-error">{errorMessage}</p>
              <div className="mt-2 flex gap-4 text-xs font-medium text-secondary">
                <button
                  type="button"
                  onClick={() => void submit(pendingQuestion)}
                  className="hover:underline"
                >
                  Thử lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(pendingQuestion);
                    setPendingQuestion("");
                    setErrorMessage("");
                    inputRef.current?.focus();
                  }}
                  className="hover:underline"
                >
                  Sửa câu hỏi
                </button>
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-border bg-surface p-3 pb-[max(12px,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-primary">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void submit(draft);
                }
              }}
              aria-label="Tin nhắn cho Tiệm Len"
              placeholder="Nhập câu hỏi của bạn..."
              maxLength={CHAT_MESSAGE_LIMIT}
              disabled={isLoading}
              rows={2}
              className="max-h-24 min-h-12 min-w-0 flex-1 resize-none bg-transparent px-1 py-1 text-base text-text-primary outline-none placeholder:text-text-secondary disabled:opacity-60 md:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !draft.trim()}
              aria-label="Gửi tin nhắn"
              title="Gửi tin nhắn"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-text-primary transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-text-secondary">
            <span>AI có thể nhầm. Bạn có thể xem nguồn để đối chiếu.</span>
            <span className="shrink-0">
              {draft.length}/{CHAT_MESSAGE_LIMIT}
            </span>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
