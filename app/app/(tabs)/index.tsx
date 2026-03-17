// app/(tabs)/index.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Bell, Search, MapPin, Clock, Star, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFoodBadge, formatDistance, formatTimeLeft, FoodStatus } from '../../utils/helpers';

const foods = [
  {
    id: '1',
    title: 'Salad Ức Gà Áp Chảo',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    status: 'EXPIRING_SOON' as FoodStatus,
    poster: { name: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?img=11' },
    distance: 0.8,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Cơm Gạo Lứt & Rau Củ',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    status: 'AVAILABLE' as FoodStatus,
    poster: { name: 'Bích Phương', avatar: 'https://i.pravatar.cc/150?img=5' },
    distance: 1.2,
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  }
];

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <View style={{ paddingTop: insets.top }} className="bg-white px-6 pb-4 rounded-b-[32px] shadow-sm shadow-slate-200/50 z-10">
        <View className="flex-row items-center justify-between py-2">
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

        <View className="mt-4 relative flex-row items-center">
          <View className="absolute left-4 z-10">
            <Search color="#94A3B8" size={20} />
          </View>
          <TextInput
            placeholder="Tìm món ăn, nguyên liệu..."
            placeholderTextColor="#94A3B8"
            className="flex-1 h-14 pl-12 pr-4 bg-[#F8FAF8] rounded-2xl text-sm font-medium text-slate-800 border border-slate-100"
          />
        </View>
        <View className="py-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <TouchableOpacity className="flex-row items-center gap-2 px-5 py-3 bg-[#2E7D32] rounded-2xl  " activeOpacity={0.8}>
              <MapPin size={18} color="white" />
              <Text className="text-white text-sm font-bold">Gần bạn</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-2 px-5 py-3 bg-white rounded-2xl  border border-slate-100" activeOpacity={0.8}>
              <Clock size={18} color="#64748B" />
              <Text className="text-slate-600 text-sm font-bold">Sắp hết hạn</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-2 px-5 py-3 bg-white rounded-2xl  border border-slate-100" activeOpacity={0.8}>
              <Star size={18} color="#64748B" />
              <Text className="text-slate-600 text-sm font-bold">Đánh giá cao</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <ScrollView className="flex-1 mt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>


        <View className="px-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-extrabold text-slate-800">Mới chia sẻ</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#2E7D32] text-sm font-bold">Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-col gap-5">
            {foods.map(food => {
              const badge = getFoodBadge(food.status);
              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => router.push(`/food/${food.id}`)}
                  activeOpacity={0.9}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden"
                >
                  <View className="relative h-44 w-full bg-slate-100">
                    <Image source={{ uri: food.image }} className="w-full h-full" resizeMode="cover" />
                    <View className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
                      <View className={`w-2 h-2 rounded-full ${badge.color === 'bg-red-500' ? 'bg-red-500' : 'bg-[#2E7D32]'}`}></View>
                      <Text className="text-slate-800 text-[11px] font-bold">{badge.text}</Text>
                    </View>
                  </View>
                  <View className="p-5">
                    <Text className="font-extrabold text-lg text-slate-800 mb-4">{food.title}</Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2.5">
                        <Image source={{ uri: food.poster.avatar }} className="w-8 h-8 rounded-full bg-slate-200" />
                        <Text className="text-sm text-slate-600 font-bold">{food.poster.name}</Text>
                      </View>
                      <View className="flex-row items-center gap-3.5">
                        <View className="flex-row items-center gap-1.5">
                          <MapPin size={14} color="#94A3B8" />
                          <Text className="text-xs font-bold text-slate-500">{formatDistance(food.distance)}</Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={14} color="#94A3B8" />
                          <Text className="text-xs font-bold text-slate-500">{formatTimeLeft(food.expiresAt)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}