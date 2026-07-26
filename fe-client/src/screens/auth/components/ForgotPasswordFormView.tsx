import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyPasswordOtpMutation,
} from "@/services/api/authApi";
import { getApiErrorMessage } from "@/utils/apiErrorUtils";
import { toast } from "react-toastify";
import type {
  AuthViewMode,
  ForgotPasswordEmailFormData,
  ForgotPasswordResetFormData,
} from "@/types/auth.type";

interface ForgotPasswordFormViewProps {
  onSwitchView: (mode: AuthViewMode) => void;
}

type ForgotPasswordStep = 1 | 2 | 3;

export default function ForgotPasswordFormView({
  onSwitchView,
}: ForgotPasswordFormViewProps) {
  const [step, setStep] = useState<ForgotPasswordStep>(1);
  const [sentEmail, setSentEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpError, setOtpError] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();
  const [verifyPasswordOtp, { isLoading: isVerifying }] =
    useVerifyPasswordOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordEmailFormData>({
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    getValues,
    formState: { errors: resetErrors },
  } = useForm<ForgotPasswordResetFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const fullOtp = otpDigits.join("");

  const onEmailSubmit = async (data: ForgotPasswordEmailFormData) => {
    setApiError(null);
    setOtpError("");
    setDevOtp(null);

    try {
      const response = await forgotPassword(data).unwrap();
      setSentEmail(data.email);
      setDevOtp(response.devOtp ?? null);
      setOtpDigits(Array(6).fill(""));
      setVerifiedOtp("");
      setStep(2);
      toast.success("Đã gửi mã OTP về email.");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Không thể gửi mã OTP, vui lòng thử lại.",
      );
      setApiError(message);
      toast.error(message);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    setOtpError("");
    setApiError(null);

    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    if (val && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const onVerifyOtp = async () => {
    if (fullOtp.length < 6) {
      const message = "Vui lòng nhập đủ 6 chữ số mã xác nhận";
      setOtpError(message);
      toast.error(message);
      return;
    }

    setApiError(null);
    setOtpError("");

    try {
      await verifyPasswordOtp({
        email: sentEmail,
        otpCode: fullOtp,
      }).unwrap();
      setVerifiedOtp(fullOtp);
      setStep(3);
      toast.success("Xác minh OTP thành công.");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Mã OTP không hợp lệ, vui lòng thử lại.",
      );
      setApiError(message);
      toast.error(message);
    }
  };

  const onResetSubmit = async (data: ForgotPasswordResetFormData) => {
    setApiError(null);

    try {
      await resetPassword({
        email: sentEmail,
        otpCode: verifiedOtp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      setIsSuccess(true);
      toast.success("Khôi phục mật khẩu thành công.");
      window.setTimeout(() => onSwitchView("LOGIN"), 1500);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Không thể đổi mật khẩu, vui lòng thử lại.",
      );
      setApiError(message);
      toast.error(message);
    }
  };

  const handleBack = () => {
    setApiError(null);
    setOtpError("");

    if (step === 3) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    onSwitchView("LOGIN");
  };

  return (
    <div className="flex flex-col gap-5 w-full text-left animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface transition-colors flex items-center gap-1 text-[13px] font-medium"
        >
          <ChevronLeft size={18} />
          <span>{step === 1 ? "Quay lại đăng nhập" : "Quay lại"}</span>
        </button>

        <Link
          href="/"
          className="text-[12.5px] font-semibold text-text-secondary hover:text-secondary transition-colors"
        >
          Bỏ qua
        </Link>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-text-primary">
          Khôi phục mật khẩu
        </h2>
        <p className="text-[12.5px] text-text-secondary mt-1">
          {step === 1
            ? "Nhập email đã đăng ký để nhận mã OTP khôi phục 6 số"
            : step === 2
              ? `Đã gửi mã xác nhận 6 số về email: ${sentEmail}`
              : "Nhập mật khẩu mới cho tài khoản của bạn"}
        </p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <CheckCircle2 size={44} className="text-emerald-500" />
          <h3 className="text-[16px] font-bold text-text-primary">
            Khôi phục mật khẩu thành công!
          </h3>
          <p className="text-[12.5px] text-text-secondary">
            Đang chuyển hướng sang màn hình đăng nhập...
          </p>
        </div>
      ) : null}

      {!isSuccess && step === 1 ? (
        <form
          onSubmit={handleSubmitEmail(onEmailSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Địa chỉ email đăng ký
            </label>
            <Input
              {...registerEmail("email", {
                required: "Vui lòng nhập địa chỉ email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              type="email"
              placeholder="Nhập email của bạn"
              error={!!emailErrors.email}
              leftIcon={<Mail size={16} />}
            />
            {emailErrors.email ? (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{emailErrors.email.message}</span>
              </div>
            ) : null}
          </div>

          {apiError ? (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{apiError}</span>
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSending}
            loadingText="Đang gửi mã..."
            className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
          >
            Gửi mã 6 số về email
          </Button>
        </form>
      ) : null}

      {!isSuccess && step === 2 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-text-primary flex items-center justify-between">
              <span>Mã xác thực OTP (6 chữ số)</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11.5px] font-semibold text-secondary hover:underline"
              >
                Gửi lại mã
              </button>
            </label>

            <div className="flex justify-between gap-2 my-1">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  className="w-11 h-12 text-center text-[18px] font-bold text-text-primary bg-surface border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>

            {devOtp ? (
              <p className="text-[11.5px] text-text-secondary">
                Mã test dev: {devOtp}
              </p>
            ) : null}

            {otpError || apiError ? (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{otpError || apiError}</span>
              </div>
            ) : null}
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isVerifying}
            loadingText="Đang xác minh..."
            className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
            onClick={onVerifyOtp}
          >
            Xác minh OTP
          </Button>
        </div>
      ) : null}

      {!isSuccess && step === 3 ? (
        <form
          onSubmit={handleSubmitReset(onResetSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Mật khẩu mới
            </label>
            <Input
              {...registerReset("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu mới phải có ít nhất 6 ký tự",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              error={!!resetErrors.newPassword}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none p-1"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            {resetErrors.newPassword ? (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{resetErrors.newPassword.message}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-primary">
              Xác nhận mật khẩu mới
            </label>
            <Input
              {...registerReset("confirmPassword", {
                required: "Vui lòng nhập lại mật khẩu mới",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Mật khẩu xác nhận không trùng khớp",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              error={!!resetErrors.confirmPassword}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none p-1"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            {resetErrors.confirmPassword ? (
              <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
                <AlertCircle size={13} />
                <span>{resetErrors.confirmPassword.message}</span>
              </div>
            ) : null}
          </div>

          {apiError ? (
            <div className="flex items-center gap-1 text-[11.5px] text-error font-medium">
              <AlertCircle size={13} />
              <span>{apiError}</span>
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isResetting}
            loadingText="Đang xử lý..."
            className="w-full py-3 text-[14px] font-bold rounded-xl justify-center mt-2"
          >
            Khôi phục mật khẩu
          </Button>
        </form>
      ) : null}
    </div>
  );
}
