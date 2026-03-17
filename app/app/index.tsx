// app/index.tsx (Splash Screen)
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '../components/ui/text';
import { Leaf } from 'lucide-react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { authService } from '../services/authService';

export default function Splash() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Small pause for the splash animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const user = await authService.getCurrentUser();
      
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    };
    
    checkAuthAndRedirect();
  }, []);

  return (
    <View className="flex flex-col items-center justify-center h-full bg-[#F8FAF8] relative">
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        className="flex flex-col items-center gap-6 z-10"
      >
        <View className="w-20 h-20 bg-[#2E7D32] rounded-full flex items-center justify-center shadow-lg shadow-[#2E7D32]/20">
          <Leaf size={40} className="text-white" />
        </View>
        <View className="flex flex-col items-center gap-2">
          <Text className="text-[#2E7D32] text-[32px] font-bold leading-none tracking-tight">FoodShare</Text>
          <Text className="text-slate-500 text-base font-medium text-center max-w-[280px]">
            Chia sẻ thực phẩm – Tạo tác động
          </Text>
        </View>
      </MotiView>
      <View className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#2E7D32]/10 rounded-full blur-3xl"></View>
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-[#2E7D32]/10 rounded-full blur-3xl"></View>
    </View>
  );
}