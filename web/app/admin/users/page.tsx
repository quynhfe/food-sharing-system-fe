"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, AlertCircle } from "lucide-react";

const users = [
  { id: "U001", name: "Nguyễn Thị Lan", role: "Người dùng", trustScore: 94, status: "Active", joined: "12/05/2023" },
  { id: "U002", name: "Nhà hàng Bếp Quê", role: "Doanh nghiệp", trustScore: 98, status: "Active", joined: "01/08/2023" },
  { id: "U003", name: "Trần Văn Khang", role: "Người dùng", trustScore: 82, status: "Warning", joined: "15/11/2023" },
  { id: "U004", name: "Siêu thị Co.op", role: "Doanh nghiệp", trustScore: 99, status: "Active", joined: "20/01/2024" },
  { id: "U005", name: "Lê Cẩm Tú", role: "Người dùng", trustScore: 45, status: "Banned", joined: "05/02/2024" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Warning: "bg-yellow-100 text-yellow-700",
  Banned: "bg-red-100 text-red-700",
};

export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi điểm tin cậy của toàn bộ thành viên</p>
        </div>
        <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm text-sm">
          + Thêm Quản trị viên
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-border-green shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-green rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-text-secondary text-text-main"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-border-green rounded-xl text-sm font-semibold text-text-main hover:bg-surface hover:text-primary transition-colors">
          <Filter size={16} /> Lọc
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ID / Tên</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Điểm Trust</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 font-medium">{user.role}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${user.trustScore < 50 ? "text-red-600" : user.trustScore < 80 ? "text-yellow-600" : "text-green-600"}`}>
                        {user.trustScore}
                      </span>
                      {user.trustScore < 50 && <AlertCircle size={14} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                    {user.joined}
                  </td>
                  <td className="py-4 px-6 text-right">
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
