"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import SocialLoginButtons from "./SocialLoginButtons";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let strength = 0;

    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[^a-zA-Z0-9]/.test(val)) strength++;
    setPasswordStrength(strength);
  };

  const strengthLabels = [
    "Yếu",
    "Yếu",
    "Trung bình",
    "Mạnh",
    "Rất mạnh",
  ];

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-text-main">
          Tạo tài khoản miễn phí 🌱
        </h2>
        <p className="text-text-secondary">
          Bắt đầu hành trình của bạn ngay hôm nay.
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main ml-1">
            Họ và tên
          </label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            className="w-full px-5 py-4 rounded-xl border border-border-green bg-surface-light focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary shadow-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full px-5 py-4 rounded-xl border border-border-green bg-surface-light focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary shadow-sm"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main ml-1">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              onChange={handlePasswordChange}
              className="w-full px-5 py-4 rounded-xl border border-border-green bg-surface-light focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary shadow-sm pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* Strength Indicator */}
          <div className="flex md:gap-2 gap-1 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  i < passwordStrength ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-primary font-bold">
            {strengthLabels[passwordStrength]}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main ml-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full px-5 py-4 rounded-xl border border-border-green bg-surface-light focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary shadow-sm"
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 py-2">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-border-green text-primary focus:ring-primary accent-primary mt-0.5"
          />
          <label className="text-sm text-text-secondary leading-tight">
            Tôi đồng ý với{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Chính sách bảo mật
            </a>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Tạo tài khoản
        </button>

        <SocialLoginButtons />
      </form>

      {/* Bottom Link */}
      <p className="text-center text-sm text-text-secondary">
        Đã có tài khoản?
        <Link
          href="/login"
          className="font-bold text-primary hover:underline ml-1"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
