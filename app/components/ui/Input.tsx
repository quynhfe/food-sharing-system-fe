import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./text";

interface InputCustomProps extends TextInputProps {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    label?: string;
    labelClassName?: string;
    containerClassName?: string;
}

const Input = React.forwardRef<TextInput, InputCustomProps>(
    ({ className, startIcon, endIcon, label, labelClassName, containerClassName, ...props }, ref) => {
        const inputElement = (
            <View
                className={cn(
                    "flex-row items-center w-full bg-[#F8FAF8] rounded-2xl px-5 border border-slate-100 shadow-sm min-h-[56px]",
                    props.editable === false && "opacity-50",
                    className
                )}
            >
                {startIcon && <View className="mr-3">{startIcon}</View>}
                <TextInput
                    ref={ref}
                    style={{ flex: 1, textAlignVertical: "center", padding: 0, fontSize: 16, fontFamily: 'Inter_500Medium' }}
                    className="text-[#1A2E1A] font-medium"
                    placeholderTextColor="#94A3B8"
                    {...props}
                />
                {endIcon && <View className="ml-3">{endIcon}</View>}
            </View>
        );

        if (label) {
            return (
                <View className={cn("w-full gap-2", containerClassName)}>
                    <Text className={cn("text-sm font-extrabold text-[#1A2E1A] ml-1", labelClassName)}>
                        {label}
                    </Text>
                    {inputElement}
                </View>
            );
        }

        return inputElement;
    }
);
Input.displayName = "Input";
export { Input };