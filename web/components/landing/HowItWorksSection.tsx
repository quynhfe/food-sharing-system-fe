"use client";

import React from "react";
import { Upload, HandHeart, CheckCircle } from "lucide-react";
import Link from "next/link";

interface StepCardProps {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  icon,
  title,
  description,
  imageSrc,
}) => {
  return (
    <div className="group relative flex flex-col bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border-green">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-background-light">
        {step}
      </div>
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-text-main text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
      <div className="mt-6 w-full h-48 rounded-xl overflow-hidden bg-surface-light">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          alt={title}
        />
      </div>
    </div>
  );
};

const ActionSection: React.FC = () => {
  return (
    <section className="px-6 py-12 md:px-20 lg:px-40 bg-primary/5">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-2xl shadow-md border border-border-green">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-main">
            Sẵn sàng để chia sẻ?
          </h2>
          <p className="text-text-secondary mt-2">
            Đừng để lãng phí thực phẩm khi người khác đang cần nó.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link
            href="/register"
            className="flex-1 md:flex-none px-8 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-center"
          >
            Bắt đầu ngay
          </Link>
          <Link
            href="/#how-it-works"
            className="flex-1 md:flex-none px-8 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors text-center"
          >
            Xem hướng dẫn
          </Link>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Upload size={28} />,
      title: "Đăng món ăn dư",
      description:
        "Chụp ảnh và đăng món ăn bạn muốn chia sẻ chỉ trong 2 phút. Cung cấp thông tin cơ bản để mọi người dễ dàng tìm thấy.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAMnVcVJrNLM26cUYO8K9E73UFCOtV6KBDnDGh8tCXqDGGSuRvrSgdq2NbpA6uOg-4bDGXO4mdrkvXA-EbTNCYUzCISQNgsWl3zs1yqkrRJ0L_E71K1namX7BkmgkSRrENCHX3ofzphVFFKO-j-Z6oGySMkgHmXyd8bfu8fWBmHwR2JFv2aOdOW-S2APM29fyj8eYAVEobrVfGupqQpn6pJYdZ4ViFHUyYhj1zFtRPi4Az_YGZTwsQ5wqfAo29K4N7IolBEsOig",
    },
    {
      step: "02",
      icon: <HandHeart size={28} />,
      title: "Người khác gửi yêu cầu",
      description:
        "Nhận thông báo ngay khi có người quan tâm đến món của bạn. Xem hồ sơ người nhận để đảm bảo món ăn đến đúng người cần.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBssLEUWgpXNxXVnEN6dC71ahsBdpTBYozWGcS3cpAEqsSmPBFfUK9XY9_ssz1i_8WY3h5fkiBDANFb8FqAmLWr3GUCgLxNv8VIg362Hvs6CjcYkmUyE-HflZisrmfI98na0pnIuKBgy6G-k_z-aEd4dx7Lky7zKZJoaPyQQrugIukGzrUTe7pyXlr1N_5eBBZJhN41-VIAC6XI1hzL53wraOLq8MF4w9lMvFJcG3edtDDcIHjy9kFmBjPtYysHzsnix0DoFQ6mRA",
    },
    {
      step: "03",
      icon: <CheckCircle size={28} />,
      title: "Gặp và hoàn tất",
      description:
        "Chat để chốt lịch hẹn, gặp nhau trao đổi món ăn và gửi đánh giá sau khi hoàn tất để xây dựng uy tín cộng đồng.",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCpVph294_O7mHqkgW7qYGiSJ_tcaJfTLVd-QvmuZhswEEylkIw5KKv3_nR3-HwxLE8grVjeMEid5aEDe8DHTJJCgK2zh6TVZdDkbGaqomtvaJt1xxsXEU94trurufMhDsgX225BXuDm_ZdjeZsMHQ6YbWEc4OEdEpd_3xNfMnDkyJB72Xghu8Tn8f4tIEx8hxTNj-omCjA8uVpmvoZjxF4VpFVaHltoIKV1tKXACE-7LdZG6ILm39a5SW_R_DvPUfvEZSd4K-qng",
    },
  ];

  return (
    <>
      <section id="how-it-works" className="px-6 py-16 md:px-20 lg:px-40 bg-background-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Quy trình chia sẻ
            </span>
            <h2 className="text-text-main text-3xl md:text-4xl font-extrabold mt-2">
              Chỉ 3 bước đơn giản
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Tham gia cộng đồng giảm lãng phí thực phẩm và giúp đỡ mọi người
              xung quanh chỉ với vài thao tác nhanh gọn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
        </div>
      </section>
      <ActionSection />
    </>
  );
};

export { StepCard, ActionSection };
export default HowItWorksSection;
