// components/ui/textarea.tsx
import * as React from "react";
import { TextInput, type TextInputProps, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./text";

interface TextareaProps extends TextInputProps {
    label?: string;
    labelClassName?: string;
    containerClassName?: string;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
    ({ className, placeholderClassName, label, labelClassName, containerClassName, ...props }, ref) => {
        const textareaElement = (
            <TextInput
                ref={ref}
                className={cn(
                    "flex min-h-[120px] w-full rounded-2xl border border-slate-100 bg-[#F8FAF8] px-5 py-4 text-base font-medium text-[#1A2E1A] shadow-sm",
                    props.editable === false && "opacity-50",
                    className
                )}
                style={{ fontFamily: 'Inter_500Medium' }}
                placeholderTextColor="#94A3B8"
                multiline={true}
                textAlignVertical="top"
                {...props}
            />
        );

        if (label) {
            return (
                <View className={cn("w-full gap-2", containerClassName)}>
                    <Text className={cn("text-sm font-extrabold text-[#1A2E1A] ml-1", labelClassName)}>
                        {label}
                    </Text>
                    {textareaElement}
                </View>
            );
        }

        return textareaElement;
    }
);

Textarea.displayName = "Textarea";
export { Textarea };