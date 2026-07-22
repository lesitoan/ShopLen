"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { SUBJECT_OPTIONS } from "../constants";

interface ContactFormInputs {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      subject: "Tư vấn món quà len handmade",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (_data: ContactFormInputs) => {
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    reset();
  };

  return (
    <div className="w-full border-0 md:border md:border-border rounded-none md:rounded-lg bg-transparent md:bg-surface p-0 md:p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-[16px] md:text-[18px] font-bold text-text-primary border-l-4 border-primary pl-3">
          Gửi tin nhắn cho chúng tôi
        </h2>
        <p className="text-[13px] text-text-secondary pl-3.5">
          Vui lòng để lại thông tin, Tiệm Len Nhà Kiều sẽ phản hồi bạn trong thời gian sớm nhất.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-primary-light/60 border border-primary/40 rounded-lg p-6 flex flex-col items-center text-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 size={36} className="text-secondary" />
          <h3 className="text-[16px] font-bold text-secondary">
            Cảm ơn bạn đã liên hệ!
          </h3>
          <p className="text-[13.5px] text-text-primary leading-relaxed max-w-md">
            Tin nhắn của bạn đã được gửi thành công. Đội ngũ Tiệm Len Nhà Kiều sẽ kiểm tra và phản hồi lại qua SĐT/Email trong vòng 2-4 giờ làm việc.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetForm}
            className="mt-2 text-secondary"
          >
            Gửi thêm lời nhắn khác
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[12.5px] font-semibold text-text-primary">
                Họ và tên <span className="text-secondary">*</span>
              </label>
              <Input
                id="fullName"
                placeholder="Ví dụ: Nguyễn Văn A"
                error={!!errors.fullName}
                {...register("fullName", {
                  required: "Vui lòng nhập họ và tên của bạn",
                  minLength: { value: 2, message: "Họ và tên phải có ít nhất 2 ký tự" },
                  maxLength: { value: 50, message: "Họ và tên không vượt quá 50 ký tự" },
                })}
              />
              {errors.fullName && (
                <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[12.5px] font-semibold text-text-primary">
                Số điện thoại / Zalo <span className="text-secondary">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ví dụ: 0987654321"
                error={!!errors.phone}
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại hoặc Zalo",
                  pattern: {
                    value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                    message: "Số điện thoại không hợp lệ (gồm 10 chữ số, ví dụ: 0987654321)",
                  },
                })}
              />
              {errors.phone && (
                <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[12.5px] font-semibold text-text-primary">
                Địa chỉ email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                error={!!errors.email}
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Địa chỉ email không đúng định dạng",
                  },
                })}
              />
              {errors.email && (
                <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-[12.5px] font-semibold text-text-primary">
                Chủ đề cần hỗ trợ <span className="text-secondary">*</span>
              </label>
              <Controller
                name="subject"
                control={control}
                rules={{ required: "Vui lòng chọn chủ đề cần hỗ trợ" }}
                render={({ field }) => (
                  <Select
                    options={SUBJECT_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.subject}
                    placeholder="Chọn chủ đề cần hỗ trợ"
                  />
                )}
              />
              {errors.subject && (
                <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.subject.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-[12.5px] font-semibold text-text-primary">
              Nội dung lời nhắn <span className="text-secondary">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Nhập nội dung lời nhắn, câu hỏi hoặc mô tả yêu cầu mẫu len bạn muốn làm..."
              {...register("message", {
                required: "Vui lòng nhập nội dung lời nhắn",
                minLength: {
                  value: 10,
                  message: "Nội dung lời nhắn cần ít nhất 10 ký tự để shop tư vấn chính xác",
                },
                maxLength: {
                  value: 1000,
                  message: "Nội dung lời nhắn không vượt quá 1000 ký tự",
                },
              })}
              className={`w-full px-3 py-2 rounded-md border text-[14px] text-text-primary outline-none transition-all duration-200 ease-out resize-y min-h-[100px] ${
                errors.message
                  ? "border-error focus:border-error focus:ring-1 focus:ring-error/20"
                  : "border-border placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface"
              }`}
            />
            {errors.message && (
              <span className="text-[11.5px] text-error font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle size={12} className="shrink-0" />
                {errors.message.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Đang gửi..."
            className="w-full sm:w-fit self-start mt-1"
          >
            <Send size={15} />
            <span>Gửi lời nhắn</span>
          </Button>
        </form>
      )}
    </div>
  );
}
