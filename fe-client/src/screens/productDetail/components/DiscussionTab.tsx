"use client";

import React, { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/Button";
import type { ProductComment, CommentReply } from "../types";
import { INITIAL_COMMENTS, AVATAR_BG_OPTIONS } from "../constants";


export default function DiscussionTab() {
  const [comments, setComments] = useState<ProductComment[]>(INITIAL_COMMENTS);
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // States for new comment input
  const [newCommentText, setNewCommentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // States for reply inputs (keyed by comment ID)
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);
  
  // States for collapsed/expanded replies list (keyed by comment ID)
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({ 3: true });

  // Calculate total comment count (including replies)
  const totalCount = useMemo(() => {
    return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
  }, [comments]);

  // Sort comments based on selected criteria
  const sortedComments = useMemo(() => {
    const cloned = [...comments];
    if (sortBy === "top") {
      return cloned.sort((a, b) => b.likes - a.likes);
    } else {
      return cloned.sort((a, b) => b.id - a.id);
    }
  }, [comments, sortBy]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const randomBg = AVATAR_BG_OPTIONS[Math.floor(Math.random() * AVATAR_BG_OPTIONS.length)];
    const newComment: ProductComment = {
      id: Date.now(),
      author: "Khách hàng (Bạn)",
      avatar: "B",
      avatarBg: randomBg,
      comment: newCommentText.trim(),
      date: "Vừa xong",
      likes: 0,
      isLiked: false,
      isDisliked: false,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
    setIsInputFocused(false);
  };

  const handleAddReply = (commentId: number) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim()) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const newReply: CommentReply = {
            id: Date.now(),
            author: "Khách hàng (Bạn)",
            avatar: "B",
            avatarBg: "bg-pink-100 text-pink-600",
            comment: text.trim(),
            date: "Vừa xong",
            likes: 0,
            isLiked: false,
            isDisliked: false,
          };
          return {
            ...c,
            replies: [...c.replies, newReply],
          };
        }
        return c;
      })
    );

    setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
    setActiveReplyCommentId(null);
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
  };

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const wasLiked = c.isLiked;
          const wasDisliked = c.isDisliked;
          return {
            ...c,
            isLiked: !wasLiked,
            isDisliked: wasLiked ? c.isDisliked : false,
            likes: wasLiked
              ? c.likes - 1
              : wasDisliked
              ? c.likes + 2
              : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  const handleDislikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const wasLiked = c.isLiked;
          const wasDisliked = c.isDisliked;
          return {
            ...c,
            isLiked: wasDisliked ? c.isLiked : false,
            isDisliked: !wasDisliked,
            likes: wasLiked
              ? wasDisliked
                ? c.likes
                : c.likes - 1
              : wasDisliked
              ? c.likes + 1
              : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const handleLikeReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === replyId) {
                const wasLiked = r.isLiked;
                const wasDisliked = r.isDisliked;
                return {
                  ...r,
                  isLiked: !wasLiked,
                  isDisliked: wasLiked ? r.isDisliked : false,
                  likes: wasLiked
                    ? r.likes - 1
                    : wasDisliked
                    ? r.likes + 2
                    : r.likes + 1,
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleDislikeReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === replyId) {
                const wasLiked = r.isLiked;
                const wasDisliked = r.isDisliked;
                return {
                  ...r,
                  isLiked: wasDisliked ? r.isLiked : false,
                  isDisliked: !wasDisliked,
                  likes: wasLiked
                    ? wasDisliked
                      ? r.likes
                      : r.likes - 1
                    : wasDisliked
                    ? r.likes + 1
                    : r.likes - 1,
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const toggleRepliesVisibility = (commentId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="flex flex-col text-left font-sans select-none animate-in fade-in duration-200">
      <div className="flex items-center gap-8 mb-6 pb-2 border-b border-border/60">
        <span className="text-[15px] font-bold text-text-primary">
          {totalCount} thảo luận
        </span>
        <div className="relative flex items-center gap-1 text-[13px] text-text-secondary">
          <span className="font-semibold">Sắp xếp theo:</span>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1 text-text-primary font-bold hover:text-secondary transition-colors py-1 px-1.5 focus:outline-none"
          >
            <span>{sortBy === "top" ? "Hàng đầu" : "Mới nhất"}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isSortOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-20 z-20 mt-1 bg-surface border border-border rounded-md py-1 min-w-[120px] shadow-sm select-none">
                <button
                  onClick={() => {
                    setSortBy("top");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[12.5px] transition-colors font-medium ${
                    sortBy === "top"
                      ? "bg-primary-light text-secondary font-bold"
                      : "text-text-primary hover:bg-primary-light/40"
                  }`}
                >
                  Hàng đầu
                </button>
                <button
                  onClick={() => {
                    setSortBy("newest");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[12.5px] transition-colors font-medium ${
                    sortBy === "newest"
                      ? "bg-primary-light text-secondary font-bold"
                      : "text-text-primary hover:bg-primary-light/40"
                  }`}
                >
                  Mới nhất
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3.5 mb-8">
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-primary text-white font-bold flex items-center justify-center text-[15px]">
          U
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            placeholder="Viết bình luận..."
            rows={isInputFocused ? 2 : 1}
            className="w-full bg-transparent border-b border-border focus:border-text-primary focus:outline-none py-1 text-[13.5px] text-text-primary placeholder-text-secondary resize-none transition-all duration-200"
          />
          {isInputFocused && (
            <div className="flex justify-end gap-2 mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewCommentText("");
                  setIsInputFocused(false);
                }}
                className="px-4 py-1.5 text-xs text-text-secondary hover:bg-primary-light/50 font-bold rounded-full border-none shadow-none"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-none ${
                  !newCommentText.trim()
                    ? "opacity-55 cursor-not-allowed bg-border text-text-secondary border-none"
                    : "bg-secondary text-white hover:bg-secondary/90 border-none"
                }`}
              >
                Bình luận
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {sortedComments.map((comment) => {
          const isRepliesExpanded = !!expandedReplies[comment.id];
          const isReplying = activeReplyCommentId === comment.id;

          return (
            <div key={comment.id} className="flex gap-3.5 group">
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 font-bold flex items-center justify-center text-[15px] ${comment.avatarBg}`}
              >
                {comment.avatar}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-baseline gap-1.5 mb-1">
                  <span className="text-[13.5px] font-bold text-text-primary whitespace-nowrap">
                    {comment.author}
                  </span>
                  <span className="text-[11px] text-text-secondary/70 whitespace-nowrap">
                    {comment.date}
                  </span>
                </div>

                <p className="text-[13px] text-text-primary leading-relaxed mb-2">
                  {comment.comment}
                </p>

                <div className="flex items-center gap-4 text-text-secondary mb-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 hover:text-text-primary transition-colors py-1 ${
                      comment.isLiked ? "text-secondary font-semibold" : ""
                    }`}
                  >
                    <ThumbsUp size={13} className={comment.isLiked ? "fill-secondary/10" : ""} />
                    <span className="text-[11px]">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislikeComment(comment.id)}
                    className={`hover:text-text-primary transition-colors py-1 ${
                      comment.isDisliked ? "text-secondary" : ""
                    }`}
                  >
                    <ThumbsDown size={13} className={comment.isDisliked ? "fill-secondary/10" : ""} />
                  </button>

                  <button
                    onClick={() => setActiveReplyCommentId(isReplying ? null : comment.id)}
                    className="text-[11.5px] hover:text-text-primary font-bold transition-colors py-1 px-2.5 rounded-full hover:bg-primary-light/50 font-sans"
                  >
                    Phản hồi
                  </button>
                </div>

                {isReplying && (
                  <div className="flex gap-2.5 mt-3 pl-2 border-l border-border/85 pb-2">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-primary text-white font-bold flex items-center justify-center text-[13px]">
                      U
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={replyTexts[comment.id] || ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))
                        }
                        placeholder="Phản hồi bình luận này..."
                        className="w-full bg-transparent border-b border-border focus:border-text-primary focus:outline-none py-1 text-[13px] text-text-primary placeholder-text-secondary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddReply(comment.id);
                        }}
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveReplyCommentId(null)}
                          className="px-3 py-1 text-[11px] text-text-secondary hover:bg-primary-light/50 font-bold rounded-full border-none shadow-none"
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!(replyTexts[comment.id] || "").trim()}
                          className={`px-3 py-1 text-[11px] font-bold rounded-full shadow-none ${
                            !(replyTexts[comment.id] || "").trim()
                              ? "opacity-55 cursor-not-allowed bg-border text-text-secondary border-none"
                              : "bg-secondary text-white hover:bg-secondary/90 border-none"
                          }`}
                        >
                          Phản hồi
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <div className="mt-1">
                    <button
                      onClick={() => toggleRepliesVisibility(comment.id)}
                      className="text-secondary font-bold text-[12px] hover:bg-primary-light/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max transition-all"
                    >
                      {isRepliesExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          <span>Ẩn phản hồi</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>Xem {comment.replies.length} phản hồi</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {comment.replies.length > 0 && isRepliesExpanded && (
                  <div className="mt-3 pl-3 md:pl-6 space-y-4 border-l md:border-l-2 border-border/40 ml-2 md:ml-5">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 font-bold flex items-center justify-center text-[13px] ${reply.avatarBg}`}
                        >
                          {reply.avatar}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-wrap items-baseline gap-1.5 mb-1">
                            <span className="text-[12px] md:text-[12.5px] font-bold text-text-primary whitespace-nowrap">
                              {reply.author}
                            </span>
                            {reply.author === "Tiệm Len Nhà Kiều" && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-primary-light text-secondary font-bold rounded border border-primary/20 font-sans whitespace-nowrap">
                                Tác giả
                              </span>
                            )}
                            <span className="text-[10px] text-text-secondary/70 whitespace-nowrap">
                              {reply.date}
                            </span>
                          </div>
                          <p className="text-[13px] text-text-primary leading-relaxed mb-2">
                            {reply.comment}
                          </p>
                          <div className="flex items-center gap-3 text-text-secondary">
                            <button
                              onClick={() => handleLikeReply(comment.id, reply.id)}
                              className={`flex items-center gap-1 hover:text-text-primary transition-colors py-0.5 ${
                                reply.isLiked ? "text-secondary font-semibold" : ""
                              }`}
                            >
                              <ThumbsUp size={11} className={reply.isLiked ? "fill-secondary/10" : ""} />
                              <span className="text-[10px]">{reply.likes}</span>
                            </button>
                            <button
                              onClick={() => handleDislikeReply(comment.id, reply.id)}
                              className={`hover:text-text-primary transition-colors py-0.5 ${
                                reply.isDisliked ? "text-secondary" : ""
                              }`}
                            >
                              <ThumbsDown size={11} className={reply.isDisliked ? "fill-secondary/10" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
