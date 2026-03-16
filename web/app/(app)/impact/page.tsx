"use client";

import React, { useState } from "react";
import { TrendingUp, Leaf, Globe, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const kpiCards = [
  { icon: "🍱", label: "Món đã chia sẻ", value: "18", color: "bg-primary/10 text-primary" },
  { icon: "♻️", label: "Thực phẩm đã cứu", value: "47.5 kg", color: "bg-green-50 text-green-700" },
  { icon: "🌍", label: "CO₂ đã giảm", value: "106 kg", color: "bg-blue-50 text-blue-700" },
  { icon: "🏅", label: "Level hiện tại", value: "Người bảo vệ", color: "bg-yellow-50 text-yellow-700" },
];

const monthlyData = [
  { month: "T8", value: 12 },
  { month: "T9", value: 18 },
  { month: "T10", value: 25 },
  { month: "T11", value: 15 },
  { month: "T12", value: 30 },
  { month: "T1", value: 22 },
];

const achievements = [
  { icon: "🌱", label: "Bước đầu tiên", unlocked: true },
  { icon: "🌿", label: "Người chia sẻ", unlocked: true },
  { icon: "🌳", label: "Người bảo vệ", unlocked: true },
  { icon: "⭐", label: "Người tiên phong", unlocked: false },
  { icon: "💎", label: "Huyền thoại", unlocked: false },
];

export default function ImpactPage() {
  const [timeframe, setTimeframe] = useState("month");

  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-main">Tác động của tôi 🌱</h1>
        <div className="flex bg-surface rounded-xl p-1">
          {["week", "month", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeframe === t ? "bg-white text-primary shadow-sm" : "text-text-secondary"
              }`}
            >
              {t === "week" ? "Tuần" : t === "month" ? "Tháng" : "Tất cả"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-border-green shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-2xl mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-text-main">{card.value}</p>
            <p className="text-sm text-text-secondary mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-border-green shadow-sm mb-8">
        <h2 className="text-lg font-bold text-text-main mb-6">Hoạt động theo tháng</h2>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-text-main">{d.value}</span>
              <div
                className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-text-secondary font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-2xl p-6 border border-border-green shadow-sm mb-8">
        <h2 className="text-lg font-bold text-text-main mb-4">Hành trình của bạn</h2>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm font-semibold text-primary">Người bảo vệ</span>
          <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "70%" }} />
          </div>
          <span className="text-sm font-semibold text-text-secondary">Người tiên phong</span>
        </div>
        <p className="text-xs text-text-secondary">Cần thêm 5 lần chia sẻ để lên cấp tiếp theo</p>

        {/* Achievement badges */}
        <div className="flex gap-4 mt-6">
          {achievements.map((a) => (
            <div
              key={a.label}
              className={`flex flex-col items-center gap-2 ${a.unlocked ? "" : "opacity-40"}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                a.unlocked ? "bg-primary/10 border-2 border-primary" : "bg-gray-100 border-2 border-gray-200"
              }`}>
                {a.icon}
              </div>
              <span className="text-[10px] font-semibold text-text-main text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link href="/create-post" className="block">
        <div className="bg-primary rounded-2xl p-6 text-white flex items-center justify-between hover:bg-primary/90 transition-colors">
          <div>
            <h3 className="text-xl font-bold mb-1">Tiếp tục hành trình xanh!</h3>
            <p className="text-white/80 text-sm">Chia sẻ thêm để lên cấp và nhận huy hiệu mới</p>
          </div>
          <ArrowRight size={24} />
        </div>
      </Link>
    </div>
  );
}
