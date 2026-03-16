"use client";

import React from "react";
import { Recycle, Globe, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const ImpactStatsGrid: React.FC = () => {
  const stats = [
    {
      icon: <Recycle size={28} />,
      value: "1,250 kg",
      label: "Thực phẩm đã được cứu",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: <Globe size={28} />,
      value: "2,800 kg",
      label: "CO₂ đã giảm",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <Users size={28} />,
      value: "890+",
      label: "Người dùng tích cực",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-start p-8 rounded-2xl bg-white shadow-sm border border-border-green group hover:border-primary/30 transition-all"
        >
          <div
            className={`${stat.iconBg} ${stat.iconColor} p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform`}
          >
            {stat.icon}
          </div>
          <p className="text-4xl font-bold mb-2 text-text-main">{stat.value}</p>
          <p className="text-text-secondary font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

interface BarData {
  label: string;
  value: string;
  height: string;
  isHighlighted?: boolean;
}

const SavedFoodChart: React.FC = () => {
  const bars: BarData[] = [
    { label: "Th.1", value: "150kg", height: "40%" },
    { label: "Th.2", value: "180kg", height: "55%" },
    { label: "Th.3", value: "165kg", height: "48%" },
    { label: "Th.4", value: "210kg", height: "75%" },
    { label: "Th.5", value: "195kg", height: "65%" },
    { label: "Th.6", value: "250kg", height: "90%", isHighlighted: true },
  ];

  return (
    <div className="w-full bg-white p-10 rounded-2xl border border-border-green shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-text-main">
            Thực phẩm được cứu theo tháng
          </h3>
          <p className="text-sm text-text-secondary">
            Thống kê chi tiết 6 tháng gần nhất
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
          <TrendingUp size={14} className="text-primary" />
          <span className="font-bold text-sm text-primary">
            +12% so với kỳ trước
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className="flex flex-col items-center flex-1 h-full justify-end gap-3 group"
          >
            <span
              className={`text-[10px] md:text-xs font-bold ${
                bar.isHighlighted
                  ? "text-primary"
                  : "text-text-secondary group-hover:text-primary"
              } transition-colors`}
            >
              {bar.value}
            </span>
            <div
              className={`${
                bar.isHighlighted
                  ? "bg-primary shadow-lg shadow-primary/20"
                  : "bg-primary/20 group-hover:bg-primary"
              } rounded-full w-full max-w-[40px] transition-all duration-500`}
              style={{ height: bar.height }}
            />
            <span
              className={`text-[10px] md:text-xs font-semibold ${
                bar.isHighlighted ? "text-text-main" : "text-text-secondary"
              }`}
            >
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImpactCallToAction: React.FC = () => {
  return (
    <div className="w-full mt-8 p-10 bg-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border-green shadow-sm">
      <div className="text-center md:text-left">
        <h2 className="text-primary-dark text-2xl font-bold mb-2">
          Bạn cũng có thể tạo tác động
        </h2>
        <p className="text-text-secondary">
          Bắt đầu hành trình giảm lãng phí thực phẩm của bạn ngay hôm nay.
        </p>
      </div>
      <Link
        href="/register"
        className="bg-primary-dark hover:bg-primary text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
      >
        Tham gia ngay
      </Link>
    </div>
  );
};

const ImpactSection: React.FC = () => {
  return (
    <section
      id="impact"
      className="px-4 py-16 md:px-10 lg:px-20 bg-primary-dark text-white"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Tác động của chúng ta
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Mỗi hành động nhỏ của bạn đều góp phần vào một tương lai xanh hơn
            cho hành tinh này.
          </p>
        </div>

        <ImpactStatsGrid />
        <SavedFoodChart />
        <ImpactCallToAction />
      </div>
    </section>
  );
};

export { ImpactStatsGrid, SavedFoodChart, ImpactCallToAction };
export default ImpactSection;
