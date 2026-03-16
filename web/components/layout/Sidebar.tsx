"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  Globe,
  User,
  Settings,
} from "lucide-react";

import GreenShareLogo from "@/components/ui/GreenShareLogo";

const sidebarLinks = [
  { label: "Trang chủ", href: "/home", icon: Home },
  { label: "Khám phá", href: "/explore", icon: Search },
  { label: "Đăng món", href: "/create-post", icon: PlusCircle },
  { label: "Tin nhắn", href: "/messages", icon: MessageCircle },
  { label: "Tác động", href: "/impact", icon: Globe },
  { label: "Hồ sơ", href: "/profile", icon: User },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] fixed h-screen border-r border-border-green flex flex-col justify-between p-6 bg-white z-50">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <GreenShareLogo />

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-text-secondary hover:bg-primary/5"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Bottom */}
      <div className="flex items-center gap-3 p-2 border-t border-border-green pt-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-semibold truncate">Minh Anh</p>
          <p className="text-xs text-text-secondary truncate">Nhà hảo tâm</p>
        </div>
        <button className="text-text-secondary hover:text-primary">
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
