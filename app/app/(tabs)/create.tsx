// app/(tabs)/create.tsx
import React from 'react';
import { View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Camera, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../../components/ui/text';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function CreatePost() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white z-10 border-b border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
            <X size={24} color="#1A2E1A" />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-[#1A2E1A]">Tạo bài đăng</Text>
          <TouchableOpacity className="px-4 py-2 bg-[#2E7D32]/10 rounded-full" activeOpacity={0.7}>
            <Text className="text-[#2E7D32] font-bold text-sm">Đăng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 pb-120" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Khung ảnh */}
        <View className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 mb-8">
          <Image source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800" }} className="h-full w-full" />
          <View className="absolute inset-0 justify-end bg-black/20 p-4">
            <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 self-start shadow-sm" activeOpacity={0.8}>
              <Camera size={18} color="#1A2E1A" />
              <Text className="text-sm font-bold text-[#1A2E1A]">Đổi ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form nhập liệu */}
        <View className="flex-col gap-6 pb-8">
          <Input
            label="Tên món ăn *"
            placeholder="VD: Cơm tấm sườn bì chả"
            className="bg-[#F8FAF8] border-0"
          />

          <Textarea
            label="Mô tả"
            placeholder="Màu sắc, hương vị, tình trạng..."
            className="bg-[#F8FAF8] border-0"
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input
                label="Số lượng"
                keyboardType="numeric"
                placeholder="1"
                className="bg-[#F8FAF8] border-0 text-center font-bold"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Đơn vị"
                placeholder="Phần"
                className="bg-[#F8FAF8] border-0 text-center font-bold"
              />
            </View>
          </View>

          <Input
            label="Địa điểm lấy món *"
            placeholder="Chọn vị trí trên bản đồ"
            className="bg-[#F8FAF8] border-0 pr-12"
            endIcon={
              <TouchableOpacity className="w-10 h-10 bg-[#E8F5E9] rounded-xl items-center justify-center -mr-2">
                <MapPin color="#2E7D32" size={20} />
              </TouchableOpacity>
            }
          />

          {/* Dùng w-full thay vì fullWidth */}
          <Button className="w-full mt-6 h-14 shadow-xl shadow-[#2E7D32]/30 bg-[#2E7D32]" onPress={() => router.push('/(tabs)')}>
            <Text className="text-white font-extrabold text-lg">🌱 Đăng món ăn</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}