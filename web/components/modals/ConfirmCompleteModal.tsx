"use client";

import React, { useState } from "react";
import { CheckCircle2, Star, Camera, X } from "lucide-react";

interface ConfirmCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rating: number, review: string) => void;
  posterName?: string;
  foodTitle?: string;
}

const ConfirmCompleteModal: React.FC<ConfirmCompleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  posterName = "Nguyễn Thị Lan",
  foodTitle = "Cơm tấm sườn bì chả",
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-primary px-6 py-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-black/10">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black mb-1">Trao tặng thành công!</h2>
          <p className="text-white/80 text-sm">Bạn đã nhận món "{foodTitle}"</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="font-semibold text-text-main">
              Trải nghiệm của bạn với {posterName} thế nào?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    className={`${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" 
                        : "text-gray-300"
                    } transition-colors duration-200`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary h-4 font-medium">
              {rating === 5 && "Tuyệt vời!"}
              {rating === 4 && "Rất tốt"}
              {rating === 3 && "Bình thường"}
              {rating === 2 && "Tệ"}
              {rating === 1 && "Rất tệ"}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-main block">
              Chia sẻ thêm (Tùy chọn)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              placeholder="Đồ ăn rất ngon, Cảm ơn bạn nhiều nhé!..."
              className="w-full rounded-xl border border-border-green bg-surface p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <button className="w-full py-3 px-4 border-2 border-dashed border-border-green hover:border-primary/50 hover:bg-primary/5 text-primary rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
            <Camera size={18} />
            Đính kèm ảnh thực tế
          </button>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-text-secondary hover:bg-surface border border-transparent transition-all"
          >
            Bỏ qua
          </button>
          <button
            onClick={() => onConfirm(rating, review)}
            disabled={rating === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-[0.98] ${
              rating > 0 
                ? "bg-primary hover:bg-primary/90 shadow-primary/20" 
                : "bg-gray-300 shadow-none cursor-not-allowed"
            }`}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCompleteModal;
