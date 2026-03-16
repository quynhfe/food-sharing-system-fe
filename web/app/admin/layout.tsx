"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Users, FileText, Settings, LogOut, ShieldCheck } from "lucide-react";

const adminSidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: Copy },
  { label: "Quản lý Người dùng", href: "/admin/users", icon: Users },
  { label: "Quản lý Bài đăng", href: "/admin/posts", icon: FileText },
  { label: "Cài đặt & Báo cáo", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Admin Sidebar */}
      <aside className="w-[240px] fixed h-screen bg-[#1A3A1A] text-white flex flex-col justify-between p-6 z-50">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">GreenAdmin</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {adminSidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary font-semibold"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info Bottom */}
        <div className="flex items-center gap-3 pt-6 border-t border-white/10">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="font-bold text-sm">AM</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold truncate text-white">Admin Manager</p>
            <p className="text-xs text-white/60 truncate">Super Admin</p>
          </div>
          <button className="text-danger hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Admin Header Navbar */}
        <header className="h-[72px] bg-white border-b border-border-green flex items-center justify-between px-8 shrink-0 z-40">
          <h2 className="text-xl font-bold text-text-main">
            {adminSidebarLinks.find((l) => l.href === pathname)?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
              Xem trang web
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-surface">{children}</div>
      </main>
    </div>
  );
}
