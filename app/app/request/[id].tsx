// app/food/[id].tsx (hoặc file hiển thị Request Status)
import React from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, Check, Hourglass } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';

export default function RequestStatus() {
  const params = useLocalSearchParams();
  const food = {
    title: params.title as string || 'Bánh mì thịt nướng',
    poster: { name: params.posterName as string || 'Nguyễn Văn A' },
    image: params.image as string || 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'
  };

  return (
    <View className="flex-1 bg-white relative">
      <View className="flex-row items-center p-4 pt-12">
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100" activeOpacity={0.7}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-bold text-slate-900">Trạng thái yêu cầu</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-col items-center px-6 py-8">
          <View className="relative mb-6">
            <View className="absolute inset-0 rounded-full bg-amber-100 opacity-75"></View>
            <View className="relative h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Text className="text-3xl">⏳</Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center rounded-full bg-amber-50 px-4 py-1.5 border border-amber-100">
            <Text className="text-xs font-bold uppercase tracking-wider text-amber-700">Đang chờ xác nhận</Text>
          </View>

          <Text className="mb-8 text-center text-2xl font-bold leading-tight text-slate-900">Yêu cầu đang được{"\n"}xử lý</Text>

          <View className="mb-10 flex-row w-full items-center justify-between px-2">
            <View className="flex-col items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]">
                <Check size={16} color="#ffffff" />
              </View>
              <Text className="text-[10px] font-medium text-slate-500">Đã gửi</Text>
            </View>
            <View className="h-[2px] flex-1 bg-[#2E7D32] mx-1 mb-6"></View>
            <View className="flex-col items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                <Hourglass size={16} color="#ffffff" />
              </View>
              <Text className="text-[10px] font-bold text-amber-600">Xác nhận</Text>
            </View>
            <View className="h-[2px] flex-1 bg-slate-200 mx-1 mb-6"></View>
            <View className="flex-col items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-transparent">
                <View className="w-2 h-2 rounded-full bg-slate-300"></View>
              </View>
              <Text className="text-[10px] font-medium text-slate-400">Hoàn tất</Text>
            </View>
          </View>

          <View className="mb-6 w-full rounded-xl bg-white shadow-sm border border-slate-100 flex-row items-center p-3 gap-4">
            <Image source={{ uri: food.image }} className="h-16 w-16 shrink-0 rounded-lg" />
            <View className="flex-col gap-0.5 flex-1">
              <Text className="font-bold text-slate-900">{food.title}</Text>
              <Text className="text-sm text-slate-500">Người đăng: <Text className="font-medium text-[#2E7D32]">{food.poster.name}</Text></Text>
            </View>
          </View>

          <Text className="mb-8 text-center text-sm leading-relaxed text-slate-500">
            Bạn sẽ nhận được thông báo ngay khi người đăng phản hồi yêu cầu của bạn.
          </Text>

          <View className="flex-col w-full gap-4">
            <Button onPress={() => router.replace('/(tabs)')} className="w-full shadow-sm shadow-[#2E7D32]/20">← Về trang chủ</Button>
            <TouchableOpacity className="w-full py-2 items-center" activeOpacity={0.7}>
              <Text className="text-sm font-semibold text-red-500">Hủy yêu cầu này</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}