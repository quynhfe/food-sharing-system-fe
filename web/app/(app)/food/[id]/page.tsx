"use client";

import React from "react";
import { MapPin, Clock, Star, Send, MessageCircle, Heart, Info } from "lucide-react";
import Link from "next/link";

/* ─── Sub-components ─── */

const FoodImageGallery: React.FC = () => {
  const mainImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5DAbJpIpRhGw9CWhhInNiMx_El_9fkj0cU6uR74WczkG-6IGvpC_XebtWcEcmFNnutK42NCd8Galbd_mZJUSjHvC_2hbyQFqNR2MLrSIkaAabARLPgsP__V3Q6qyWCSBaVa2VZNS3hO0zKfo_CDJcCftyQ9OjUnVd2qEgh-LcPqG9X82DJGosOSFOtyvWYkR5-QbUZ0vbFLeUZxTV9K1Rf5gQ9-tJ_fJyhcRQF_voFswdoSAn7L0sHiD_Xd6gdK18p5CrWHBDg";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src={mainImage}
          alt="Cơm tấm sườn bì chả"
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white transition-colors">
          <Heart size={20} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

const PosterInfoCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border-green">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl3BcLd0inlFsMwY0pyKPURHwtt0MC1R0KsNJfydsg00bRbtxB5ref21ldnyIPi5jTIIFcXrbxqrOFm2TisyO9agzvy4Eb_YqYA1fTtn8PcJHVdRrU2ZTxyCE25wGpgg5jHPVSo7bah9i5Lj9DvcGx8LGMZBR7ths1ZjfappxM03tGURBQaslmCxntPj0orA-3loPf08YeGYTRK297M1H_dDPPiHN5ZB0TKJftfIpXRtU-zRxMS_Z7gqtCK3LKyF682mPoMzVqXA"
              alt="Nguyễn Thị Lan"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-text-main">Nguyễn Thị Lan</h3>
            <div className="flex items-center gap-1 text-xs">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-text-main">94/100</span>
              <span className="text-text-secondary ml-2">23 lần chia sẻ</span>
            </div>
          </div>
        </div>
        <button className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors">
          Theo dõi
        </button>
      </div>
      <div className="flex items-start gap-2 text-text-secondary text-sm">
        <MapPin size={18} className="text-primary mt-0.5" />
        <div>
          <p className="font-medium text-text-main">Quận 1, TP.HCM</p>
          <p className="text-xs">
            Cách bạn 0.8km ·{" "}
            <span className="text-primary font-medium">
              Nhận tại sảnh chung cư
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const FoodInfoPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Còn nhận
        </span>
        <h1 className="text-3xl font-black text-text-main leading-tight mb-2">
          Cơm tấm sườn bì chả
        </h1>
        <p className="text-text-secondary leading-relaxed text-sm">
          Phần cơm được chuẩn bị từ nhà hàng sáng nay, đầy đủ sườn bì chả, dưa
          leo và nước mắm. Còn nguyên trong hộp xốp chưa khui, đảm bảo vệ
          sinh. Thích hợp cho sinh viên hoặc các bạn khó khăn cần bữa trưa ngon
          miệng.
        </p>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-border-green">
        <div className="flex items-center gap-2">
          <span className="text-primary">🍽️</span>
          <span className="text-sm font-semibold">3 phần</span>
        </div>
        <div className="w-px h-4 bg-border-green" />
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-semibold">HSD: 15/03/2025</span>
        </div>
      </div>

      <PosterInfoCard />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <Send size={18} />
          Gửi yêu cầu nhận
        </button>
        <button className="w-full bg-transparent border-2 border-primary/30 hover:border-primary text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
          <MessageCircle size={18} />
          Nhắn tin hỏi thêm
        </button>
      </div>

      {/* Info note */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-800 text-xs">
        <Info size={14} />
        <p>Vui lòng xác nhận qua tin nhắn sau khi gửi yêu cầu nhận.</p>
      </div>
    </div>
  );
};

/* ─── Page ─── */

export default function FoodDetailPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Gallery 60% */}
        <div className="lg:w-[60%]">
          <FoodImageGallery />
        </div>

        {/* Right Column: Info 40% */}
        <div className="lg:w-[40%] lg:sticky lg:top-10 lg:self-start">
          <FoodInfoPanel />
        </div>
      </div>
    </div>
  );
}
