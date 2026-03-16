"use client";

import React, { useState } from "react";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

const mockHistory = [
  {
    id: "1", title: "Cơm tấm sườn nướng", type: "shared", person: "Trần Minh Khoa",
    date: "15/03/2025", status: "completed", co2: 2.3, rating: 5,
    review: "Rất ngon và đầy đủ, cảm ơn bạn nhiều!",
    image: "🍚",
  },
  {
    id: "2", title: "Bánh mì thịt nguội", type: "received", person: "Tiệm bánh Kim Anh",
    date: "14/03/2025", status: "completed", co2: 1.5, rating: 4,
    review: "Bánh mì giòn, nhân đầy đặn.",
    image: "🥖",
  },
  {
    id: "3", title: "Phở bò tái nạm", type: "shared", person: "Lê Hoàng Nam",
    date: "13/03/2025", status: "processing", co2: 3.1, rating: null,
    review: null,
    image: "🍜",
  },
  {
    id: "4", title: "Salad rau củ", type: "received", person: "Healthy Garden",
    date: "12/03/2025", status: "cancelled", co2: 0, rating: null,
    review: null,
    image: "🥗",
  },
  {
    id: "5", title: "Bún chả Hà Nội", type: "shared", person: "Phạm Thu Hà",
    date: "10/03/2025", status: "completed", co2: 2.8, rating: 5,
    review: "Món ăn tươi, ngon, dễ lấy!",
    image: "🍲",
  },
  {
    id: "6", title: "Trái cây gọt sẵn", type: "shared", person: "Mai Thị Xuân",
    date: "08/03/2025", status: "completed", co2: 1.2, rating: 4,
    review: null,
    image: "🍊",
  },
  {
    id: "7", title: "Cơm cuộn rong biển", type: "received", person: "Bếp Bà Sáu",
    date: "06/03/2025", status: "completed", co2: 1.8, rating: 5,
    review: "Rất uy tín, hẹn lần sau!",
    image: "🍙",
  },
  {
    id: "8", title: "Bánh cuốn nóng", type: "shared", person: "Võ Đình Trung",
    date: "04/03/2025", status: "completed", co2: 2.0, rating: 5,
    review: null,
    image: "🥟",
  },
];

const statusBadge: Record<string, { label: string; color: string }> = {
  completed: { label: "🟢 Hoàn tất", color: "bg-green-50 text-green-700" },
  processing: { label: "🟡 Đang xử lý", color: "bg-yellow-50 text-yellow-700" },
  cancelled: { label: "🔴 Đã hủy", color: "bg-red-50 text-red-700" },
};

export default function HistoryPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockHistory.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-text-main">Lịch sử giao dịch</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {[{ label: "Tất cả", value: "all" }, { label: "Đã chia sẻ", value: "shared" }, { label: "Đã nhận", value: "received" }].map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                typeFilter === t.value ? "bg-primary text-white" : "bg-white text-text-secondary border border-border-green"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-border-green text-sm bg-surface font-semibold text-text-main outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="completed">Hoàn tất</option>
          <option value="processing">Đang xử lý</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-4 shadow-sm bg-white rounded-3xl p-4 md:p-6 border border-border-green">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-2xl p-4 border border-border-green hover:border-primary/30 transition-all text-left shadow-sm hover:shadow-md group cursor-pointer"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/5 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-main text-base md:text-lg truncate">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    <span className="font-semibold text-text-main">{item.type === "shared" ? "Tặng cho: " : "Nhận từ: "}</span>
                    {item.person}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-medium text-text-secondary bg-surface px-2 py-1 rounded-md border border-border-green">{item.date}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusBadge[item.status].color}`}>
                      {statusBadge[item.status].label}
                    </span>
                  </div>
                </div>
              </div>
              {item.co2 > 0 && (
                <div className="text-left md:text-right mt-3 md:mt-0 flex md:flex-col items-center md:items-end gap-2 md:gap-0 bg-primary/5 md:bg-transparent rounded-lg p-2 md:p-0">
                  <p className="text-sm font-black text-primary">+{item.co2} kg</p>
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">CO₂ giảm thiểu</p>
                </div>
              )}
            </div>

            {/* Expanded content */}
            {expandedId === item.id && item.rating && (
              <div className="mt-4 pt-4 border-t border-border-green w-full">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < (item.rating ?? 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}
                    />
                  ))}
                </div>
                {item.review && <p className="text-sm text-text-secondary italic">&ldquo;{item.review}&rdquo;</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {[1, 2, 3, "...", 12].map((p, i) => (
          <button
            key={i}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              p === 1 ? "bg-primary text-white" : "text-text-secondary hover:bg-surface"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
