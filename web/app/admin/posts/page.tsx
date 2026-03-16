"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, Eye } from "lucide-react";

const posts = [
  { id: "P8921", title: "Cơm tấm sườn bì", author: "Nguyễn Thị Lan", location: "Quận 1, HCM", status: "Active", requests: 3, createdAt: "2 giờ trước" },
  { id: "P8920", title: "Bánh mì chay", author: "Quán Chay Liên", location: "Quận 3, HCM", status: "Completed", requests: 1, createdAt: "5 giờ trước" },
  { id: "P8919", title: "Salad rau củ", author: "Lê Cẩm Tú", location: "Quận 7, HCM", status: "Reported", requests: 0, createdAt: "1 ngày trước" },
  { id: "P8918", title: "Phở tái nạm", author: "Phở Sáng Cường", location: "Tân Bình, HCM", status: "Completed", requests: 5, createdAt: "2 ngày trước" },
  { id: "P8917", title: "Bánh bông lan trứng muối", author: "Tiệm Bánh ABC", location: "Gò Vấp, HCM", status: "Expired", requests: 0, createdAt: "3 ngày trước" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-600",
  Reported: "bg-red-100 text-red-700",
  Expired: "bg-orange-100 text-orange-700",
};

export default function AdminPostsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài đăng</h1>
          <p className="text-sm text-gray-500 mt-1">Kiểm duyệt và theo dõi các bài chia sẻ thực phẩm</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-border-green shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, ID bài đăng..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-green rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-text-secondary text-text-main"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-border-green rounded-xl text-sm font-semibold text-text-main hover:bg-surface hover:text-primary transition-colors">
          <Filter size={16} /> Lọc trạng thái
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Món ăn / ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Người đăng</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Yêu cầu</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className={`hover:bg-gray-50/50 transition-colors ${post.status === "Reported" ? "bg-red-50/20" : ""}`}>
                  <td className="py-4 px-6">
                    <p className="font-bold text-sm text-gray-800 leading-snug">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{post.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-gray-700">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.location}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusStyles[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{post.requests}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                    {post.createdAt}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Xem chi tiết">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-800 p-2 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
