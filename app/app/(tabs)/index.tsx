// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from "react-native";
import { Text } from "@/components/ui/text";
import { Bell, Search, MapPin, ChevronRight, Heart } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFeedStore } from "@/features/feed/stores/feed.store";
import { useInfiniteFeedQuery } from "@/features/feed/hooks/useFeedQuery";
import { useSearchStore } from "@/features/search/stores/search.store";
import { FoodCard } from "@/features/feed/components/FoodCard";
import { FoodCardSkeleton } from "@/features/feed/components/FoodCardSkeleton";
import { FilterChips } from "@/features/feed/components/FilterChips";
import { EmptyState } from "@/features/feed/components/EmptyState";
import type { FoodPost } from "@/features/feed/types";

export default function Home() {
  const insets = useSafeAreaInsets();

  // Local state for search input
  const [searchInput, setSearchInput] = useState("");

  // Zustand Stores
  const { activeFilter, setActiveFilter } = useFeedStore();
  const { setSearchQuery: setExploreSearchQuery } = useSearchStore();

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
    latitude: activeFilter === "nearby" ? userLat : undefined,
    longitude: activeFilter === "nearby" ? userLng : undefined,
    maxDistance: 15000 // 15km
  });

  // Flatten pages from infinite query
  const posts = data?.pages.flatMap((page) => page?.posts || []) || [];

  const handleSearch = () => {
    if (searchInput.trim()) {
      setExploreSearchQuery(searchInput);
    }
    router.push("/explore" as any);
  };

  const renderHeader = () => (
    <View className="bg-[#F8FAF8]">
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white pb-6 rounded-b-[32px] shadow-sm shadow-slate-200/50 z-10">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-6 py-2">
          <View className="flex-col">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Vị trí của bạn
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              activeOpacity={0.7}>
              <MapPin
                size={18}
                color="#2E7D32"
              />
              <Text className="text-base font-extrabold text-slate-800">
                Đà Nẵng, Việt Nam
              </Text>
              <ChevronRight
                size={16}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push("/wishlist" as any)}
              className="w-11 h-11 rounded-full bg-red-50 items-center justify-center border border-red-100"
              activeOpacity={0.7}>
              <Heart
                size={20}
                color="#E53935"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center relative backdrop-blur-md border border-slate-100"
              activeOpacity={0.8}
              onPress={() => router.push("/notifications" as any)}>
              <Bell
                size={20}
                color="#334155"
              />
              {/* Optional Unread Badge: */}
              <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E53935]" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input */}
        <View className="mt-4 px-6 relative flex-row items-center">
          <View className="absolute left-10 z-10">
            <Search
              color="#94A3B8"
              size={20}
            />
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
          {activeFilter === "nearby"
            ? "Gần bạn nhất"
            : activeFilter === "expiring"
              ? "Sắp hết hạn"
              : "Mới chia sẻ"}
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
        <ActivityIndicator
          size="small"
          color="#2E7D32"
        />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="px-6 pt-4">
          {[1, 2, 3].map((key) => (
            <FoodCardSkeleton key={key} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <EmptyState
          title="Đã có lỗi xảy ra"
          description="Vui lòng kiểm tra kết nối mạng và thử lại."
        />
      );
    }

    return <EmptyState isSearching={false} />;
  };

  // Build the block layouts for categories and banners
  const buildLayoutBlocks = () => {
    if (posts.length === 0) return [];

    const cookedPosts = posts.filter((p) => p.category === "cooked");
    const rawPosts = posts.filter((p) => p.category === "raw");
    const packagedPosts = posts.filter((p) => p.category === "packaged");
    const otherPosts = posts.filter((p) => p.category === "other");

    const blocks: any[] = [];

    if (cookedPosts.length > 0) {
      blocks.push({
        type: "category",
        id: "cat_cooked",
        category: "cooked",
        title: "Thức ăn nấu chín",
        subtitle: "Nóng hổi, ăn ngay",
        items: cookedPosts
      });
    }

    if (
      cookedPosts.length > 0 &&
      (rawPosts.length > 0 || packagedPosts.length > 0)
    ) {
      blocks.push({
        type: "banner",
        id: "banner_1",
        title: "Chung tay giảm lãng phí",
        subtitle: "Hơn 1000 bữa ăn đã được chia sẻ",
        bgColor: "bg-emerald-500",
        icon: "🌟"
      });
    }

    if (rawPosts.length > 0) {
      blocks.push({
        type: "category",
        id: "cat_raw",
        category: "raw",
        title: "Thực phẩm thô",
        subtitle: "Rau củ, trái cây tươi sạch",
        items: rawPosts
      });
    }

    if (
      (rawPosts.length > 0 && packagedPosts.length > 0) ||
      (packagedPosts.length > 0 && otherPosts.length > 0)
    ) {
      blocks.push({
        type: "banner",
        id: "banner_2",
        title: "Lan tỏa yêu thương",
        subtitle: "Món quà nhỏ - Ý nghĩa lớn",
        bgColor: "bg-teal-600",
        icon: "❤️"
      });
    }

    if (packagedPosts.length > 0) {
      blocks.push({
        type: "category",
        id: "cat_packaged",
        category: "packaged",
        title: "Thực phẩm đóng gói",
        subtitle: "Hạn sử dụng dài lâu",
        items: packagedPosts
      });
    }

    if (otherPosts.length > 0) {
      blocks.push({
        type: "category",
        id: "cat_other",
        category: "other",
        title: "Khác",
        subtitle: "Gia vị, đồ ăn kèm...",
        items: otherPosts
      });
    }

    return blocks;
  };

  const layoutBlocks = buildLayoutBlocks();

  const renderCategoryRow = (block: any) => (
    <View className="mb-8 mt-2">
      <View className="px-6 mb-4 flex-row justify-between items-end">
        <View>
          <Text className="text-xl font-extrabold text-primary">
            {block.title}
          </Text>
          <Text className="text-sm font-medium text-slate-500 mt-1">
            {block.subtitle}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="pb-1 px-2">
          <Text className="text-[#2E7D32] font-bold text-[13px] uppercase tracking-wider">
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        data={block.items}
        keyExtractor={(item) =>
          typeof item._id === "object" ? item._id.toString() : String(item._id)
        }
        renderItem={({ item }) => (
          <View
            style={{ width: 170 }}
            className="mr-4">
            <FoodCard
              post={item}
              onPress={() => router.push(`/food/${item._id}`)}
            />
          </View>
        )}
      />
    </View>
  );

  const renderBanner = (block: any) => (
    <View className="px-6 mb-8 mt-2">
      <View
        className={`w-full rounded-[32px] ${block.bgColor} p-7 overflow-hidden flex-row items-center justify-between shadow-sm`}>
        <View className="flex-1 pr-4 z-10">
          <Text className="text-white font-extrabold text-xl mb-1.5 leading-snug">
            {block.title}
          </Text>
          <Text className="text-white/85 font-semibold text-sm leading-5">
            {block.subtitle}
          </Text>
        </View>
        <View className="w-[72px] h-[72px] bg-white/20 rounded-2xl items-center justify-center rotate-12 z-10 border border-white/20 shadow-md">
          <Text className="text-4xl">{block.icon}</Text>
        </View>

        {/* Decorative elements */}
        <View className="absolute -top-12 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <View className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full" />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {renderHeader()}
      <FlatList
        data={posts.length > 0 ? layoutBlocks : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === "category") return renderCategoryRow(item);
          if (item.type === "banner") return renderBanner(item);
          return null;
        }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor="#2E7D32"
            colors={["#2E7D32"]}
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
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100
        }}
      />

      {/* Floating Map Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/map" as any)}
        className="absolute right-6 bottom-28 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-[#2E7D32]/40 z-50 "
        style={{ paddingBottom: 0 }}>
        <MapPin
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}
