import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Filter,
  Navigation,
  MessageCircle,
  Clock
} from "lucide-react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInfiniteFeedQuery } from "@/features/feed/hooks/useFeedQuery";
import { formatDistance, formatTimeLeft } from "@/utils/helpers";

const CATEGORIES = [
  { label: "Tất cả", value: "" },
  { label: "Chế biến sẵn", value: "cooked" },
  { label: "Nguyên liệu tươi", value: "raw" },
  { label: "Đóng gói", value: "packaged" },
  { label: "Khác", value: "other" }
];

export default function Explore() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const {
    data,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteFeedQuery({
    category: activeCategory as any,
    search: searchText,
    limit: 10
  });

  const posts = data?.pages.flatMap(page => page?.posts || []) || [];

  const handleSearch = () => {
    setSearchText(searchInput);
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderHeader = () => (
    <View
      className="bg-white z-20 px-6 pb-4 shadow-sm shadow-slate-200/40 rounded-b-[32px]"
      style={{ paddingTop: Math.max(insets.top, 20) }}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-[#1A2E1A]">
            Khám phá 🌍
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            Tìm kiếm thực phẩm quanh bạn
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/messages/index')}
            className="w-11 h-11 bg-slate-50 items-center justify-center rounded-full border border-slate-100"
            activeOpacity={0.8}>
            <MessageCircle
              size={22}
              color="#334155"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-11 h-11 bg-[#F1F5F1] rounded-full items-center justify-center"
            activeOpacity={0.8}>
            <Filter
              size={22}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="relative flex-row items-center">
        <View className="absolute left-4 z-10">
          <Search color="#94A3B8" size={20} />
        </View>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          placeholder="Bạn đang tìm món gì?"
          placeholderTextColor="#94A3B8"
          returnKeyType="search"
          className="flex-1 h-14 pl-12 pr-4 bg-[#F8FAF8] rounded-2xl text-sm font-medium text-slate-800 border border-slate-100"
        />
        <TouchableOpacity className="absolute right-4">
           <MapPin color="#2E7D32" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5"
        keyExtractor={(item) => item.value}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveCategory(item.value)}
            className={`px-5 h-10 flex-row items-center justify-center rounded-full border ${
              activeCategory === item.value
                ? "bg-[#2E7D32] border-[#2E7D32]"
                : "bg-white border-slate-200"
            }`}
            activeOpacity={0.8}>
            <Text
              numberOfLines={1}
              className={`font-bold text-sm leading-none ${
                activeCategory === item.value ? "text-white" : "text-slate-600"
              }`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const donor = item.donorId;
    const distance = item.calculatedDistance 
      ? formatDistance(item.calculatedDistance / 1000) 
      : formatDistance((Math.random() * 5) + 0.1);

    return (
      <Animated.View
        entering={FadeInDown.duration(500).delay(index * 50)}
        className="flex-1 px-2 mb-4">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/food/${item._id}`)}>
          <Card className="border-0 bg-white rounded-[24px] shadow-sm shadow-slate-200/50 overflow-hidden">
            <View className="h-32 w-full relative bg-slate-100">
              <Image
                source={{
                  uri: item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute bottom-2 left-2">
                <Badge
                  label={distance}
                  variant="default"
                  textClassName="text-[10px]"
                  className="px-2 py-0.5"
                />
              </View>
            </View>
            <View className="p-3">
              <Text
                className="font-bold text-[#1A2E1A] text-sm mb-1"
                numberOfLines={1}>
                {item.title}
              </Text>
              <View className="flex-row items-center justify-between mt-1">
                <View className="flex-row items-center gap-1">
                  <Image
                    source={{
                      uri: donor?.avatar || `https://i.pravatar.cc/150?u=${donor?._id}`
                    }}
                    className="w-5 h-5 rounded-full bg-slate-200"
                  />
                  <Text className="text-[10px] text-slate-500 font-bold max-w-[50px]" numberOfLines={1}>
                    {donor?.fullName?.split(' ').pop()}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock size={10} color="#94A3B8" />
                  <Text className="text-[10px] text-slate-400 font-bold">
                    {formatTimeLeft(item.expirationDate)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {renderHeader()}

      {isLoading && !isRefetching ? (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 }}
          ListHeaderComponent={
            <View className="px-2 mb-4">
              <Animated.View
                entering={FadeInUp.duration(600)}
                className="w-full h-40 bg-slate-200 rounded-[32px] overflow-hidden relative shadow-sm border border-slate-100">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                  }}
                  className="w-full h-full opacity-60"
                />
                <View className="absolute inset-0 bg-[#2E7D32]/10" />
                <View className="absolute top-1/2 left-1/2 -mt-6 -ml-6 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg shadow-black/10">
                  <Navigation
                    size={24}
                    color="#2E7D32"
                    fill="#2E7D32"
                  />
                </View>
                <TouchableOpacity className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full shadow-sm">
                  <Text className="font-bold text-[#1A2E1A] text-xs">Phóng to bản đồ</Text>
                </TouchableOpacity>
              </Animated.View>
              <Text className="text-xl font-extrabold text-[#1A2E1A] mt-8 mb-2">
                {searchText ? `Kết quả cho "${searchText}"` : "Gợi ý cho bạn"}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-4xl mb-4">🔍</Text>
              <Text className="text-base font-bold text-slate-400">Không tìm thấy thực phẩm nào</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#2E7D32" />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#2E7D32" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

