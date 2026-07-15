import React, { useRef, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import Button from "./Button";

interface UploadFileProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function UploadFile({
  onFileSelect,
  accept = "image/png, image/jpeg",
  maxSizeMB = 5,
  className = "",
}: UploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`Tệp tin vượt quá dung lượng cho phép (${maxSizeMB}MB)`);
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
          isDragOver
            ? "border-primary bg-primary-light/50"
            : selectedFile
            ? "border-success/40 bg-success/5"
            : "border-border hover:border-primary/50"
        }`}
        onClick={handleButtonClick}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-success/10 text-success rounded-full mb-3">
              <File size={28} />
            </div>
            <p className="text-[13px] font-semibold text-text-primary mb-1 max-w-[200px] truncate">
              {selectedFile.name}
            </p>
            <p className="text-[11px] text-text-secondary mb-3">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="text-error border-error/30 hover:bg-error/10 hover:border-error active:bg-error/20 flex items-center gap-1.5 py-1"
            >
              <X size={12} />
              <span>Gỡ bỏ</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-background text-text-secondary/70 rounded-full mb-3">
              <UploadCloud size={28} />
            </div>
            <p className="text-[13px] text-text-primary font-medium mb-1">
              Kéo & thả ảnh vào đây hoặc
            </p>
            <span className="text-secondary font-semibold text-[13px] hover:underline mb-3">
              Chọn ảnh từ thiết bị
            </span>
            <p className="text-[11px] text-text-secondary/80">
              Định dạng JPG, PNG. Dung lượng tối đa {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
