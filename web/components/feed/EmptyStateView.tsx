"use client";

import React from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const EmptyStateView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 blur-3xl" />
        <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-border-green">
          <div className="w-32 h-32 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-6xl">🧺</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-text-main text-3xl font-extrabold tracking-tight">
          Chưa có món ăn nào gần bạn
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-md mx-auto">
          Hãy là người đầu tiên chia sẻ một món ăn tại khu vực của bạn để xây
          dựng cộng đồng nhé!
        </p>
      </div>

      <Link
        href="/post/create"
        className="group flex items-center justify-center gap-3 min-w-[280px] bg-primary hover:bg-primary/90 text-white rounded-xl h-14 px-8 text-lg font-bold transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
      >
        <PlusCircle
          size={22}
          className="group-hover:rotate-90 transition-transform"
        />
        <span>Đăng món đầu tiên</span>
      </Link>

      <button className="mt-6 text-primary hover:text-primary/80 font-semibold text-base underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">
        Mở rộng phạm vi tìm kiếm
      </button>
    </div>
  );
};

export default EmptyStateView;
