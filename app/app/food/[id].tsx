// app/food/[id].tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { ArrowLeft, Heart, MapPin, Clock, Calendar, MessageCircle, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Text } from '../../components/ui/text';
import { Badge } from '../../components/ui/badge';
import { formatDistance, formatTimeLeft } from '../../utils/helpers';
import { Button } from '@/components/ui/Button';

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [showConfirm, setShowConfirm] = useState(false);

  // Mock data fallback
  const food = {
    id: id as string || '1',
    title: 'Salad Ức Gà Áp Chảo & Hạt Quinoa',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    poster: { name: 'Lê Minh Anh', avatar: 'https://i.pravatar.cc/150?img=9' },
    distance: 0.8,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hình ảnh và Header */}
        <View className="relative h-[320px] w-full">
          <Image source={{ uri: food.image }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />

          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: Math.max(insets.top, 20) }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/30"
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/30"
              activeOpacity={0.8}
            >
              <Heart size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nội dung chính */}
        <View className="flex-1 -mt-8 rounded-t-[40px] bg-white px-6 pt-5 pb-32 z-10">
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <View className="flex-row items-center gap-3 mb-5">
            <Badge label="Còn nhận" variant="success" />
            <View className="flex-row h-7 items-center gap-1.5 rounded-full bg-[#F8FAF8] px-3 border border-slate-100">
              <MapPin size={14} color="#64748B" />
              <Text className="text-xs font-bold text-slate-600">{formatDistance(food.distance)}</Text>
            </View>
          </View>

          <Text className="mb-3 text-[24px] font-extrabold leading-tight text-[#1A2E1A]">{food.title}</Text>

          <Text className="mb-6 text-base leading-relaxed text-slate-600 font-medium">
            Món ăn đầy đủ dinh dưỡng với ức gà áp chảo, hạt quinoa, bơ sáp và các loại rau xanh hữu cơ sạch từ vườn nhà. Thích hợp cho người đang ăn kiêng...
            <Text className="font-extrabold text-[#2E7D32] ml-1"> Xem thêm</Text>
          </Text>

          <View className="flex-row items-center justify-between border-y border-slate-100 py-5 mb-6">
            <View className="flex-col items-center gap-1.5">
              <Text className="text-xl">🍽️</Text>
              <Text className="text-sm font-bold text-[#1A2E1A]">3 phần</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Clock size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">{formatTimeLeft(food.expiresAt)}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Calendar size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">HSD {formatDate(food.expiresAt)}</Text>
            </View>
          </View>

          {/* User Card */}
          <View className="flex-row items-center justify-between rounded-[24px] border border-slate-100 bg-[#F8FAF8] p-4 mb-6 shadow-sm shadow-slate-100">
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: food.poster.avatar }} className="w-12 h-12 rounded-full bg-slate-200" />
              <View>
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Text className="text-base font-bold text-[#1A2E1A]">{food.poster.name}</Text>
                  <CheckCircle size={16} color="#3B82F6" />
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-extrabold text-[#2E7D32]">⭐ 94/100 Trust</Text>
                  <Text className="text-slate-300">•</Text>
                  <Text className="text-xs font-bold text-slate-500">23 lần chia sẻ</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="rounded-full bg-[#2E7D32]/10 px-4 py-2" activeOpacity={0.7}>
              <Text className="text-xs font-extrabold text-[#2E7D32]">Theo dõi</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View className="flex-row items-start gap-3 bg-white p-4 rounded-[24px] border border-slate-100">
            <View className="w-10 h-10 rounded-full bg-[#F8FAF8] items-center justify-center">
              <MapPin size={20} color="#2E7D32" />
            </View>
            <View className="flex-1 justify-center pt-0.5">
              <Text className="text-base font-extrabold text-[#1A2E1A] mb-1">Quận 1, TP.HCM</Text>
              <Text className="text-sm font-medium text-slate-500 leading-relaxed">Nhận tại sảnh chung cư Vinhome Golden River</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/90 backdrop-blur-xl px-6 py-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-row gap-3">
          <Button
            variant="outline"
            className="w-14 h-14 p-0 items-center justify-center rounded-2xl bg-[#F8FAF8] border-slate-200"
          >
            <MessageCircle size={24} color="#1A2E1A" />
          </Button>
          <Button
            className="flex-1 h-14 rounded-2xl bg-[#2E7D32] shadow-xl shadow-[#2E7D32]/30"
            onPress={() => setShowConfirm(true)}
          >
            <Text className="text-white font-extrabold text-lg">Yêu cầu nhận ngay</Text>
          </Button>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onPress={() => setShowConfirm(false)}
          />
          <Animated.View
            entering={SlideInDown.duration(400).springify()}
            className="bg-white rounded-t-[40px] px-6 pt-4 pb-10 z-40 max-h-[80%]"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
            <View className="items-center mb-8">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </View>

            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-[#2E7D32]/10 rounded-full items-center justify-center mb-6 border-4 border-[#F8FAF8] shadow-sm">
                <Text className="text-4xl">🤝</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A] text-center mb-4">Xác nhận yêu cầu?</Text>
              <Text className="text-slate-500 text-center text-base leading-relaxed font-medium px-2">
                Bạn đang yêu cầu nhận món <Text className="font-extrabold text-[#2E7D32]">{food.title}</Text> từ <Text className="font-extrabold text-[#1A2E1A]">{food.poster.name}</Text>. Người đăng sẽ xem xét và phản hồi sớm nhất.
              </Text>
            </View>

            <View className="w-full gap-3">
              <Button
                className="w-full h-14 rounded-2xl bg-[#2E7D32] shadow-lg shadow-[#2E7D32]/20"
                onPress={() => {
                  setShowConfirm(false);
                  router.push({ pathname: '/food/[id]', params: { id: food.id } }); // Điều hướng tới màn trạng thái
                }}
              >
                <Text className="text-white font-extrabold text-lg">Xác nhận gửi</Text>
              </Button>
              <Button
                variant="ghost"
                className="w-full h-14 rounded-2xl bg-[#F8FAF8]"
                onPress={() => setShowConfirm(false)}
              >
                <Text className="text-[#1A2E1A] font-extrabold text-lg">Hủy</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}