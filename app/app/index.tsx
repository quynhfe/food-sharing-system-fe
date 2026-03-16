import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Leaf } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    // Auto navigate after 2 seconds
    const timer = setTimeout(() => {
      // In a real app, this would check secure store for auth / onboarding status
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAF8] items-center justify-center relative overflow-hidden" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-col items-center gap-6 px-6 z-10">
        {/* Logo Icon Container */}
        <View className="relative flex items-center justify-center">
          <View className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <Leaf size={40} color="white" fill="white" />
          </View>
        </View>

        {/* Brand Typography */}
        <View className="flex-col items-center gap-2">
          <Text className="text-[#2E7D32] text-3xl font-bold tracking-tight">
            GreenShare
          </Text>
          <Text className="text-[#5A7A5A] text-base font-normal text-center max-w-[280px]">
            Chia sẻ thực phẩm – Tạo tác động
          </Text>
        </View>
      </View>

      {/* Decorative Background Elements */}
      <View className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
    </View>
  );
}
