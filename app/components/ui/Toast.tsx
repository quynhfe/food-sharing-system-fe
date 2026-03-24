import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  visible, 
  onHide, 
  duration = 3000 
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    if (visible) {
      translateY.value = 0;
      opacity.value = 1;
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
        opacity.value = 1 + event.translationY / 100;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -40 || event.velocityY < -500) {
        translateY.value = withTiming(-100, { duration: 200 }, () => {
          runOnJS(onHide)();
        });
      } else {
        translateY.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="#059669" />;
      case 'error': return <AlertCircle size={20} color="#DC2626" />;
      case 'info': return <Info size={20} color="#2563EB" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', iconBg: 'bg-emerald-100/50' };
      case 'error': return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', iconBg: 'bg-red-100/50' };
      case 'info': return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', iconBg: 'bg-blue-100/50' };
    }
  };

  const styles = getStyles();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        entering={FadeInUp.springify()} 
        exiting={FadeOutUp}
        layout={Layout.springify()}
        className={`absolute left-4 right-4 z-[999] p-4 rounded-2xl flex-row items-center gap-3 border shadow-lg ${styles.bg} ${styles.border}`}
        style={[{ top: Math.max(insets.top, 20) }, animatedStyle]}
      >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${styles.iconBg}`}>
          {getIcon()}
        </View>
        <View className="flex-1">
          <Text className={`font-bold text-sm ${styles.text}`}>{message}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => onHide()}
          className="w-8 h-8 items-center justify-center rounded-full bg-black/5"
        >
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};
