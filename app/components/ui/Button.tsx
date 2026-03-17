// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { Text, TextClassContext } from "./text";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "group flex flex-row gap-2 items-center justify-center web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-[#2E7D32] rounded-[32px] py-4 shadow-md shadow-[#2E7D32]/20 web:hover:opacity-90 active:opacity-90",
                destructive: "bg-[#EF5350] rounded-[32px] py-4 shadow-md shadow-red-500/20 web:hover:opacity-90 active:opacity-90",
                outline: "border-[1.5px] border-[#2E7D32] bg-white rounded-[32px] py-4 web:hover:bg-[#2E7D32]/10 active:bg-[#2E7D32]/10",
                secondary: "bg-[#F1F5F1] rounded-[32px] py-4 web:hover:opacity-80 active:opacity-80",
                ghost: "rounded-[32px] py-4 web:hover:bg-slate-100 active:bg-slate-100",
                link: "web:underline-offset-4 web:hover:underline web:focus:underline"
            },
            size: {
                default: "px-6 py-4",
                sm: "px-4 py-2.5",
                lg: "px-8 py-5",
                icon: "w-14 h-14 rounded-full"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

const buttonTextVariants = cva("font-extrabold text-center", {
    variants: {
        variant: {
            default: "text-white",
            destructive: "text-white",
            outline: "text-[#2E7D32]",
            secondary: "text-[#1A2E1A]",
            ghost: "text-[#1A2E1A]",
            link: "text-[#2E7D32]"
        },
        size: {
            default: "text-base",
            sm: "text-sm",
            lg: "text-lg",
            icon: ""
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
    VariantProps<typeof buttonVariants> & {
        textClassName?: string;
        startIcon?: React.ReactNode;
        endIcon?: React.ReactNode;
        children?: React.ReactNode;
    };

const Button = React.forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
    ({ className, variant, size, textClassName, startIcon, endIcon, children, ...props }, ref) => {
        return (
            <TextClassContext.Provider
                value={cn(
                    buttonTextVariants({ variant, size }),
                    textClassName,
                    "web:pointer-events-none"
                )}
            >
                <Pressable
                    ref={ref}
                    role="button"
                    className={cn(
                        props.disabled && "opacity-50 web:pointer-events-none",
                        buttonVariants({ variant, size }),
                        className
                    )}
                    {...props}
                >
                    {startIcon}
                    {typeof children === "string" || typeof children === "number" ? (
                        <Text>{children}</Text>
                    ) : (
                        children
                    )}
                    {endIcon}
                </Pressable>
            </TextClassContext.Provider>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants, buttonTextVariants };