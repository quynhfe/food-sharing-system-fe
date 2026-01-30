"use client";
import React, { useState, useEffect } from "react";
import { Leaf, Search, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    "Home",
    "Browse Food",
    "Post Food",
    "How It Works",
    "About"
  ];

  return (
    <header
      className={`sticky py-5 top-0 left-0 right-0 z-50 h-[80px] transition-all duration-300 flex items-center justify-center border-b ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm"
          : "bg-white border-transparent"
      }`}>
      <div className="w-full max-w-[1440px] px-6 lg:px-[120px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="flex items-center justify-center text-primary w-8 h-8 rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
            <Leaf
              size={20}
              fill="currentColor"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            FoodShare
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-text-main hover:text-primary transition-colors relative group">
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light text-text-main transition-colors">
            <Search size={20} />
          </button>
          <button
            aria-label="Notifications"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light text-text-main transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwou34U3n_DG3jtuQUParBJjBhqA93cXkpBgdvbDL_fx98D7hYE1u-Xfl1wpaUvoTEbq4ObQdy0peq3xn707fT2hjFVsQeWRoNbcUQozH8S3FeKHHsfj5iNVeInUbJPyqNXUhCg0nuujEIgLni5DNKY0Zst1v01a2_wQaLoTcIaL1rFHKGm3B-83I1jw6fYr2Bly-V3KITHUfEsHc-5VtHaU0u3F1xE_SGgprm76xfl6arZUL-OiHLLutVfZ0m-vDd38du2chcdAI"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light text-text-main"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[80px] left-0 w-full bg-white border-b border-gray-100 shadow-lg lg:hidden p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-lg font-medium text-text-main hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}>
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
