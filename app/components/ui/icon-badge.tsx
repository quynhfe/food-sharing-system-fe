// components/ui/icon-badge.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import { cn } from "../../lib/utils";

interface IconBadgeProps {
    children: React.ReactNode;
    count?: number;
    showZero?: boolean;
    showOne?: boolean;
    dotOnly?: boolean;
    position?: "top-right" | "top-left" | "bottom-right";
    className?: string;
}

export const IconBadge = ({
    children,
    count = 0,
    showZero = false,
    showOne = false,
    dotOnly = false,
    position = "top-right",
    className
}: IconBadgeProps) => {
    if (!dotOnly && !showZero && count === 0) return <View>{children}</View>;
    if (!dotOnly && !showOne && count === 1) return <View>{children}</View>;

    const displayCount = count > 99 ? "99+" : count;
    const positionClasses = {
        "top-right": "-top-1.5 -right-1.5",
        "top-left": "-top-1.5 -left-1.5",
        "bottom-right": "-bottom-1.5 -right-1.5"
    };

    return (
        <View className="relative">
            {children}
            <View
                className={cn(
                    "absolute items-center justify-center bg-[#EF5350] border-2 border-white z-10",
                    positionClasses[position],
                    dotOnly ? "w-3 h-3 rounded-full" : "min-w-[20px] h-5 rounded-full px-1",
                    className
                )}
            >
                {!dotOnly && (
                    <Text className="text-white text-[10px] font-extrabold leading-none">
                        {displayCount}
                    </Text>
                )}
            </View>
        </View>
    );
};