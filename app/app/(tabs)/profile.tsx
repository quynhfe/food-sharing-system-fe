// app/(tabs)/profile.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Award, Leaf, Heart, ChevronRight, LogOut, Package } from 'lucide-react-native';
import { Text } from '../../components/ui/text';
import { Card } from '../../components/ui/card';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View
          className="bg-[#2E7D32] rounded-b-[40px] px-6 pb-12 pt-8 relative overflow-hidden"
          style={{ paddingTop: Math.max(insets.top, 20) }}
        >
          <View className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-extrabold text-white">Hồ sơ 👤</Text>
            <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-full items-center justify-center backdrop-blur-md" activeOpacity={0.8}>
              <Settings size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-5">
            <View className="relative">
              <Image source={{ uri: "https://i.pravatar.cc/150?img=11" }} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" />
              <View className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-white mb-1">Nguyễn Văn A</Text>
              <Text className="text-white/80 font-medium mb-2">Thành viên từ Th10 2023</Text>
              <View className="bg-white/20 self-start px-3 py-1 rounded-full flex-row items-center gap-1.5">
                <Award size={14} color="#FDE047" />
                <Text className="text-white font-bold text-xs">Người tiên phong</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInUp.duration(600).delay(100)} className="px-6 -mt-8">
          <Card className="border-0 bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 flex-row justify-between">
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-[#E8F5E9] rounded-full items-center justify-center mb-2">
                <Package size={24} color="#2E7D32" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">42</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Đã chia sẻ</Text>
            </View>
            <View className="w-px bg-slate-100 mx-2" />
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                <Heart size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">15</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Đã nhận</Text>
            </View>
            <View className="w-px bg-slate-100 mx-2" />
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-amber-50 rounded-full items-center justify-center mb-2">
                <Leaf size={24} color="#F59E0B" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">12kg</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Đã cứu</Text>
            </View>
          </Card>
        </Animated.View>

        <View className="px-6 mt-8 gap-4">
          <Text className="text-xl font-extrabold text-[#1A2E1A] mb-2">Tài khoản</Text>

          {[
            { icon: Package, label: 'Bài đăng của tôi', color: '#3B82F6', bg: 'bg-blue-50' },
            { icon: Heart, label: 'Yêu cầu của tôi', color: '#EC4899', bg: 'bg-pink-50' },
            { icon: Award, label: 'Huy hiệu & Thành tích', color: '#F59E0B', bg: 'bg-amber-50' },
          ].map((item, index) => (
            <Animated.View key={index} entering={FadeInRight.duration(500).delay(index * 100)}>
              <TouchableOpacity activeOpacity={0.8} className="flex-row items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
                <View className="flex-row items-center gap-4">
                  <View className={`w-12 h-12 ${item.bg} rounded-full items-center justify-center`}>
                    <item.icon size={22} color={item.color} />
                  </View>
                  <Text className="font-bold text-base text-[#1A2E1A]">{item.label}</Text>
                </View>
                <View className="w-10 h-10 bg-[#F8FAF8] rounded-full items-center justify-center">
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          <TouchableOpacity activeOpacity={0.8} className="flex-row items-center gap-4 bg-red-50 p-4 rounded-[24px] mt-4 border border-red-100">
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
              <LogOut size={22} color="#EF5350" />
            </View>
            <Text className="font-bold text-base text-red-500">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}