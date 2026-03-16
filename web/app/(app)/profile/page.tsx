"use client";

import React, { useState } from "react";
import { Star, MapPin, Calendar, Edit, ChevronRight, LogOut } from "lucide-react";

const stats = [
  { label: "Món chia sẻ", value: "23" },
  { label: "Món nhận", value: "15" },
  { label: "Hoàn tất", value: "95%" },
  { label: "Thành viên", value: "8 tháng" },
];

const achievements = [
  { icon: "🌱", label: "Bước đầu", unlocked: true },
  { icon: "🌿", label: "Chia sẻ 10", unlocked: true },
  { icon: "🌳", label: "Bảo vệ", unlocked: true },
  { icon: "💎", label: "Tiên phong", unlocked: false },
];

const menuItems = [
  { label: "Bài đăng của tôi", emoji: "📋", href: "/my-posts" },
  { label: "Yêu cầu đã gửi", emoji: "📩", href: "#" },
  { label: "Lịch sử giao dịch", emoji: "📊", href: "/history" },
  { label: "Cài đặt tài khoản", emoji: "⚙️", href: "#" },
];

const currentShares = [
  { title: "Bánh mì bơ tỏi", status: "🟢 Đang nhận", time: "2 giờ trước" },
  { title: "Túi cam sành", status: "🟡 2 yêu cầu", time: "5 giờ trước" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Cover Banner */}
      <div className="relative h-40 rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
        {/* Avatar */}
        <div className="absolute -bottom-12 left-8">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-white flex items-center justify-center text-4xl shadow-lg relative">
            👤
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Minh Anh</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <MapPin size={14} /> TP. Hồ Chí Minh
            </span>
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <Calendar size={14} /> Tham gia 8 tháng trước
            </span>
          </div>
          {/* Trust Score */}
          <div className="flex items-center gap-2 mt-3">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-text-main">92 / 100</span>
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-bold">Rất đáng tin cậy</span>
          </div>
          <div className="w-48 h-2 bg-surface rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "92%" }} />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
          <Edit size={16} />
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 border border-border-green text-center flex-1">
            <p className="text-lg font-bold text-text-main">{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-green mb-6">
        {["about", "history", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            {tab === "about" ? "Giới thiệu" : tab === "history" ? "Lịch sử" : "Đánh giá"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "about" && (
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-text-main mb-3">Bio</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Yêu thích chia sẻ thực phẩm và bảo vệ môi trường. Mỗi ngày một hành động nhỏ, cùng tạo tác động lớn! 🌱
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text-main mb-3">Huy hiệu</h3>
            <div className="flex gap-4">
              {achievements.map((a) => (
                <div key={a.label} className={`flex flex-col items-center gap-2 ${a.unlocked ? "" : "opacity-40"}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                    a.unlocked ? "bg-primary/10 border-2 border-primary" : "bg-gray-100 border-2 border-gray-200"
                  }`}>
                    {a.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-center">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-text-main mb-3">Đang chia sẻ</h3>
            <div className="space-y-2">
              {currentShares.map((s) => (
                <div key={s.title} className="bg-white rounded-xl p-4 border border-border-green flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-main">{s.title}</p>
                    <p className="text-xs text-text-secondary">{s.time}</p>
                  </div>
                  <span className="text-xs font-bold">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="mt-8 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-border-green hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>
              <span className="font-medium text-text-main">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-text-secondary" />
          </a>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full mt-6 mb-8 bg-danger/10 text-danger rounded-2xl p-4 flex items-center justify-center gap-2 font-bold hover:bg-danger/20 transition-colors">
        <LogOut size={18} />
        Đăng xuất
      </button>
    </div>
  );
}
