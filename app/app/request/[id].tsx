import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Hourglass, Check, Circle, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function RequestStatusScreen() {
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-light" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white items-center justify-center border border-border-green shadow-sm shadow-black/5">
          <ArrowLeft size={20} color="#1a2e1a" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center px-5">
        <View className="bg-white rounded-2xl border border-border-green overflow-hidden shadow-sm shadow-black/5">
          {/* Status Icon */}
          <View className="items-center pt-10 pb-6">
            <View className="w-16 h-16 bg-yellow-400 rounded-full items-center justify-center mb-4">
              <Hourglass size={28} color="#ffffff" />
            </View>
            <View className="bg-yellow-100 px-3 py-1 rounded-full mb-2">
              <Text className="text-xs font-bold text-yellow-700 uppercase">Đang chờ xác nhận</Text>
            </View>
            <Text className="text-xl font-bold text-text-main">Yêu cầu đang được xử lý</Text>
          </View>

          {/* Food Summary */}
          <View className="mx-6 p-4 bg-primary-light/50 rounded-xl flex-row items-center gap-4 mb-6">
            <View className="w-14 h-14 bg-primary/10 rounded-xl items-center justify-center">
              <Text className="text-2xl">🍚</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-text-main">Cơm tấm sườn bì chả</Text>
              <Text className="text-xs text-text-secondary mt-1">Người đăng: Nguyễn Thị Lan</Text>
            </View>
          </View>

          {/* Timeline */}
          <View className="mx-6 mb-6">
            <View className="flex-row items-start">
              {/* Step 1 - Completed */}
              <View className="flex-1 items-center">
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Check size={16} color="#ffffff" />
                </View>
                <Text className="text-[10px] text-text-secondary mt-2 text-center">Yêu cầu{'\n'}đã gửi</Text>
              </View>
              <View className="w-12 h-0.5 bg-primary mt-4" />

              {/* Step 2 - Current */}
              <View className="flex-1 items-center">
                <View className="w-8 h-8 rounded-full border-2 border-yellow-400 bg-yellow-50 items-center justify-center">
                  <Hourglass size={14} color="#f59e0b" />
                </View>
                <Text className="text-[10px] text-yellow-600 font-bold mt-2 text-center">Chờ{'\n'}xác nhận</Text>
              </View>
              <View className="w-12 h-0.5 bg-gray-200 mt-4" />

              {/* Step 3 - Pending */}
              <View className="flex-1 items-center">
                <View className="w-8 h-8 rounded-full border-2 border-gray-200 items-center justify-center">
                  <Circle size={14} color="#d1d5db" />
                </View>
                <Text className="text-[10px] text-text-secondary mt-2 text-center">Hoàn{'\n'}tất</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 pb-8">
            <Text className="text-xs text-text-secondary text-center mb-6">
              Chúng tôi sẽ thông báo cho bạn ngay khi người đăng phản hồi.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="bg-primary rounded-xl py-3.5 items-center flex-row justify-center gap-2 mb-3"
            >
              <ArrowLeft size={16} color="#ffffff" />
              <Text className="text-white font-bold">Quay lại trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center py-2">
              <Text className="text-text-secondary text-sm underline">Hủy yêu cầu này</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
