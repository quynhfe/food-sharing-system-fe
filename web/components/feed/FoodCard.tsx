"use client";

import React from "react";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";

export interface FoodCardProps {
  id: string;
  title: string;
  imageSrc: string;
  posterName: string;
  posterAvatar: string;
  distance: string;
  timeLeft: string;
  isExpiring?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  title,
  imageSrc,
  posterName,
  posterAvatar,
  distance,
  timeLeft,
  isExpiring = false,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col border border-border-green">
      <div className="relative">
        <div
          className="aspect-[4/3] bg-center bg-cover"
          style={{ backgroundImage: `url('${imageSrc}')` }}
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            isExpiring
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isExpiring ? "🔴 Sắp hết hạn" : "🟢 Còn mới"}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 leading-tight text-text-main">
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <img
            src={posterAvatar}
            alt={posterName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-text-secondary font-medium">
            {posterName}
          </span>
        </div>
        <p className="text-sm text-text-secondary mb-6 flex items-center gap-2">
          <MapPin size={14} /> {distance} · <Clock size={14} /> {timeLeft}
        </p>
        <Link
          href={`/food/${id}`}
          className="w-full py-2.5 border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-colors mt-auto text-center block"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default FoodCard;
