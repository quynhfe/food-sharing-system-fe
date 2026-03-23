// components/ui/Toast.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, View, Text, Platform } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const toastConfig: Record<ToastType, { bg: string; icon: React.ReactNode; border: string }> = {
  success: {
    bg: '#F0FDF4',
    border: '#22C55E',
    icon: <CheckCircle size={20} color="#16A34A" />,
  },
  error: {
    bg: '#FEF2F2',
    border: '#EF4444',
    icon: <XCircle size={20} color="#DC2626" />,
  },
  warning: {
    bg: '#FFFBEB',
    border: '#F59E0B',
    icon: <AlertCircle size={20} color="#D97706" />,
  },
  info: {
    bg: '#EFF6FF',
    border: '#3B82F6',
    icon: <Info size={20} color="#2563EB" />,
  },
};

export function Toast({ visible, message, type = 'info', duration = 3000, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [opacity, translateY, onHide]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => hide(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, hide]);

  if (!visible) return null;

  const config = toastConfig[type];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'web' ? 24 : 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: config.bg,
          borderLeftWidth: 4,
          borderLeftColor: config.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {config.icon}
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: '#1e293b', lineHeight: 20 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
