import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Heart, MapPin, Clock, Calendar, MessageCircle, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';

import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { formatDistance, formatTimeLeft } from '@/utils/helpers';
import { useCarousel } from '@/features/post/hooks/useCarousel';
import { useWishlistStore } from '@/features/wishlist/stores/wishlist.store';
import { useToast } from '@/context/ToastContext';
import { PostService } from '@/features/post/services/post.service';
import { EmptyState } from '@/features/feed/components/EmptyState';

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const postId = id as string;
  const insets = useSafeAreaInsets();
  const [showConfirm, setShowConfirm] = useState(false);

  const { addToWishlist, removeFromWishlist } = useWishlistStore();
  const saved = useWishlistStore(state => !!state.wishlistMap[postId]);
  const { showToast } = useToast();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostService.getPostDetails(postId),
    enabled: !!postId,
  });

  const food = response?.data;

  const images = (food?.images?.length ? food.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800']);

  const [layoutWidth, setLayoutWidth] = useState(0);
  const {
    scrollViewRef,
    displayImages,
    handleScroll,
    handleMomentumScrollEnd,
    realCurrentIndex,
    hasMultipleImages,
  } = useCarousel(images, layoutWidth, false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text className="text-slate-500 font-medium mt-4">Đang tải thông tin món ăn...</Text>
      </View>
    );
  }

  if (isError || !food) {
    return (
      <View className="flex-1 bg-white pt-20">
        <EmptyState title="Không tìm thấy món" description="Món ăn này không tồn tại hoặc đã bị xóa." />
        <View className="px-6 mt-4">
          <Button onPress={() => router.back()} className="rounded-2xl bg-[#2E7D32]">
            <Text className="text-white font-bold">Quay lại</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hình ảnh và Header */}
        <View 
          className="relative h-[320px] w-full bg-slate-100"
          onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        >
          {layoutWidth > 0 && (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollEventThrottle={16}
              className="w-full h-full"
            >
              {displayImages.map((uri, idx) => (
                <Image 
                  key={`${uri}-${idx}`}
                  source={{ uri }} 
                  className="h-full" 
                  style={{ width: layoutWidth }}
                  contentFit="cover" 
                  transition={200}
                />
              ))}
            </ScrollView>
          )}

          <View className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
          <View className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-transparent" />

          {hasMultipleImages && (
            <View className="absolute bottom-12 left-0 right-0 flex-row justify-center gap-2">
              {images.map((_: any, idx: number) => (
                <View 
                  key={idx}
                  className={`h-2 rounded-full shadow-sm ${idx === realCurrentIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
                />
              ))}
            </View>
          )}

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
              onPress={async () => {
                if (saved) {
                  Alert.alert(
                    'Bỏ lưu món ăn?',
                    'Bạn có chắc chắn muốn xóa món này khỏi danh sách quan tâm?',
                    [
                      { text: 'Hủy', style: 'cancel' },
                      { 
                        text: 'Xóa', 
                        style: 'destructive',
                        onPress: async () => {
                          const success = await removeFromWishlist(food._id);
                          if (success) {
                            showToast('Đã xóa khỏi danh sách quan tâm', 'info');
                          } else {
                            showToast('Không thể bỏ lưu lúc này', 'error');
                          }
                        }
                      }
                    ]
                  );
                } else {
                  const success = await addToWishlist(food._id);
                  if (success) {
                    showToast('Đã lưu vào danh sách quan tâm', 'success');
                  } else {
                    showToast('Không thể lưu vào danh sách quan tâm', 'error');
                  }
                }
              }}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/30"
              activeOpacity={0.8}
            >
              <Heart size={24} color={saved ? '#E53935' : 'white'} fill={saved ? '#E53935' : 'transparent'} />
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
              <Text className="text-xs font-bold text-slate-600">
                {food.calculatedDistance ? formatDistance(food.calculatedDistance / 1000) : 'Gần đây'}
              </Text>
            </View>
          </View>

          <Text className="mb-3 text-[24px] font-extrabold leading-tight text-[#1A2E1A]">{food.title}</Text>

          <Text className="mb-6 text-base leading-relaxed text-slate-600 font-medium">
            {food.description || 'Không có mô tả chi tiết cho món ăn này.'}
          </Text>

          <View className="flex-row items-center justify-between border-y border-slate-100 py-5 mb-6">
            <View className="flex-col items-center gap-1.5">
              <Text className="text-xl">🍽️</Text>
              <Text className="text-sm font-bold text-[#1A2E1A]">{food.quantity} {food.unit}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Clock size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">{food.expirationDate ? formatTimeLeft(food.expirationDate) : 'N/A'}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Calendar size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">HSD {food.expirationDate ? formatDate(food.expirationDate) : 'N/A'}</Text>
            </View>
          </View>

          {/* User Card */}
          <View className="flex-row items-center justify-between rounded-[24px] border border-slate-100 bg-[#F8FAF8] p-4 mb-6 shadow-sm shadow-slate-100">
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: food.donor?.avatar || 'https://i.pravatar.cc/150' }} className="w-12 h-12 rounded-full bg-slate-200" />
              <View>
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Text className="text-base font-bold text-[#1A2E1A]">{food.donor?.fullName || 'Ẩn danh'}</Text>
                  <CheckCircle size={16} color="#3B82F6" />
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-extrabold text-[#2E7D32]">⭐ {food.donor?.trustScore || 90}/100 Trust</Text>
                  <Text className="text-slate-300">•</Text>
                  <Text className="text-xs font-bold text-slate-500">{food.donor?.sharesCount || 5} lần chia sẻ</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="rounded-full bg-[#2E7D32]/10 px-4 py-2" activeOpacity={0.7}>
              <Text className="text-xs font-extrabold text-[#2E7D32]">Theo dõi</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View className="flex-row items-start gap-3 bg-white p-4 rounded-[24px] border border-slate-100 mb-6">
            <View className="w-10 h-10 rounded-full bg-[#F8FAF8] items-center justify-center">
              <MapPin size={20} color="#2E7D32" />
            </View>
            <View className="flex-1 justify-center pt-0.5">
              <Text className="text-base font-extrabold text-[#1A2E1A] mb-1">Khu vực nhận</Text>
              <Text className="text-sm font-medium text-slate-500 leading-relaxed">{food.location?.detail || 'Không rõ địa chỉ cụ thể'}</Text>
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
                Bạn đang yêu cầu nhận món <Text className="font-extrabold text-[#2E7D32]">{food.title}</Text> từ <Text className="font-extrabold text-[#1A2E1A]">{food.donor?.fullName || 'Ẩn danh'}</Text>. Người đăng sẽ xem xét và phản hồi sớm nhất.
              </Text>
            </View>

            <View className="w-full gap-3">
              <Button
                className="w-full h-14 rounded-2xl bg-[#2E7D32] shadow-lg shadow-[#2E7D32]/20"
                onPress={() => {
                  setShowConfirm(false);
                  router.push({ pathname: '/food/[id]', params: { id: food._id } }); 
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