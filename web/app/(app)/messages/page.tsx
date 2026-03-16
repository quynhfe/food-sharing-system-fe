"use client";

import React, { useState } from "react";
import { Search, MessageCircle } from "lucide-react";

const mockConversations = [
  {
    id: "1",
    name: "Nguyễn Thị Lan",
    foodTitle: "Cơm tấm sườn bì chả",
    lastMessage: "Mình confirm nhé, 5h chiều nay nhé!",
    time: "14:32",
    unread: 2,
    status: "active",
    avatar: "👩",
  },
  {
    id: "2",
    name: "Trần Văn Minh",
    foodTitle: "Bánh mì thịt nguội",
    lastMessage: "Cảm ơn bạn nhiều ạ 🙏",
    time: "Hôm qua",
    unread: 0,
    status: "completed",
    avatar: "👨",
  },
  {
    id: "3",
    name: "Lê Hồng Phúc",
    foodTitle: "Phở bò tái nạm",
    lastMessage: "Mình đang trên đường tới...",
    time: "12:15",
    unread: 1,
    status: "pickup",
    avatar: "🧑",
  },
];

const statusLabel: Record<string, { label: string; color: string }> = {
  active: { label: "🔵 Đang chat", color: "text-blue-600 bg-blue-50" },
  pickup: { label: "🟡 Chờ lấy", color: "text-yellow-700 bg-yellow-50" },
  completed: { label: "🟢 Hoàn tất", color: "text-green-700 bg-green-50" },
};

export default function MessagesPage() {
  const [filter, setFilter] = useState("all");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const filters = [
    { label: "Tất cả", value: "all" },
    { label: "Đang xử lý", value: "active" },
    { label: "Hoàn tất", value: "completed" },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Left Panel: Conversation List */}
      <div className="w-[360px] border-r border-border-green flex flex-col bg-white">
        <div className="p-4 border-b border-border-green">
          <h2 className="text-xl font-bold text-text-main mb-3">Tin nhắn</h2>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Tìm cuộc trò chuyện..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border-green bg-surface text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f.value
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full flex items-start gap-3 p-4 border-b border-border-green/50 hover:bg-surface transition-colors text-left ${
                selectedChat === chat.id ? "bg-primary/5" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-text-main truncate">{chat.name}</h3>
                  <span className="text-xs text-text-secondary flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-primary font-medium truncate">{chat.foodTitle}</p>
                <p className="text-xs text-text-secondary truncate mt-0.5">{chat.lastMessage}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${statusLabel[chat.status].color}`}>
                  {statusLabel[chat.status].label}
                </span>
              </div>
              {chat.unread > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Chat or Empty state */}
      <div className="flex-1 flex items-center justify-center bg-surface">
        {selectedChat ? (
          <div className="flex flex-col h-full w-full">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border-green bg-white">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {mockConversations.find((c) => c.id === selectedChat)?.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{mockConversations.find((c) => c.id === selectedChat)?.name}</h3>
                <p className="text-xs text-primary">{mockConversations.find((c) => c.id === selectedChat)?.foodTitle}</p>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary/90">
                ✓ Đánh dấu hoàn tất
              </button>
            </div>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-center">
                <span className="text-xs text-text-secondary bg-surface px-3 py-1 rounded-full">
                  Yêu cầu đã được chấp nhận lúc 14:30
                </span>
              </div>
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[70%] shadow-sm border border-border-green">
                  <p className="text-sm">Chào bạn, mình đến lấy khoảng 5h chiều được không ạ?</p>
                  <span className="text-[10px] text-text-secondary mt-1 block">14:31</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[70%]">
                  <p className="text-sm">Được bạn ơi! Mình ở sảnh chung cư nha 👍</p>
                  <span className="text-[10px] text-white/70 mt-1 block">14:32</span>
                </div>
              </div>
            </div>
            {/* Input bar */}
            <div className="p-4 border-t border-border-green bg-white flex gap-3 items-center">
              <input
                type="text"
                placeholder="Nhắn tin..."
                className="flex-1 px-4 py-3 rounded-xl border border-border-green bg-surface text-sm focus:ring-2 focus:ring-primary/20"
              />
              <button className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                Gửi
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-main">Chọn cuộc trò chuyện</h3>
            <p className="text-sm text-text-secondary mt-1">Chọn một cuộc trò chuyện để xem tin nhắn</p>
          </div>
        )}
      </div>
    </div>
  );
}
