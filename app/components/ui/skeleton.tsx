import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({
  width,
  height,
  className = "",
  style,
}: SkeletonProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const translateX = useSharedValue(-500);

  useEffect(() => {
    if (layoutWidth === 0) return;

    translateX.value = -layoutWidth;

    translateX.value = withRepeat(
      withTiming(layoutWidth, { duration: 1500 }),
      -1,
      false,
    );
  }, [layoutWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className={`bg-slate-200 overflow-hidden rounded-lg ${className}`}
      style={[{ width, height }, style]}
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}>
      {layoutWidth > 0 && (
        <AnimatedLinearGradient
          colors={["transparent", "rgba(255,255,255, 0.4)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            {
              width: "100%",
              height: "100%",
              position: "absolute",
            },
            animatedStyle,
          ]}
        />
      )}
    </View>
  );
};
