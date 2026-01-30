import React from "react";

interface ChipProps {
  children: React.ReactNode;
  variant?: "solid" | "flat" | "outline";
  color?: "primary" | "success" | "warning" | "danger" | "default";
  size?: "sm" | "md" | "lg";
  startContent?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = "flat",
  color = "default",
  size = "md",
  startContent,
  className = ""
}) => {
  const variants = {
    solid: {
      primary: "bg-primary text-white border-transparent",
      success: "bg-green-500 text-white border-transparent",
      warning: "bg-yellow-500 text-white border-transparent",
      danger: "bg-red-500 text-white border-transparent",
      default: "bg-gray-500 text-white border-transparent"
    },
    flat: {
      primary: "bg-primary/10 text-primary border-transparent",
      success: "bg-green-100 text-green-700 border-transparent",
      warning: "bg-yellow-100 text-yellow-700 border-transparent",
      danger: "bg-red-100 text-red-700 border-transparent",
      default: "bg-gray-100 text-gray-700 border-transparent"
    },
    outline: {
      primary: "border-primary text-primary bg-transparent",
      success: "border-green-500 text-green-700 bg-transparent",
      warning: "border-yellow-500 text-yellow-700 bg-transparent",
      danger: "border-red-500 text-red-700 bg-transparent",
      default: "border-gray-300 text-gray-700 bg-transparent"
    }
  };

  const sizes = {
    sm: "h-6 px-2 text-xs",
    md: "h-7 px-3 text-sm",
    lg: "h-8 px-4 text-base"
  };

  return (
    <div
      className={`inline-flex items-center justify-center box-border appearance-none whitespace-nowrap font-medium rounded-full border ${variants[variant][color]} ${sizes[size]} ${className}`}>
      {startContent && (
        <span className="mr-1 flex items-center justify-center">
          {startContent}
        </span>
      )}
      <span className="flex-1 text-inherit font-normal px-1">{children}</span>
    </div>
  );
};
