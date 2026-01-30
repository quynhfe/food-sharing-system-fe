"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
    secondary: "bg-surface-light text-text-main hover:bg-gray-200",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost:
      "text-text-secondary hover:text-primary hover:bg-primary/5 shadow-none"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    icon: "h-10 w-10 p-0"
  };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {isLoading ? (
        <span className="mr-2 animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}

      {children}

      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
