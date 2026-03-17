// components/ui/text.tsx
import * as React from "react";
import { Text as RNText, Platform } from "react-native";
import { cn } from "../../lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<RNText, React.ComponentProps<typeof RNText>>(
  ({ className, style, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);

    const combinedClass = cn(textClass, className || "");
    let fontFamily = "Inter_400Regular";

    if (combinedClass.includes("font-medium")) fontFamily = "Inter_500Medium";
    if (combinedClass.includes("font-semibold"))
      fontFamily = "Inter_600SemiBold";
    if (
      combinedClass.includes("font-bold") &&
      !combinedClass.includes("font-extrabold")
    )
      fontFamily = "Inter_700Bold";
    if (combinedClass.includes("font-extrabold"))
      fontFamily = "Inter_800ExtraBold";

    return (
      <RNText
        ref={ref}
        className={cn("text-base text-[#1A2E1A]", textClass, className)}
        style={[
          {
            fontFamily,
            includeFontPadding: false
          },
          style
        ]}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextClassContext };
