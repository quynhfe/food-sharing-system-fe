"use client";

import React from "react";
import { CheckCircle2, Clock, MapPin, MessageCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RequestStatusPage() {
  const status = "pending"; // 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

  return (
    <div className="max-w-[700px] mx-auto py-8 px-4">
      <Link href="/home" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Quay lại trang chủ</span>
      </Link>

      <div className="bg-white rounded-3xl border border-border-green shadow-sm overflow-hidden">
        {/* Status Header */}
        <div className="bg-yellow-50 p-8 text-center border-b border-yellow-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 relative">
              <Clock size={40} className="text-yellow-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white animate-ping opacity-75" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white" />
            </div>
            <h1 className="text-2xl font-black text-yellow-800 mb-2">Đang chờ xác nhận</h1>
            <p className="text-yellow-700 max-w-sm text-sm">
              Yêu cầu của bạn đã được gửi đến người tặng. Vui lòng chờ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="p-8 space-y-8">
          {/* Post Info */}
          <div className="flex gap-4 p-4 rounded-2xl bg-surface border border-border-green">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5DAbJpIpRhGw9CWhhInNiMx_El_9fkj0cU6uR74WczkG-6IGvpC_XebtWcEcmFNnutK42NCd8Galbd_mZJUSjHvC_2hbyQFqNR2MLrSIkaAabARLPgsP__V3Q6qyWCSBaVa2VZNS3hO0zKfo_CDJcCftyQ9OjUnVd2qEgh-LcPqG9X82DJGosOSFOtyvWYkR5-QbUZ0vbFLeUZxTV9K1Rf5gQ9-tJ_fJyhcRQF_voFswdoSAn7L0sHiD_Xd6gdK18p5CrWHBDg" 
                alt="Food"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-text-main text-lg mb-1">Cơm tấm sườn bì chả</h3>
              <p className="text-sm text-text-secondary">Người tặng: <span className="font-semibold text-text-main">Nguyễn Thị Lan</span></p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <h4 className="font-bold text-text-main flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Lưu ý khi nhận món
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary pl-6">
              <li className="relative before:absolute before:left-[-20px] before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full">
                Chỉ đến địa điểm nhận món <b>sau khi yêu cầu được chấp nhận</b>.
              </li>
              <li className="relative before:absolute before:left-[-20px] before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full">
                Kiểm tra tin nhắn thường xuyên để trao đổi với người tặng.
              </li>
              <li className="relative before:absolute before:left-[-20px] before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full">
                Nếu không thể đến, vui lòng <b>hủy yêu cầu</b> sớm để nhường cơ hội cho người khác.
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-text-main text-sm mb-1">Khu vực nhận dự kiến</p>
              <p className="text-sm text-text-secondary">Quận 1, TP.HCM</p>
              <p className="text-xs text-primary font-medium mt-1">Địa chỉ chi tiết sẽ hiển thị khi được chấp nhận</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 bg-surface border-t border-border-green flex flex-col sm:flex-row gap-3">
          <button className="flex-1 flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-bold bg-white text-text-main border border-border-green hover:border-text-secondary transition-colors shadow-sm">
            Hủy yêu cầu
          </button>
          <button className="flex-1 flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <MessageCircle size={18} />
            Hỏi thăm trạng thái
          </button>
        </div>
      </div>
    </div>
  );
}
