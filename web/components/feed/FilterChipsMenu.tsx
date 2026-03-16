"use client";

import React, { useState } from "react";

const filters = [
  { label: "📍 Gần bạn", value: "nearby" },
  { label: "⏰ Sắp hết hạn", value: "expiring" },
  { label: "⭐ Đề xuất", value: "recommended" },
  { label: "🆕 Mới nhất", value: "newest" },
];

const FilterChipsMenu: React.FC = () => {
  const [active, setActive] = useState("nearby");

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActive(filter.value)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            active === filter.value
              ? "bg-primary text-white"
              : "bg-white border border-border-green text-text-main hover:bg-primary/5"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChipsMenu;
