import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';
import { MapPin, Clock, Heart } from 'lucide-react-native';
import { formatDistance, formatTimeLeft } from '@/utils/helpers';
import type { FoodPost } from '../types';
import { useCarousel } from '@/features/post/hooks/useCarousel';
import { useWishlistStore } from '@/features/wishlist/stores/wishlist.store';
import { useToast } from '@/context/ToastContext';

interface FoodCardProps {
  post: FoodPost;
  onPress: () => void;
}

export function FoodCard({ post, onPress }: FoodCardProps) {
  const { addToWishlist, removeFromWishlist } = useWishlistStore();
  const saved = useWishlistStore(state => !!state.wishlistMap[post._id!]);
  const { showToast } = useToast();

  const donorName = typeof post.donorId === 'object' ? post.donorId.fullName : 'Ẩn danh';
  const donorAvatar = typeof post.donorId === 'object' 
    ? post.donorId.avatar || 'https://i.pravatar.cc/150' 
    : 'https://i.pravatar.cc/150';

  const distance = post.calculatedDistance 
    ? formatDistance(post.calculatedDistance / 1000) 
    : formatDistance((Math.random() * 5) + 0.1); 

  // Figure out time state for optional warning badge
  const timeLeft = post.expirationDate ? formatTimeLeft(post.expirationDate) : null;
  const isExpiringSoon = (() => {
    if (!post.expirationDate) return false;
    const diff = new Date(post.expirationDate).getTime() - Date.now();
    return diff > 0 && diff < 6 * 60 * 60 * 1000; // within 6 hours
  })();
  const isExpired = timeLeft === 'Đã hết hạn';

  const [layoutWidth, setLayoutWidth] = useState(0);
  const images = post.images?.length ? post.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'];
  const {
    scrollViewRef,
    displayImages,
    handleScroll,
    handleMomentumScrollEnd,
    realCurrentIndex,
    hasMultipleImages,
  } = useCarousel(images, layoutWidth);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden mb-5 h-[330px]"
    >
      <View 
        className="relative h-[200px] w-full bg-slate-100"
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

        {hasMultipleImages && (
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1.5">
            {images.map((_, idx) => (
              <View 
                key={idx}
                className={`h-1.5 rounded-full ${idx === realCurrentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </View>
        )}

        {/* Expiring badge — only shown when expiring soon or expired */}
        {(isExpiringSoon || isExpired) && (
          <View className={`absolute top-3 left-3 px-2.5 py-1 rounded-full flex-row items-center gap-1 shadow-sm ${isExpired ? 'bg-slate-500/90' : 'bg-red-500/90'}`}>
            <Text className="text-white text-[10px] font-bold">{isExpired ? 'Hết hạn' : 'Sắp hết hạn'}</Text>
          </View>
        )}

        {/* Wishlist heart button */}
        <TouchableOpacity
          onPress={async (e) => {
            e.stopPropagation?.();
            const postId = post._id!;
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
                      const success = await removeFromWishlist(postId);
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
              const success = await addToWishlist(postId);
              if (success) {
                showToast('Đã lưu vào danh sách quan tâm', 'success');
              } else {
                showToast('Không thể lưu vào danh sách quan tâm', 'error');
              }
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/95 rounded-full items-center justify-center shadow-sm"
          activeOpacity={0.8}
        >
          <Heart
            size={17}
            color={saved ? '#E53935' : '#94A3B8'}
            fill={saved ? '#E53935' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View className="p-3.5 flex-1 justify-between">
        <Text className="font-extrabold text-[15px] leading-[22px] text-slate-800" numberOfLines={2}>
          {post.title}
        </Text>
        <View className="flex-col gap-3">
          <View className="flex-row items-center gap-2">
            <Image source={{ uri: donorAvatar }} className="w-6 h-6 rounded-full bg-slate-200" />
            <Text className="text-[12px] text-slate-600 font-bold flex-1" numberOfLines={1}>
              {donorName}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <MapPin size={12} color="#94A3B8" />
              <Text className="text-[11px] font-bold text-slate-500">{distance}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#94A3B8" />
              <Text className="text-[11px] font-bold text-slate-500">{timeLeft}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
