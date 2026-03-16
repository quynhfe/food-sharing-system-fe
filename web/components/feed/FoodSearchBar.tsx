"use client";

import React from "react";
import { Search } from "lucide-react";

const FoodSearchBar: React.FC = () => {
  return (
    <div className="relative group">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
      />
      <input
        type="text"
        placeholder="Tìm món ăn gần bạn..."
        className="w-full bg-white border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/50 text-text-main placeholder:text-text-secondary"
      />
    </div>
  );
};

export default FoodSearchBar;
