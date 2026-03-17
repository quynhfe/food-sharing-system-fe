// app/(tabs)/explore.tsx
import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  Leaf,
  Navigation
} from "lucide-react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Explore() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAF8]">
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
          <TouchableOpacity
            className="w-12 h-12 bg-[#F1F5F1] rounded-full items-center justify-center"
            activeOpacity={0.8}>
            <Filter
              size={22}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Bạn đang tìm món gì?"
          className="bg-[#F8FAF8] border-0 h-14 rounded-2xl"
          startIcon={
            <Search
              color="#94A3B8"
              size={20}
            />
          }
          endIcon={
            <MapPin
              color="#2E7D32"
              size={20}
            />
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
          contentContainerStyle={{ gap: 10 }}>
          {["Tất cả", "Gần đây", "Đồ chay", "Rau củ", "Bánh mì"].map(
            (category, idx) => (
              <TouchableOpacity
                key={idx}
                className={`px-5 h-10 flex-row items-center justify-center rounded-full border ${
                  idx === 0
                    ? "bg-[#2E7D32] border-[#2E7D32]"
                    : "bg-white border-slate-200"
                }`}
                activeOpacity={0.8}>
                <Text
                  numberOfLines={1}
                  className={`font-bold text-sm leading-none ${
                    idx === 0 ? "text-white" : "text-slate-600"
                  }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="p-6 relative">
          <Animated.View
            entering={FadeInUp.duration(600).delay(100)}
            className="w-full h-48 bg-slate-200 rounded-[32px] overflow-hidden mb-8 relative shadow-xl shadow-slate-200">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
              }}
              className="w-full h-full opacity-60"
            />
            <View className="absolute inset-0 bg-[#2E7D32]/20" />
            <View className="absolute top-1/2 left-1/2 -mt-6 -ml-6 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg shadow-black/20">
              <Navigation
                size={24}
                color="#2E7D32"
                fill="#2E7D32"
              />
            </View>
            <TouchableOpacity className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
              <Text className="font-bold text-[#1A2E1A]">Mở bản đồ lớn</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text className="text-xl font-extrabold text-[#1A2E1A] mb-4">
            Gợi ý hôm nay
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((item, index) => (
              <Animated.View
                key={item}
                entering={FadeInDown.duration(500).delay(index * 100)}
                className="w-[48%] mb-4">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push(`/food/${item}`)}>
                  <Card className="border-0 bg-white rounded-[24px] shadow-md shadow-slate-200/50 overflow-hidden">
                    <View className="h-32 w-full relative">
                      <Image
                        source={{
                          uri: `https://images.unsplash.com/photo-${1500000000000 + item}?auto=format&fit=crop&q=80&w=400`
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <View className="absolute bottom-2 left-2">
                        <Badge
                          label="0.8km"
                          variant="default"
                          textClassName="text-[10px]"
                          className="px-2 py-0.5"
                        />
                      </View>
                    </View>
                    <View className="p-3">
                      <Text
                        className="font-bold text-[#1A2E1A] text-sm mb-1"
                        numberOfLines={2}>
                        Rau củ quả tươi sạch
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-2">
                        <Image
                          source={{
                            uri: `https://i.pravatar.cc/150?img=${item + 10}`
                          }}
                          className="w-5 h-5 rounded-full"
                        />
                        <Text className="text-xs text-slate-500 font-medium">
                          Hải Anh
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
