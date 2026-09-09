"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useUploadImageMutation } from "@/services/api/uploadApi";
import { toast } from "react-toastify";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  Image as ImageIcon,
  UploadCloud,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  FileCode,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";

// Extend TipTap's Image extension to support Microsoft Word style alignment & sizing
const CustomImage = Image.extend({
  name: "image",
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
      size: {
        default: "md",
        parseHTML: (element) => element.getAttribute("data-size") || "md",
        renderHTML: (attributes) => ({
          "data-size": attributes.size,
        }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes["data-align"] || "center";
    const size = HTMLAttributes["data-size"] || "md";

    let alignClass = "mx-auto block";
    let widthStyle = "max-width: 480px; width: 100%;";
    let sizeClass = "max-w-[480px] w-full";

    if (size === "sm") {
      sizeClass = "max-w-[240px] w-full";
      widthStyle = "max-width: 240px; width: 100%;";
    } else if (size === "lg") {
      sizeClass = "max-w-[720px] w-full";
      widthStyle = "max-width: 720px; width: 100%;";
    } else if (size === "full") {
      sizeClass = "w-full block";
      widthStyle = "max-width: 100%; width: 100%; display: block;";
    }

    let inlineStyle = "";
    if (align === "left") {
      alignClass = "float-left mr-4 mb-3 clear-left";
      inlineStyle = `float: left; margin: 8px 18px 14px 0; clear: left; height: auto; border-radius: 8px; ${widthStyle}`;
    } else if (align === "right") {
      alignClass = "float-right ml-4 mb-3 clear-right";
      inlineStyle = `float: right; margin: 8px 0 14px 18px; clear: right; height: auto; border-radius: 8px; ${widthStyle}`;
    } else {
      alignClass = "mx-auto block clear-both";
      inlineStyle = `display: block; margin: 18px auto; float: none; clear: both; height: auto; border-radius: 8px; ${widthStyle}`;
    }

    return [
      "img",
      {
        ...HTMLAttributes,
        style: `${HTMLAttributes.style || ""} ${inlineStyle}`.trim(),
        class: `rounded-lg border border-border shadow-md my-3 transition-all cursor-pointer hover:ring-2 hover:ring-primary ${alignClass} ${sizeClass}`,
      },
    ];
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung bài viết hấp dẫn tại đây...",
  className = "",
}: TipTapEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(content);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage] = useUploadImageMutation();

  // Helper to upload file via API and insert into editor
  const handleUploadAndInsert = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn định dạng hình ảnh hợp lệ (PNG, JPG, WEBP).");
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading("Đang tải hình ảnh lên máy chủ...");

      try {
        const response = await uploadImage({
          file,
          target: "BLOG",
        }).unwrap();

        if (response?.url) {
          editorRef.current
            ?.chain()
            .focus()
            .setImage({
              src: response.url,
              alt: file.name.replace(/\.[^/.]+$/, ""),
              align: "center",
              size: "md",
            } as any)
            .run();

          toast.update(toastId, {
            render: "Tải ảnh lên thành công!",
            type: "success",
            isLoading: false,
            autoClose: 2500,
          });
        }
      } catch (error: any) {
        // Fallback to local FileReader if backend API is not responding
        const reader = new FileReader();
        reader.onload = (e) => {
          const localUrl = e.target?.result as string;
          if (localUrl) {
            editorRef.current
              ?.chain()
              .focus()
              .setImage({
                src: localUrl,
                alt: file.name.replace(/\.[^/.]+$/, ""),
                align: "center",
                size: "md",
              } as any)
              .run();
          }
        };
        reader.readAsDataURL(file);

        toast.update(toastId, {
          render: "Đã chèn ảnh vào bài viết.",
          type: "info",
          isLoading: false,
          autoClose: 2500,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [uploadImage]
  );

  const editorRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline font-medium hover:text-primary-hover transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CustomImage.configure({
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-hidden min-h-[280px] p-4 text-xs sm:text-sm text-text-primary leading-relaxed prose prose-invert max-w-none clearfix after:content-[''] after:table after:clear-both [&>h1]:text-2xl [&>h1]:font-extrabold [&>h1]:text-text-highlight [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-text-highlight [&>h3]:mt-4 [&>h3]:mb-1.5 [&>p]:mb-2.5 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:italic [&>blockquote]:text-text-secondary [&>blockquote]:bg-surface-muted/30 [&>blockquote]:rounded-r-md [&>pre]:bg-surface-deep [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>code]:text-emerald-300 [&>hr]:border-border [&>hr]:my-4",
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleUploadAndInsert(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files[0]
        ) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleUploadAndInsert(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setRawHtml(html);
    },
  });

  editorRef.current = editor;

  // Keep editor content in sync when initial content changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content, { emitUpdate: false });
      setRawHtml(content);
    }
  }, [content, editor]);

  // Handle switching from raw HTML mode back to visual editor
  const handleToggleHtmlMode = () => {
    if (isHtmlMode) {
      if (editor) {
        editor.commands.setContent(rawHtml, { emitUpdate: true });
        onChange(rawHtml);
      }
      setIsHtmlMode(false);
    } else {
      setRawHtml(editor ? editor.getHTML() : content);
      setIsHtmlMode(true);
    }
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawHtml(val);
    onChange(val);
  };

  // Custom link insertion dialog
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập địa chỉ liên kết (URL):", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  // Trigger computer file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadAndInsert(file);
    }
    // reset input value so same file can be picked again
    e.target.value = "";
  };

  // Image manipulation helpers for selected image
  const isImageActive = editor?.isActive("image") ?? false;
  const currentImageAttrs = editor?.getAttributes("image") ?? {};
  const currentImageAlign = currentImageAttrs.align || "center";
  const currentImageSize = currentImageAttrs.size || "md";

  const setImageAlign = (align: "left" | "center" | "right") => {
    if (!editor) return;
    editor.chain().focus().updateAttributes("image", { align }).run();
  };

  const setImageSize = (size: "sm" | "md" | "lg" | "full") => {
    if (!editor) return;
    editor.chain().focus().updateAttributes("image", { size }).run();
  };

  const editImageAlt = () => {
    if (!editor) return;
    const currentAlt = currentImageAttrs.alt || "";
    const newAlt = window.prompt("Nhập mô tả hình ảnh (Alt text chuẩn SEO):", currentAlt);
    if (newAlt !== null) {
      editor.chain().focus().updateAttributes("image", { alt: newAlt }).run();
    }
  };

  const deleteActiveImage = () => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!editor) return { words: 0, characters: 0, readTime: 1 };
    const text = editor.getText();
    const characters = text.length;
    const words = text.trim() ? (text.match(/\S+/g) || []).length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, characters, readTime };
  }, [editor, content, rawHtml]);

  if (!editor) {
    return (
      <div className="border border-border rounded-lg p-6 bg-bg-mid text-center text-text-muted text-xs">
        Đang tải trình soạn thảo TipTap...
      </div>
    );
  }

  return (
    <div
      className={`border border-border rounded-lg bg-bg-mid flex flex-col shadow-xs transition-all ${
        isFullScreen
          ? "fixed inset-4 z-50 bg-surface shadow-2xl overflow-hidden"
          : "relative"
      } ${className}`}
    >
      {/* Hidden file input for uploading images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Main Sticky Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-surface-muted/60 text-text-secondary select-none sticky top-0 z-10">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-surface-hover hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Hoàn tác (Ctrl+Z)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-surface-hover hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Làm lại (Ctrl+Y)"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-border/80 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            editor.isActive("paragraph")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Đoạn văn bản thường"
        >
          <Pilcrow className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-1.5 rounded text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 1 })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Tiêu đề H1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 rounded text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Tiêu đề H2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-1.5 rounded text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Tiêu đề H3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-border/80 mx-1" />

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("underline")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("strike")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Gạch ngang chữ"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("highlight")
              ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Đánh dấu highlight màu vàng"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("code")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Mã nội dòng (Inline Code)"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-border/80 mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "left" })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Căn trái đoạn văn"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "center" })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Căn giữa đoạn văn"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "right" })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Căn phải đoạn văn"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Căn đều hai bên"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-border/80 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Danh sách dấu chấm"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Đoạn trích dẫn"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
          title="Đường phân cách ngang"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-border/80 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-surface text-primary shadow-xs"
              : "hover:bg-surface-hover hover:text-text-primary"
          }`}
          title="Chèn liên kết URL"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded hover:bg-surface-hover text-status-danger transition-colors cursor-pointer"
            title="Gỡ liên kết"
          >
            <Unlink className="w-3.5 h-3.5" />
          </button>
        )}

        {/* UPLOAD IMAGE BUTTONS (Từ máy tính & Từ URL) */}
        <button
          type="button"
          disabled={isUploading}
          onClick={triggerFileUpload}
          className="px-2 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Tải hình ảnh từ máy tính (lên server POST /admin/upload/images?target=BLOG)"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5" />
          )}
          <span>Tải ảnh từ máy</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="p-1.5 rounded hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
          title="Xóa toàn bộ định dạng vùng chọn"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* Extra toggles right-aligned */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleHtmlMode}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isHtmlMode
                ? "bg-primary/20 text-primary border border-primary/30"
                : "hover:bg-surface-hover hover:text-text-primary"
            }`}
            title="Chuyển đổi xem mã nguồn HTML"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
            title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullScreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* SECONDARY TOOLBAR: Word-like Image Alignment & Sizing Panel when image is selected */}
      {isImageActive && (
        <div className="flex flex-wrap items-center gap-2.5 px-3.5 py-2 bg-[#1c233a] border-b border-primary/50 text-xs text-text-primary select-none animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 font-bold text-primary mr-1 shrink-0">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Căn chỉnh ảnh:</span>
          </div>

          {/* Vị trí căn lề (Align) */}
          <div className="flex items-center rounded-md border border-border p-0.5 bg-bg-mid shrink-0">
            <button
              type="button"
              onClick={() => setImageAlign("left")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                currentImageAlign === "left"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Căn trái (chữ ôm quanh ảnh như Word)"
            >
              <AlignLeft className="w-3 h-3" />
              <span>Trái</span>
            </button>

            <button
              type="button"
              onClick={() => setImageAlign("center")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                currentImageAlign === "center"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Căn giữa (ảnh đứng độc lập giữa trang)"
            >
              <AlignCenter className="w-3 h-3" />
              <span>Giữa</span>
            </button>

            <button
              type="button"
              onClick={() => setImageAlign("right")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                currentImageAlign === "right"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Căn phải (chữ ôm quanh ảnh như Word)"
            >
              <AlignRight className="w-3 h-3" />
              <span>Phải</span>
            </button>
          </div>

          {/* Kích cỡ (Size) */}
          <div className="flex items-center rounded-md border border-border p-0.5 bg-bg-mid shrink-0">
            <button
              type="button"
              onClick={() => setImageSize("sm")}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                currentImageSize === "sm"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Kích thước nhỏ (25%)"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => setImageSize("md")}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                currentImageSize === "md"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Kích thước vừa (50%)"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setImageSize("lg")}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                currentImageSize === "lg"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Kích thước lớn (75%)"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => setImageSize("full")}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                currentImageSize === "full"
                  ? "bg-primary text-bg-deep font-bold shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Toàn chiều ngang (100%)"
            >
              100%
            </button>
          </div>

          {/* Sửa mô tả Alt */}
          <button
            type="button"
            onClick={editImageAlt}
            className="px-2.5 py-1 rounded-md bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border text-[11px] transition-colors cursor-pointer shrink-0"
            title="Sửa thẻ Alt mô tả ảnh chuẩn SEO"
          >
            Sửa mô tả Alt
          </button>

          {/* Xóa ảnh */}
          <button
            type="button"
            onClick={deleteActiveImage}
            className="ml-auto px-2.5 py-1 rounded-md bg-status-danger/15 hover:bg-status-danger/25 text-status-danger border border-status-danger/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Xóa hình ảnh này khỏi bài viết"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa ảnh</span>
          </button>
        </div>
      )}

      {/* Editor Body with Drag/Drop Support */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border ${
          isFullScreen
            ? "h-[calc(100%-80px)] p-6 sm:p-10 max-w-4xl mx-auto w-full"
            : ""
        }`}
      >
        {isHtmlMode ? (
          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            placeholder="<div>Nhập mã HTML tùy chỉnh tại đây...</div>"
            className="w-full h-full min-h-[300px] bg-bg-deep p-4 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-hidden resize-y"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-t border-border bg-surface-muted/50 text-[11px] text-text-muted select-none">
        <div className="flex items-center gap-3">
          <span>
            Từ: <strong className="text-text-primary">{stats.words}</strong>
          </span>
          <span>•</span>
          <span>
            Ký tự:{" "}
            <strong className="text-text-primary">{stats.characters}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-text-muted">
            Hỗ trợ kéo thả ảnh hoặc dán ảnh (Ctrl+V) trực tiếp
          </span>
        </div>

        <div className="flex items-center gap-1 text-text-secondary">
          <Clock className="w-3 h-3 text-text-muted" />
          <span>Thời gian đọc: ~{stats.readTime} phút</span>
        </div>
      </div>
    </div>
  );
}
