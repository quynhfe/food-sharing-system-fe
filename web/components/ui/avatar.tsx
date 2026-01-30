import React from "react";

interface AvatarProps {
  src: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  className = "",
  size = "md"
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden border-2 border-white bg-gray-200 ${sizes[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const AvatarGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  max?: number;
}> = ({ children, className = "", max }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const remaining = max ? childrenArray.length - max : 0;

  return (
    <div className={`flex items-center -space-x-3 ${className}`}>
      {visibleChildren}
      {remaining > 0 && (
        <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-text-secondary hover:bg-gray-200 transition-colors z-10">
          +{remaining}
        </div>
      )}
    </div>
  );
};
