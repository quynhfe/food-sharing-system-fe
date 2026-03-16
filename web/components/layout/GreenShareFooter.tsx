import React from "react";
import { Leaf, Twitter, Instagram, Facebook, Mail } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border-green py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-border-green pb-10 mb-8">
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Leaf size={28} fill="currentColor" />
              <span className="text-xl font-bold">GreenShare</span>
            </div>
            <p className="text-text-secondary leading-relaxed max-w-sm text-sm">
              Hành động nhỏ cho hành tinh xanh. Chúng ta cùng nhau giảm thiểu
              lãng phí thực phẩm tại Việt Nam.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4">
            <h4 className="text-base font-bold mb-4 text-text-main">
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Về chúng tôi", href: "#" },
                { label: "Cách hoạt động", href: "/#how-it-works" },
                { label: "Khám phá món ăn", href: "/feed" },
                { label: "Quy tắc cộng đồng", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <h4 className="text-base font-bold mb-4 text-text-main">
              Kết nối với chúng tôi
            </h4>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={18} />, href: "#" },
                { icon: <Instagram size={18} />, href: "#" },
                { icon: <Facebook size={18} />, href: "#" },
                { icon: <Mail size={18} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-secondary">
          <p>© 2025 GreenShare VN. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
