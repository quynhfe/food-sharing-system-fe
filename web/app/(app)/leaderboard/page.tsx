"use client";

import React, { useState } from "react";
import { Trophy, Medal, Star } from "lucide-react";

const topUsers = [
  { rank: 1, name: "Trần Minh Khoa", kg: 152, meals: 68, level: "Huyền thoại", score: 99, avatar: "🥇" },
  { rank: 2, name: "Nguyễn Thị Hạnh", kg: 134, meals: 55, level: "Tiên phong", score: 97, avatar: "🥈" },
  { rank: 3, name: "Lê Hoàng Nam", kg: 98, meals: 42, level: "Tiên phong", score: 95, avatar: "🥉" },
];

const rankings = [
  { rank: 4, name: "Phạm Thu Hà", kg: 87, meals: 38, level: "Bảo vệ", score: 92 },
  { rank: 5, name: "Võ Đình Trung", kg: 76, meals: 31, level: "Bảo vệ", score: 90 },
  { rank: 6, name: "Đặng Minh Anh", kg: 65, meals: 25, level: "Chia sẻ", score: 88, isCurrentUser: true },
  { rank: 7, name: "Bùi Thanh Tùng", kg: 54, meals: 22, level: "Chia sẻ", score: 85 },
  { rank: 8, name: "Hoàng Ngọc Trâm", kg: 48, meals: 19, level: "Chia sẻ", score: 83 },
  { rank: 9, name: "Lý Quốc Việt", kg: 42, meals: 16, level: "Bước đầu", score: 80 },
  { rank: 10, name: "Mai Thị Xuân", kg: 38, meals: 14, level: "Bước đầu", score: 78 },
];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("month");

  return (
    <div className="max-w-[900px] mx-auto">
      <h1 className="text-3xl font-bold text-text-main mb-2">Bảng xếp hạng ⭐</h1>
      <p className="text-text-secondary mb-8">Những người chia sẻ tích cực nhất trong cộng đồng</p>

      {/* Timeframe filter */}
      <div className="flex gap-2 mb-8">
        {[{ label: "Tuần này", value: "week" }, { label: "Tháng này", value: "month" }, { label: "Toàn thời gian", value: "all" }].map((t) => (
          <button
            key={t.value}
            onClick={() => setTimeframe(t.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              timeframe === t.value ? "bg-primary text-white" : "bg-white text-text-secondary border border-border-green hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-10">
        {/* 2nd place */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-2 border-gray-300 mb-2">
            {topUsers[1].avatar}
          </div>
          <p className="font-bold text-sm text-text-main">{topUsers[1].name}</p>
          <p className="text-xs text-text-secondary">{topUsers[1].kg} kg đã cứu</p>
          <div className="w-24 h-20 bg-gray-200 rounded-t-xl mt-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">2</span>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">👑</div>
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center text-4xl border-3 border-yellow-400 mb-2">
            {topUsers[0].avatar}
          </div>
          <p className="font-bold text-text-main">{topUsers[0].name}</p>
          <p className="text-xs text-text-secondary">{topUsers[0].kg} kg đã cứu</p>
          <div className="w-28 h-28 bg-primary/10 rounded-t-xl mt-3 flex items-center justify-center border-2 border-primary/20">
            <span className="text-3xl font-bold text-primary">1</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-2xl border-2 border-orange-300 mb-2">
            {topUsers[2].avatar}
          </div>
          <p className="font-bold text-sm text-text-main">{topUsers[2].name}</p>
          <p className="text-xs text-text-secondary">{topUsers[2].kg} kg đã cứu</p>
          <div className="w-20 h-16 bg-orange-100 rounded-t-xl mt-3 flex items-center justify-center">
            <span className="text-xl font-bold text-orange-600">3</span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-2xl border border-border-green overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-green bg-surface">
              <th className="py-3 px-4 text-left text-xs font-bold text-text-secondary">#</th>
              <th className="py-3 px-4 text-left text-xs font-bold text-text-secondary">Người dùng</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-text-secondary">Kg đã cứu</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-text-secondary">Số món</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-text-secondary">Level</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-text-secondary">Score</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((user) => (
              <tr
                key={user.rank}
                className={`border-b border-border-green/50 hover:bg-surface transition-colors ${
                  (user as any).isCurrentUser ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
              >
                <td className="py-3 px-4 font-bold text-text-secondary">{user.rank}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">👤</div>
                    <span className={`font-semibold text-sm ${(user as any).isCurrentUser ? "text-primary" : "text-text-main"}`}>
                      {user.name} {(user as any).isCurrentUser && "(Bạn)"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-bold text-sm text-text-main">{user.kg} kg</td>
                <td className="py-3 px-4 text-right text-sm text-text-secondary">{user.meals}</td>
                <td className="py-3 px-4 text-right">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">{user.level}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="flex items-center justify-end gap-1 text-sm">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{user.score}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Community Stats Footer */}
      <div className="mt-8 bg-primary/5 rounded-2xl p-6 flex items-center justify-between border border-border-green">
        <div>
          <p className="text-sm text-text-secondary">Tổng cộng đồng đã cứu được</p>
          <p className="text-2xl font-bold text-primary">1,250 kg thực phẩm</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90">
          Chia sẻ thành tích
        </button>
      </div>
    </div>
  );
}
