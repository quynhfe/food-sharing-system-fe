import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={hoverEffect ? { y: 0 } : undefined}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-white rounded-[32px] border border-gray-100 shadow-soft overflow-hidden ${className}`}
      {...props}>
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-8 pb-4 ${className}`}
    {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-xl font-bold text-text-main ${className}`}
    {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-8 pt-0 ${className}`}
    {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-8 pt-0 flex items-center ${className}`}
    {...props}>
    {children}
  </div>
);
