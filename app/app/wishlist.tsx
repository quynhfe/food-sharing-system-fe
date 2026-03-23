import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useWishlistStore } from '@/features/wishlist/stores/wishlist.store';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { FoodCardSkeleton } from '@/features/feed/components/FoodCardSkeleton';
import { EmptyState } from '@/features/feed/components/EmptyState';
import type { FoodPost } from '@/features/feed/types';
import type { WishlistItem } from '@/features/wishlist/services/wishlist.service';

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const PADDING = 16;
  const GAP = 12;
  const itemWidth = (width - PADDING * 2 - GAP) / 2;

  const {
    wishlist,
    isLoading,
    isLoadingMore,
    hasMore,
    fetchWishlist,
    loadMore,
  } = useWishlistStore();

  useEffect(() => {
    fetchWishlist(1, true);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchWishlist(1, true);
  }, [fetchWishlist]);

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => (
      <View style={{ width: itemWidth }}>
        <FoodCard
          post={item.post}
          onPress={() => router.push(`/food/${item.postId}` as any)}
        />
      </View>
    ),
    [itemWidth]
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#2E7D32" />
        </View>
      );
    }
    return null;
  };

  const renderSkeletons = () => (
    <View className="flex-row flex-wrap px-4 gap-3 mt-4">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: itemWidth }}>
          <FoodCardSkeleton />
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* Header */}
      <View
        className="bg-white px-6 pb-5 rounded-b-[28px] shadow-sm border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#334155" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-slate-800">
              Danh sách quan tâm
            </Text>
            <Text className="text-sm font-medium text-slate-500">
              {wishlist.length} món đã lưu
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center">
            <Heart size={20} color="#E53935" fill="#E53935" />
          </View>
        </View>
      </View>

      {isLoading && wishlist.length === 0 ? (
        renderSkeletons()
      ) : (
        <FlatList<WishlistItem>
          data={wishlist}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: PADDING, gap: GAP }}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              title="Chưa có món nào được lưu"
              description="Nhấn vào biểu tượng ❤️ trên thẻ món ăn để lưu vào đây!"
            />
          }
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={['#2E7D32']}
              tintColor="#2E7D32"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 20,
            paddingBottom: insets.bottom + 100,
          }}
        />
      )}
    </View>
  );
}
