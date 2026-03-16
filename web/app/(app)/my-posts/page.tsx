"use client";

import React, { useState } from "react";
import { MapPin, Eye, Users, CheckCircle, MoreHorizontal } from "lucide-react";

/* ─── Sub-components ─── */

interface PostStatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PostStatusTabs: React.FC<PostStatusTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { label: "Đang đăng (3)", value: "active" },
    { label: "Đã hoàn tất (12)", value: "completed" },
    { label: "Đã ẩn (1)", value: "hidden" },
  ];

  return (
    <div className="flex border-b border-border-green">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-6 py-4 font-bold text-sm transition-colors ${
            activeTab === tab.value
              ? "border-b-3 border-primary text-text-main"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface MyPostListItemCardProps {
  title: string;
  description: string;
  imageSrc: string;
  status: "active" | "requests" | "completed";
  statusLabel: string;
  location: string;
  timeAgo: string;
  requestCount?: number;
}

const MyPostListItemCard: React.FC<MyPostListItemCardProps> = ({
  title,
  description,
  imageSrc,
  status,
  statusLabel,
  location,
  timeAgo,
  requestCount,
}) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    requests: "bg-yellow-100 text-yellow-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4 flex gap-6 shadow-sm border border-border-green hover:border-primary/20 transition-all ${
        status === "completed" ? "opacity-80" : ""
      }`}
    >
      <div
        className={`w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 ${
          status === "completed" ? "grayscale" : ""
        }`}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${statusColors[status]}`}
              >
                {statusLabel}
              </span>
              <h3
                className={`text-lg font-bold ${
                  status === "completed" ? "text-text-secondary" : ""
                }`}
              >
                {title}
              </h3>
              <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                {description}
              </p>
            </div>
            <span className="text-xs text-text-secondary">{timeAgo}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            {status === "completed" ? (
              <span className="bg-gray-200 text-text-secondary px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <CheckCircle size={14} />
                Đã trao tặng
              </span>
            ) : (
              <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                {requestCount ? (
                  <>
                    <Users size={14} /> Xem yêu cầu ({requestCount})
                  </>
                ) : (
                  <>
                    <Eye size={14} /> Xem yêu cầu
                  </>
                )}
              </button>
            )}
            <button className="p-2 text-text-secondary hover:text-primary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="text-xs font-medium text-text-secondary flex items-center gap-1">
            <MapPin size={12} /> {location}
          </div>
        </div>
      </div>
    </div>
  );
};

const mockPosts: MyPostListItemCardProps[] = [
  {
    title: "Bánh mì bơ tỏi",
    description: "Còn dư 2 ổ bánh mì bơ tỏi mới nướng sáng nay, cần chia sẻ gấp để đảm bảo độ giòn ngon.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkfowpYSTTjmHnWdw1otn1CT2xa9HAo6cVQOVmZ-9KUhm_UyOzKaN3GL0vtk1wwXNC2o3A1oXiPyLxkUD65_R6421BWt1i5_iXUNpwuQ8oTLvBCvrmmzkzR3ML9g19ZUrLnDUK0gfw8oDel88h1wLfaYn2af0MRVIGVS0F5jZflOb4EXDDIeV2FyM5aF-Zr7ThzYdR_wIIQN_njcejCZSWL636amljNHJ5-WgirTBb9uKZG6hl5RaC8wMO5Q6jbMH5Cmzdixs0uA",
    status: "active",
    statusLabel: "🟢 Đang nhận",
    location: "Quận 1, TP.HCM",
    timeAgo: "Đăng 2 giờ trước",
  },
  {
    title: "Túi cam sành",
    description: "Khoảng 3kg cam sành miền Tây, mọng nước, thích hợp vắt nước hoặc ăn trực tiếp.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcK1LS4tAA6BJsygWmAG6Ik71TEGCT52UJstuWoKATP7ELLkYxk7t2A5BrjxUbvxKNc5KBLyv6IKBrHQELX-axRuZAvAncXym8NFISB2plxUuZF1jYU_QnJ8RaTlT02RFiG02HDlq3of8xs1ZWL9sfxs3-4TEJfkFaZ9I8MacOQCDLNEZaUDKxtETzdXqAGtdRgAnLoLN1N_C1fqt2Fk4YcXNjE0ZqidHsmjW2I4rsc9fecKHKBykLxamR4_UfiKacjv0uO7XJjQ",
    status: "requests",
    statusLabel: "🟡 Có 2 yêu cầu",
    location: "Quận 7, TP.HCM",
    timeAgo: "Đăng 5 giờ trước",
    requestCount: 2,
  },
  {
    title: "Salad ức gà Keto",
    description: "Suất ăn trưa dư do thay đổi lịch trình, đầy đủ dinh dưỡng cho người ăn kiêng.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2vLOg6ywFgPAGLUQ2wOnWejwmAL7Bx1_Z9tPrLVTQbt0j4TaWpGtdxxbhoaUoQIWlP43I2pY7BsS_Yob9wm54SXU_XIk9LTuUBCJVSD9hJAE2CIXBtw9gXLV8pvaORRBzcme_9_7bnZ8k6VmrByB4p55f5c_7tMcSLDwXTMdsc6tpWjDwo18UgE30bN_7NNvFBnD1PebzIk0_6AAqWU1MCyaDO2q1ZZB4NskS8uKuYHDEGnNxlwxwABoC_GKW1A-14cLIBVotAA",
    status: "completed",
    statusLabel: "⚫ Hoàn tất",
    location: "Quận 3, TP.HCM",
    timeAgo: "Đăng hôm qua",
  },
];

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">Bài đăng của tôi</h2>
          <p className="text-text-secondary mt-1">Quản lý các món ăn bạn đã và đang chia sẻ</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-bold shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2">
          <span className="text-lg leading-none">+</span>
          Thêm món mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-green overflow-hidden">
        <PostStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-4 md:p-6 space-y-4 bg-background/50">
          {mockPosts.map((post) => (
            <MyPostListItemCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
