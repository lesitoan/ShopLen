import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SocialLoginOptions from "./SocialLoginOptions";
import { AuthViewMode } from "@/types/auth.type";

interface AuthLandingViewProps {
  onSwitchView: (mode: AuthViewMode) => void;
}

export default function AuthLandingView({ onSwitchView }: AuthLandingViewProps) {
  return (
    <div className="flex flex-col gap-6 w-full text-left animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-text-primary">
          Chào mừng bạn
        </h2>
        <Link
          href="/"
          className="text-[12.5px] font-semibold text-text-secondary hover:text-secondary transition-colors"
        >
          Bỏ qua
        </Link>
      </div>

      <p className="text-[13.5px] text-text-secondary -mt-3">
        Khám phá thế giới móc khóa len thủ công xinh xắn và trải nghiệm mua sắm tiện lợi tại Tiệm Len Nhà Kiều.
      </p>

      <div className="flex flex-col gap-3 mt-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => onSwitchView("REGISTER")}
          className="w-full py-3 text-[14px] font-bold rounded-xl justify-center"
        >
          Đăng ký
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => onSwitchView("LOGIN")}
          className="w-full py-3 text-[14px] font-bold rounded-xl justify-center"
        >
          Đăng nhập
        </Button>
      </div>

      <SocialLoginOptions />
    </div>
  );
}
