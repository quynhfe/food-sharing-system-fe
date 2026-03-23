// app/(tabs)/explore.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  X,
  Clock,
  Trash2,
  ChevronRight,
  Leaf,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';

import { useSearchStore } from '@/features/search/stores/search.store';
import { useDebounce } from '@/features/search/hooks/useDebounce';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { FoodCardSkeleton } from '@/features/feed/components/FoodCardSkeleton';
import { EmptyState } from '@/features/feed/components/EmptyState';
import type { FoodPost } from '@/features/feed/types';

const CATEGORIES = [
  { label: 'Tất cả', value: null },
  { label: '🍳 Đã nấu', value: 'cooked' },
  { label: '🥬 Tươi sống', value: 'raw' },
  { label: '📦 Đóng gói', value: 'packaged' },
  { label: '🍱 Khác', value: 'other' },
] as const;

export default function Explore() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const PADDING = 16;
  const GAP = 12;
  const itemWidth = (width - PADDING * 2 - GAP) / 2;

  const {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    selectedCategory,
    setCategory,
    searchResults,
    loadingResults,
    resultsError,
    isLoadingMore,
    searchHistory,
    addHistoryItem,
    clearHistory,
    searchPosts,
    loadMore,
    clearResults,
  } = useSearchStore();

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Trigger search when debounced query or category changes
  useEffect(() => {
    if (debouncedQuery.trim() || selectedCategory) {
      if (debouncedQuery.trim()) {
        addHistoryItem(debouncedQuery.trim());
      }
      searchPosts(true);
    } else {
      clearResults();
    }
  }, [debouncedQuery, selectedCategory]);

  const handleHistoryPress = useCallback(
    (term: string) => {
      setSearchQuery(term);
      Keyboard.dismiss();
    },
    [setSearchQuery]
  );

  const handleCategoryPress = useCallback(
    (value: string | null) => {
      setCategory(value);
    },
    [setCategory]
  );

  const showHistory =
    !loadingResults &&
    searchResults.length === 0 &&
    !searchQuery.trim() &&
    !selectedCategory;

  // ── Render ──────────────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: FoodPost }) => (
      <View style={{ width: itemWidth }}>
        <FoodCard
          post={item}
          onPress={() => router.push(`/food/${item._id}` as any)}
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

  const renderEmpty = () => {
    if (loadingResults) return null;
    if (!searchQuery.trim() && !selectedCategory) return null;
    return (
      <EmptyState
        title="Không tìm thấy kết quả"
        description="Thử thay đổi từ khóa hoặc bộ lọc nhé!"
      />
    );
  };

  const renderSkeletons = () => (
    <View className="flex-row flex-wrap px-4 gap-3 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: itemWidth }}>
          <FoodCardSkeleton />
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* ── Header ── */}
      <View
        className="bg-white z-20 px-6 pb-4 shadow-sm shadow-slate-200/40 rounded-b-[32px]"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        {/* Title */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-2xl font-bold text-[#1A2E1A]">
              Tìm kiếm 🔍
            </Text>
            <Text className="text-slate-500 font-medium mt-1">
              Tìm thực phẩm bạn cần
            </Text>
          </View>
          <View className="w-10 h-10 bg-[#E8F5E9] rounded-full items-center justify-center">
            <Leaf size={20} color="#2E7D32" />
          </View>
        </View>

        {/* Search Input */}
        <View className="flex-row items-center bg-[#F8FAF8] rounded-2xl h-14 px-4 gap-3">
          <Search size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 text-base text-slate-800 font-medium"
            placeholder="Tìm món ăn, rau củ, bánh..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearchQuery} activeOpacity={0.7}>
              <View className="w-7 h-7 rounded-full bg-slate-200 items-center justify-center">
                <X size={14} color="#64748B" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Chips */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.label}
          className="mt-4"
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => {
            const isActive = item.value === selectedCategory;
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.value)}
                activeOpacity={0.8}
                className={`px-5 py-2 flex-row items-center justify-center rounded-full border ${isActive
                  ? 'bg-[#2E7D32] border-[#2E7D32]'
                  : 'bg-white border-slate-200'
                  }`}
              >
                <Text
                  numberOfLines={1}
                  className={`font-bold text-sm  ${isActive ? 'text-white' : 'text-slate-600'
                    }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ── Body ── */}
      {loadingResults && searchResults.length === 0 ? (
        renderSkeletons()
      ) : showHistory ? (
        /* Search History */
        <Animated.View entering={FadeIn.duration(300)} className="flex-1 p-6">
          {searchHistory.length > 0 && (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color="#94A3B8" />
                  <Text className="text-base font-bold text-slate-700">
                    Tìm kiếm gần đây
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={clearHistory}
                  activeOpacity={0.7}
                  className="flex-row items-center gap-1"
                >
                  <Trash2 size={14} color="#EF4444" />
                  <Text className="text-sm font-semibold text-red-500">
                    Xoá
                  </Text>
                </TouchableOpacity>
              </View>

              {searchHistory.map((term, index) => (
                <Animated.View
                  key={term}
                  entering={FadeInDown.duration(300).delay(index * 50)}
                >
                  <TouchableOpacity
                    onPress={() => handleHistoryPress(term)}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between py-3.5 border-b border-slate-100"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                        <Search size={14} color="#94A3B8" />
                      </View>
                      <Text className="text-base font-medium text-slate-700">
                        {term}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </>
          )}

          {searchHistory.length === 0 && (
            <View className="items-center justify-center mt-20">
              <View className="w-16 h-16 rounded-full bg-[#E8F5E9] items-center justify-center mb-4">
                <Search size={28} color="#2E7D32" />
              </View>
              <Text className="text-lg font-bold text-slate-700 mb-1">
                Bắt đầu tìm kiếm
              </Text>
              <Text className="text-sm text-slate-500 text-center px-8">
                Nhập tên món ăn hoặc chọn danh mục để khám phá
              </Text>
            </View>
          )}
        </Animated.View>
      ) : (
        /* Search Results Grid */
        <FlatList<FoodPost>
          data={searchResults}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: PADDING, gap: GAP }}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 16,
            paddingBottom: insets.bottom + 100,
          }}
        />
      )}
    </View>
  );
}
