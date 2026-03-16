"use client";

import React from "react";
import { Camera, MapPin, Calendar } from "lucide-react";

/* ─── Sub-components ─── */

const ImageUploadZone: React.FC = () => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-text-main">
        Hình ảnh món ăn
      </label>
      <div className="relative group">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all rounded-2xl py-12 cursor-pointer text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Camera size={32} className="text-primary" />
          </div>
          <p className="text-lg font-bold text-text-main">
            Kéo thả hoặc click để tải ảnh
          </p>
          <p className="text-sm text-text-secondary">
            Tải lên ít nhất 1 hình ảnh rõ nét của món ăn
          </p>
          <button
            type="button"
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all"
          >
            Chọn ảnh
          </button>
        </div>
        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      {/* Thumbnail previews */}
      <div className="grid grid-cols-4 gap-4 pt-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square bg-surface-light rounded-xl border-2 border-dashed border-border-green flex items-center justify-center"
          >
            <span className="text-text-secondary text-xl">+</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreatePostForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-main">
          Tên món ăn *
        </label>
        <input
          type="text"
          placeholder="Ví dụ: Cơm cuộn rong biển, Bánh mì kẹp..."
          className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-main">
          Mô tả món ăn
        </label>
        <textarea
          placeholder="Chia sẻ thêm về thành phần, hương vị hoặc lưu ý bảo quản..."
          rows={4}
          className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main">
            Số lượng (phần)
          </label>
          <input
            type="number"
            placeholder="0"
            className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main">
            Đơn vị
          </label>
          <select className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3">
            <option>Phần</option>
            <option>Hộp</option>
            <option>Cái</option>
            <option>Kilogram (kg)</option>
            <option>Lít (l)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main">
            Hạn sử dụng *
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main">
            Địa điểm lấy món *
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Nhập địa chỉ của bạn"
              className="w-full rounded-xl border border-border-green bg-background-light focus:ring-primary focus:border-primary transition-all p-3 pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleToggle: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-border-green">
      <div className="flex items-center gap-3">
        <Calendar size={20} className="text-primary" />
        <div>
          <p className="font-semibold text-text-main">
            Yêu cầu đặt lịch trước
          </p>
          <p className="text-xs text-text-secondary">
            Bật nếu bạn muốn duyệt người nhận
          </p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
};

/* ─── Page ─── */

export default function CreatePostPage() {
  return (
    <div className="max-w-[720px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2">
          Đăng món ăn của bạn 🌱
        </h2>
        <p className="text-text-secondary mt-1">
          Chia sẻ thực phẩm dư thừa để cùng nhau bảo vệ môi trường.
        </p>
      </div>

      <div className="bg-white border border-border-green rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <ImageUploadZone />
          <CreatePostForm />
          <ScheduleToggle />

          <div className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              🌱 Đăng món ăn
            </button>
            <p className="text-center text-xs text-text-secondary mt-4 px-4">
              Bằng cách đăng món, bạn đồng ý với Điều khoản cộng đồng của
              GreenShare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
