import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";
import { TextClassContext } from "./text";

const Card = React.forwardRef<View, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn("rounded-[28px] border border-slate-100 bg-white shadow-lg shadow-slate-200/40", className)}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<View, ViewProps>(
    ({ className, ...props }, ref) => (
        <TextClassContext.Provider value="text-[#1A2E1A]">
            <View ref={ref} className={cn("p-5 pt-0", className)} {...props} />
        </TextClassContext.Provider>
    )
);
CardContent.displayName = "CardContent";

export { Card, CardContent };