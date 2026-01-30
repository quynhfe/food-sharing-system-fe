import React from "react";
import { Leaf, Twitter, Instagram, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-10">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-gray-800 pb-12 mb-10">
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary">
              <Leaf
                size={32}
                fill="currentColor"
              />
              <span className="text-2xl font-bold text-white">FoodShare</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Building a sustainable future by connecting neighbors and reducing
              food waste together.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              {[
                "About Us",
                "How It Works",
                "Browse Listings",
                "Community Guidelines"
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-bold mb-6 text-white">
              Connect With Us
            </h4>
            <div className="flex gap-4 mb-8">
              {[
                <Twitter size={20} />,
                <Instagram size={20} />,
                <Facebook size={20} />
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all hover:scale-110">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 FoodShare. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
