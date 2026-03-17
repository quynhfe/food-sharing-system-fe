import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { View, ViewProps } from "react-native";
import { Text } from "./text";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "flex-row items-center self-start rounded-full px-3 py-1 w-fit gap-1",
    {
        variants: {
            variant: {
                default: "bg-[#2E7D32]/10 border border-[#2E7D32]/20",
                success: "bg-green-100 border border-green-200",
                destructive: "bg-red-100 border border-red-200",
            }
        },
        defaultVariants: { variant: "default" }
    }
);

const badgeTextVariants = cva("text-[11px] font-extrabold uppercase tracking-wider", {
    variants: {
        variant: {
            default: "text-[#2E7D32]",
            success: "text-green-700",
            destructive: "text-red-600",
        }
    },
    defaultVariants: { variant: "default" }
});

interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
    label: string;
    textClassName?: string;
}

const Badge = React.forwardRef<View, BadgeProps>(
    ({ className, variant, label, textClassName, ...props }, ref) => (
        <View ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
            <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
                {label}
            </Text>
        </View>
    )
);
Badge.displayName = "Badge";
export { Badge, badgeVariants };