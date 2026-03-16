"use client";

import React, { useState } from "react";
import { Search, MapPin, Clock, TrendingUp, Star } from "lucide-react";

const popularAreas = ["Quận 1", "Quận 3", "Quận 7", "Bình Thạnh", "Thủ Đức", "Gò Vấp"];

const expiringSoon = [
  { title: "Trái cây tươi gọt sẵn", time: "Còn 30 phút", dist: "0.3 km", emoji: "🍊" },
  { title: "Salad rau củ hữu cơ", time: "Còn 1 giờ", dist: "2.0 km", emoji: "🥗" },
  { title: "Cơm tấm sườn nướng", time: "Còn 2 giờ", dist: "0.8 km", emoji: "🍚" },
  { title: "Bánh mì thịt nguội", time: "Còn 3 giờ", dist: "1.2 km", emoji: "🥖" },
];

const popularItems = [
  { title: "Phở bò tái nạm", poster: "Phở Lý Quốc Sư", rating: 96, shares: 45 },
  { title: "Bún chả Hà Nội", poster: "Bún Chả Sinh Từ", rating: 92, shares: 38 },
  { title: "Bánh cuốn nóng", poster: "Quán Bà Ba", rating: 89, shares: 27 },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-text-main mb-6">Khám phá</h1>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Tìm kiếm theo khu vực, món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-green bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-main"
        />
      </div>

      {/* Popular areas */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-main mb-4">Khu vực phổ biến</h2>
        <div className="flex flex-wrap gap-3">
          {popularAreas.map((area) => (
            <button
              key={area}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary/10 border border-border-green hover:bg-primary/20 transition-colors"
            >
              <MapPin size={14} className="text-primary" />
              <span className="text-sm font-semibold text-primary">{area}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Expiring soon */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-main mb-4">Sắp hết hạn gần đây</h2>
        <div className="space-y-3">
          {expiringSoon.map((item) => (
            <button
              key={item.title}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-border-green hover:border-primary/30 hover:shadow-md transition-all text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-2xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-main">{item.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-danger font-medium">
                    <Clock size={12} />
                    {item.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <MapPin size={12} />
                    {item.dist}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Popular items */}
      <section>
        <h2 className="text-xl font-bold text-text-main mb-4">Được yêu thích nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 border border-border-green hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase">Phổ biến</span>
              </div>
              <h3 className="font-bold text-text-main mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary mb-3">{item.poster}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{item.rating}/100</span>
                </span>
                <span className="text-xs text-text-secondary">{item.shares} lần chia sẻ</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
