"use client";

import React from "react";
import { Clock, MapPin, X, AlertCircle } from "lucide-react";

interface ConfirmRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  foodTitle?: string;
}

const ConfirmRequestModal: React.FC<ConfirmRequestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  foodTitle = "Cơm tấm sườn bì chả",
}) => {
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
        <div className="px-6 py-4 border-b border-border-green flex justify-between items-center bg-background">
          <h3 className="font-bold text-lg text-text-main">Xác nhận yêu cầu</h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary/5 rounded-2xl p-4 border border-border-green">
            <p className="font-bold text-text-main mb-1">{foodTitle}</p>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock size={16} className="text-primary" />
                <span>Bạn cần đến lấy trong vòng <b>2 giờ</b></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={16} className="text-primary" />
                <span>Quận 1, TP.HCM (cách 0.8km)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-main block">
              Lời nhắn cho người tặng (không bắt buộc)
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Cảm ơn bạn, mình có thể qua lấy lúc 5h chiều được không ạ?"
              className="w-full rounded-xl border border-border-green bg-surface p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-secondary/70"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Vui lòng chỉ yêu cầu khi bạn chắc chắn có thể đến lấy. Việc hủy yêu cầu nhiều lần sẽ ảnh hưởng đến <b>Điểm tin cậy</b> của bạn.
            </p>
          </div>
        </div>

        <div className="p-6 bg-surface border-t border-border-green flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-text-secondary hover:bg-white border border-transparent hover:border-border-green transition-all"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRequestModal;
