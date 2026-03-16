"use client";

import React from "react";
import { ArrowRight, Package, Cloud, Users } from "lucide-react";
import Link from "next/link";

const ImpactStatsRow: React.FC = () => {
  const stats = [
    { value: "1,250 kg", label: "Thực phẩm đã cứu" },
    { value: "2,800 kg", label: "CO₂ giảm thiểu" },
    { value: "890+", label: "Người dùng tin tưởng" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border-green pt-8 w-full">
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && (
            <div className="h-8 w-px bg-border-green hidden sm:block" />
          )}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-text-main">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-text-secondary">
              {stat.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col items-start space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🌍 Nền tảng chia sẻ thực phẩm #1 Việt Nam
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-text-main sm:text-6xl lg:text-7xl">
                Chia sẻ thực phẩm
                <br />
                <span className="text-primary">Giảm lãng phí</span>
                <br />
                Tạo tác động
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
                GreenShare kết nối người có thực phẩm dư thừa với người cần –
                giảm rác thải, xây dựng cộng đồng bền vững và lan tỏa yêu
                thương.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-1 active:scale-95"
              >
                Bắt đầu chia sẻ
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/feed"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-transparent px-8 py-4 text-base font-bold text-primary transition-all hover:bg-primary/5 hover:border-primary/40 active:scale-95"
              >
                Khám phá món ăn
              </Link>
            </div>

            <ImpactStatsRow />
          </div>

          {/* Right Column */}
          <div className="relative lg:ml-10">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary/5 p-4 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH4xarbbDJJTFXmkDI1ldcqZ8VnIdu1Se06rs5GPDpy3IH8WVdxhH5H8hqu2r_S5-h5RfHPI2XIS7VPahrz-MFOdSALfspKkrI3KovWHX18r_AqqmsFR_eCOOFFxaRGXRQWIo1zzDY-rJH-Wq1ekU4g6Jvf1rC5QWkzvBUkWZovg25ShQAzr3P8ElLDA_6mVy6qxUrK75ghIw6-V33L5rSaAf0EgGKEQFIruMJ-gl-eoYBxS3Ardm_exN7CA0hPkx8okS_4ghHPg"
                alt="Cộng đồng chia sẻ thực phẩm"
                className="h-full w-full rounded-xl object-cover shadow-2xl"
              />

              {/* Floating Card 1 */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Package size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold">Mới nhất</p>
                  <p className="text-xs text-text-secondary">
                    Giỏ rau củ hữu cơ vừa đăng
                  </p>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg">
                <div className="flex -space-x-3">
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/20" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/30" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/40" />
                </div>
                <p className="text-xs font-bold text-primary">
                  +890 người tham gia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute -right-20 -top-20 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
    </section>
  );
};

const ImpactStatsSection: React.FC = () => {
  const cards = [
    {
      icon: <Package size={24} />,
      label: "Đã cứu",
      value: "1,250 kg",
      desc: "Thực phẩm không bị bỏ phí trong cộng đồng.",
    },
    {
      icon: <Cloud size={24} />,
      label: "CO₂ giảm",
      value: "2,800 kg",
      desc: "Tương đương với việc trồng hơn 100 cây xanh.",
    },
    {
      icon: <Users size={24} />,
      label: "Người dùng",
      value: "890",
      desc: "Số lượng thành viên đang hoạt động tích cực.",
    },
  ];

  return (
    <section className="bg-background-light py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-4 rounded-2xl border border-border-green bg-white p-8 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {card.icon}
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">
                  {card.label}
                </p>
                <p className="text-3xl font-black text-text-main">
                  {card.value}
                </p>
                <p className="mt-2 text-xs text-text-secondary">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection, ImpactStatsRow, ImpactStatsSection };
export default HeroSection;
