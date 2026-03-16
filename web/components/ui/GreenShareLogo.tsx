import React from "react";
import { Leaf } from "lucide-react";
import Link from "next/link";

interface GreenShareLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const GreenShareLogo: React.FC<GreenShareLogoProps> = ({
  size = "md",
  showText = true,
}) => {
  const sizes = {
    sm: { icon: 16, text: "text-lg", container: "w-8 h-8" },
    md: { icon: 20, text: "text-xl", container: "w-10 h-10" },
    lg: { icon: 28, text: "text-2xl", container: "w-12 h-12" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div
        className={`${s.container} bg-primary rounded-full flex items-center justify-center text-white`}
      >
        <Leaf size={s.icon} fill="currentColor" />
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-primary`}>
          GreenShare
        </span>
      )}
    </Link>
  );
};

export default GreenShareLogo;
