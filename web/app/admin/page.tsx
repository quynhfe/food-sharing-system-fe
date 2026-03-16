"use client";

import React from "react";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

const kpiStats = [
  { label: "Tổng người dùng", value: "1,245", trend: "+12% tháng này", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Bài đăng đang Active", value: "328", trend: "+5% tuần này", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Giao dịch hoàn tất", value: "8,430", trend: "+18% tháng này", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  { label: "CO₂ giảm thiểu (kg)", value: "542.4", trend: "+20% tháng này", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const recentActivity = [
  { user: "Minh Anh", action: "vừa đăng món: Cơm tấm sườn bì", time: "5 phút trước" },
  { user: "Ngọc Trâm", action: "vừa hoàn tất giao dịch với Lê Nam", time: "15 phút trước" },
  { user: "Hệ thống", action: "vừa duyệt 12 người dùng mới", time: "1 giờ trước" },
  { user: "Quốc Việt", action: "đã đạt huy hiệu: Người tiên phong", time: "2 giờ trước" },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-border-green shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-text-main">{stat.value}</p>
                <p className="text-xs text-text-secondary font-medium mb-1 mt-1">{stat.label}</p>
                <p className="text-xs text-primary font-bold">{stat.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placeholder Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[400px]">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
            Lưu lượng thực phẩm cứu được
            <select className="text-sm font-normal text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
              <option>Năm nay</option>
              <option>Tháng này</option>
            </select>
          </h3>
          <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
            <p className="text-sm text-gray-400 font-medium">[Biểu đồ Bar Chart Tác Động - Placeholder]</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Trạng thái hệ thống</h3>
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-gray-700">Service Uptime</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-bold text-green-600">99.98%</span>
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">Hoạt động thời gian thực</p>
              <div className="space-y-4">
                {recentActivity.map((log, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">
                        <span className="font-bold text-gray-800">{log.user}</span> {log.action}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
