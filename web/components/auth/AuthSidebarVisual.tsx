"use client";

import React from "react";
import { Heart } from "lucide-react";

const AuthSidebarVisual: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-primary relative flex-col items-center justify-center p-12 text-white overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="mb-12 w-full aspect-square max-w-[280px] rounded-2xl bg-white/10 flex items-center justify-center">
          <Heart size={80} className="text-white/80" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-6">
          Mỗi bữa ăn chia sẻ là một hành động vì cộng đồng
        </h1>
        <p className="text-white/80 text-lg">
          Cùng GreenShare giảm thiểu lãng phí thực phẩm và mang đến niềm vui
          cho mọi người.
        </p>
      </div>

      {/* Logo on visual side */}
      <div className="absolute top-10 left-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary">
          <span className="text-lg font-bold">🌱</span>
        </div>
        <span className="text-xl font-bold tracking-tight">GreenShare</span>
      </div>
    </div>
  );
};

export default AuthSidebarVisual;
