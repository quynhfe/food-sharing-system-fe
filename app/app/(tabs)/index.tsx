// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Bell, Search, MapPin, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeedStore } from '@/features/feed/stores/feed.store';
import { useInfiniteFeedQuery } from '@/features/feed/hooks/useFeedQuery';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { FilterChips } from '@/features/feed/components/FilterChips';
import { EmptyState } from '@/features/feed/components/EmptyState';
import type { FoodPost } from '@/features/feed/types';

export default function Home() {
  const insets = useSafeAreaInsets();
  
  // Local state for search input to prevent re-rendering list on every key press
  const [searchInput, setSearchInput] = useState('');

  // Zustand Store
  const { activeFilter, searchText, setActiveFilter, setSearchText } = useFeedStore();

  // Coordinates - In a real app these come from Location service.
  // Using Da Nang center to match our seed data for now.
  const userLat = 16.0678;
  const userLng = 108.2208;

  // React Query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useInfiniteFeedQuery({
    filter: activeFilter,
    search: searchText,
    latitude: activeFilter === 'nearby' ? userLat : undefined,
    longitude: activeFilter === 'nearby' ? userLng : undefined,
    maxDistance: 15000 // 15km
  });

  // Flatten pages from infinite query
  const posts = data?.pages.flatMap(page => page?.posts || []) || [];

  const handleSearch = () => {
    setSearchText(searchInput);
  };

  const renderHeader = () => (
    <View className="bg-[#F8FAF8]">
      <View style={{ paddingTop: insets.top }} className="bg-white pb-6 rounded-b-[32px] shadow-sm shadow-slate-200/50 z-10">
        
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-6 py-2">
          <View className="flex-col">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Vị trí của bạn</Text>
            <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
              <MapPin size={18} color="#2E7D32" />
              <Text className="text-base font-extrabold text-slate-800">Đà Nẵng, Việt Nam</Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-slate-50 items-center justify-center border border-slate-100 relative" activeOpacity={0.7}>
            <Bell size={20} color="#334155" />
            <View className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></View>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="mt-4 px-6 relative flex-row items-center">
          <View className="absolute left-10 z-10">
            <Search color="#94A3B8" size={20} />
          </View>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            placeholder="Tìm món ăn, nguyên liệu..."
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
            className="flex-1 h-14 pl-12 pr-4 bg-[#F8FAF8] rounded-2xl text-sm font-medium text-slate-800 border border-slate-100"
          />
        </View>

        <View className="pt-6">
          <FilterChips 
            activeFilter={activeFilter} 
            onSelectFilter={setActiveFilter} 
          />
        </View>

      </View>

      <View className="px-6 pt-5 pb-2 flex-row items-center justify-between">
        <Text className="text-xl font-extrabold text-slate-800">
          {activeFilter === 'nearby' ? 'Gần bạn nhất' : activeFilter === 'expiring' ? 'Sắp hết hạn' : 'Mới chia sẻ'}
        </Text>
        <Text className="text-slate-500 font-medium text-sm">
          {data?.pages[0]?.pagination?.total || 0} kết quả
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className="h-20" />; // bottom padding
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#2E7D32" />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="pt-20 items-center">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      );
    }
    
    if (isError) {
      return <EmptyState title="Đã có lỗi xảy ra" description="Vui lòng kiểm tra kết nối mạng và thử lại." />;
    }

    return <EmptyState isSearching={Boolean(searchText)} />;
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {renderHeader()}
      <FlatList<FoodPost>
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="px-6">
            <FoodCard post={item} onPress={() => router.push(`/food/${item._id}`)} />
          </View>
        )}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        
        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor="#2E7D32"
            colors={['#2E7D32']}
          />
        }
        
        // Infinite scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}

        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 80 }}
      />
    </View>
  );
}