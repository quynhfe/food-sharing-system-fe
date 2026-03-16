import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, ChefHat, Leaf, Coffee, ShoppingBag } from 'lucide-react-native';

const CATEGORIES = [
  { id: '1', name: 'Cơm / Bún', icon: ChefHat },
  { id: '2', name: 'Rau củ', icon: Leaf },
  { id: '3', name: 'Đồ uống', icon: Coffee },
  { id: '4', name: 'Tạp hóa', icon: ShoppingBag },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-black text-text-main tracking-tight mb-4">Khám phá 🔍</Text>

          <View className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3 border border-border-green mb-6 shadow-sm shadow-black/5">
            <Search size={20} color="#2f7f34" />
            <TextInput
              placeholder="Tìm kiếm theo khu vực, món ăn..."
              placeholderTextColor="#5a7a5a"
              className="flex-1 text-text-main text-base p-0"
            />
          </View>

          <Text className="text-lg font-bold text-text-main mb-3">Danh mục</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 pl-5 pr-5 max-w-full" style={{ marginHorizontal: -20 }}>
            <View className="flex-row gap-4 px-5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TouchableOpacity key={cat.id} className="items-center gap-2">
                    <View className="w-16 h-16 rounded-2xl bg-surface-light border border-border-green flex items-center justify-center shadow-sm shadow-black/5 bg-white">
                      <Icon size={24} color="#2E7D32" />
                    </View>
                    <Text className="text-xs font-semibold text-text-main">{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <Text className="text-lg font-bold text-text-main mb-3">Khu vực phổ biến</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 pl-5 pr-5 max-w-full" style={{ marginHorizontal: -20 }}>
            <View className="flex-row gap-3 px-5">
              {['Quận 1, TP.HCM', 'Quận 3, TP.HCM', 'Quận 7, TP.HCM', 'Bình Thạnh', 'Thủ Đức'].map((area) => (
                <TouchableOpacity
                  key={area}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-border-green shadow-sm shadow-black/5 bg-white"
                >
                  <View className="flex-row items-center gap-2">
                    <MapPin size={14} color="#2E7D32" />
                    <Text className="text-sm font-semibold text-primary">{area}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-text-main">Sắp hết hạn gần đây</Text>
            <TouchableOpacity>
               <Text className="text-sm font-semibold text-primary">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <View className="space-y-3">
            {[
              { id: '1', title: 'Trái cây tươi gọt sẵn', time: 'Còn 30 phút', dist: '0.3 km' },
              { id: '2', title: 'Salad rau củ hữu cơ', time: 'Còn 1 giờ', dist: '2.0 km' },
              { id: '3', title: 'Cơm tấm sườn nướng', time: 'Còn 2 giờ', dist: '0.8 km' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white rounded-2xl p-4 flex-row items-center gap-4 border border-border-green shadow-sm shadow-black/5 mb-3"
              >
                <View className="w-16 h-16 rounded-xl bg-danger/10 items-center justify-center border border-danger/20">
                  <Text className="text-2xl">⏳</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-text-main text-base">{item.title}</Text>
                  <View className="flex-row items-center gap-3 mt-1.5">
                    <View className="flex-row items-center gap-1 bg-danger/5 px-2 py-0.5 rounded-md border border-danger/10">
                      <Clock size={12} color="#ef5350" />
                      <Text className="text-xs text-danger font-bold">{item.time}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MapPin size={12} color="#5a7a5a" />
                      <Text className="text-xs text-text-secondary font-medium">{item.dist}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
