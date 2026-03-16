"use client";

import React, { useState } from "react";
import { ArrowLeft, Star, MapPin, Check, X, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

/* ─── Sub-components ─── */

interface RequesterCardProps {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  timeAgo: string;
  distance: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const RequesterCard: React.FC<RequesterCardProps> = ({
  id,
  name,
  avatar,
  trustScore,
  timeAgo,
  distance,
  message,
  status,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border-green shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
      {/* Avatar & Basic Info */}
      <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-text-main text-lg">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1 bg-surface py-1 px-2 rounded-lg w-max border border-border-green">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-text-main">{trustScore}/100</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px md:w-px md:h-auto bg-border-green shrink-0" />

      {/* Details & Actions */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-text-secondary mb-3">
            <div className="flex items-center gap-1 bg-primary/5 text-primary px-2 py-1 rounded-md">
              <Clock size={14} /> {timeAgo}
            </div>
            <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded-md border border-border-green">
              <MapPin size={14} /> Cách bạn {distance}
            </div>
          </div>
          <div className="bg-surface-light p-3 rounded-xl border border-border-green/50 text-sm text-text-secondary leading-relaxed relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-surface-light border-l border-t border-border-green/50 rotate-45 hidden md:block" />
            <p>"{message}"</p>
          </div>
        </div>

        {/* Actions based on status */}
        <div className="flex items-center gap-3 pt-2">
          {status === "pending" && (
            <>
              <button 
                onClick={() => onAccept(id)}
                className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
              >
                <Check size={16} /> Chấp nhận
              </button>
              <button 
                onClick={() => onReject(id)}
                className="flex-1 py-2.5 px-4 bg-white text-text-main border border-border-green rounded-xl font-bold text-sm hover:bg-surface hover:text-danger transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} /> Từ chối
              </button>
            </>
          )}
          {status === "accepted" && (
            <>
              <div className="flex-1 py-2.5 px-4 bg-primary/10 text-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-primary/20">
                <Check size={16} /> Đã chấp nhận
              </div>
              <button className="flex-1 py-2.5 px-4 bg-white border border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={16} /> Nhắn tin
              </button>
            </>
          )}
          {status === "rejected" && (
            <div className="w-full py-2.5 px-4 bg-surface text-text-secondary rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-border-green opacity-70">
              Đã từ chối
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Page ─── */

const mockRequesters: Omit<RequesterCardProps, 'onAccept' | 'onReject'>[] = [
  {
    id: "req_1",
    name: "Trần Văn Nam",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFhF6vS9-6p3m7l5p58G7624c_Z5v8144_cRD49rV48W2u92P1Q81n7G9fVpB9W1yG27H49k8_aK18X1o2Z0k2yGZtL7hQYWvQn2V_UvYhX0xLg3GgR4J3p5d9bV9rG8l8Q9nIeC3ZpY6wW_R7uU5n-Z3X11bLw3b70n6vD78Q1G6F2z4b0wYQ",
    trustScore: 98,
    timeAgo: "10 phút trước",
    distance: "1.2 km",
    message: "Chào bạn, mình đang ở trọ gần đó, nếu được cho mình xin phần cơm này nhé. Cảm ơn bạn rất nhiều!",
    status: "pending"
  },
  {
    id: "req_2",
    name: "Lê Minh Tâm",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVmQoY25K25iKwOq5_Gq8uRmVxW7K0B0y05K2F7U0i472O4N0z2i15M4w4R1Y05P1j9k6F1r4bY9c0O1D27H9kX22fC2zP1O2i154P2E9F2x18e8o3K3uI6oW2i6M7R0Y8z5z0L0w5oY1yU3C5_YqS9G4B0d7U4U6m7PZ4Y5kX1i1P3w32l6X2w1E5P_L4",
    trustScore: 85,
    timeAgo: "45 phút trước",
    distance: "3.5 km",
    message: "Cho mình xin phần cơm được không ạ? Mình tan ca lúc 5h chiều sẽ qua lấy liền.",
    status: "pending"
  }
];

export default function RequestsListPage() {
  const [requesters, setRequesters] = useState(mockRequesters);

  const handleAccept = (id: string) => {
    setRequesters(prev => prev.map(req => {
      if (req.id === id) return { ...req, status: "accepted" };
      if (req.status === "pending") return { ...req, status: "rejected" }; // Auto reject others
      return req;
    }));
  };

  const handleReject = (id: string) => {
    setRequesters(prev => prev.map(req => 
      req.id === id ? { ...req, status: "rejected" } : req
    ));
  };

  const acceptedCount = requesters.filter(r => r.status === "accepted").length;
  const maxPortions = 3;

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 border-b border-border-green pb-6">
        <Link href="/my-posts" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-4 transition-colors font-medium text-sm">
          <ArrowLeft size={18} />
          Quay lại Bài đăng
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-text-main tracking-tight mb-2">
              Danh sách yêu cầu nhận
            </h1>
            <p className="text-text-secondary flex items-center gap-2">
              Cho món: <span className="font-bold text-text-main">Cơm tấm sườn bì chả</span>
            </p>
          </div>
          <div className="bg-surface px-4 py-3 rounded-xl border border-border-green flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {acceptedCount}/{maxPortions}
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Đã nhận</p>
              <p className="font-bold text-text-main text-sm">Còn trống {maxPortions - acceptedCount} phần</p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {requesters.length > 0 ? (
          requesters.map((req) => (
            <RequesterCard
              key={req.id}
              {...req}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-border-green">
            <p className="text-text-secondary font-medium">Chưa có yêu cầu nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
