"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import SocialLoginButtons from "./SocialLoginButtons";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex md:hidden items-center gap-2 mb-4">
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold tracking-tight text-primary">
            GreenShare
          </span>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Chào mừng trở lại 👋
          </h2>
          <p className="text-text-secondary">
            Vui lòng đăng nhập vào tài khoản của bạn
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5">
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
              placeholder="Nhập mật khẩu của bạn"
              className="w-full px-5 py-4 rounded-xl border border-border-green bg-surface-light focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary shadow-sm"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-primary hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]"
        >
          Đăng nhập
        </button>

        <SocialLoginButtons />
      </form>

      {/* Bottom Link */}
      <p className="text-center text-text-secondary">
        Chưa có tài khoản?
        <Link
          href="/register"
          className="font-bold text-primary hover:underline ml-1"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
