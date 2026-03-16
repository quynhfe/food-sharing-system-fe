import React from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock } from 'lucide-react-native';
import { Link } from 'expo-router';

/* ─── Sub-components ─── */

const FoodSearchBar = () => (
  <View className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3 border border-border-green shadow-sm shadow-black/5">
    <Search size={20} color="#2f7f34" />
    <TextInput
      placeholder="Tìm món ăn gần bạn..."
      placeholderTextColor="#5a7a5a"
      className="flex-1 text-text-main text-base"
    />
  </View>
);

const FilterChips = () => {
  const filters = ['📍 Gần bạn', '⏰ Sắp hết hạn', '⭐ Đề xuất', '🆕 Mới nhất'];

  return (
    <View className="mt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 12 }}>
        {filters.map((f, i) => (
          <TouchableOpacity
            key={f}
            className={`px-5 py-2.5 rounded-full shadow-sm shadow-black/5 ${
              i === 0 ? 'bg-primary border border-primary' : 'bg-white border border-border-green'
            }`}
          >
            <Text
              className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-text-main'}`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

interface FoodCardData {
  id: string;
  title: string;
  imageSrc: string;
  posterName: string;
  distance: string;
  timeLeft: string;
  isExpiring: boolean;
}

const FoodCard = ({ item }: { item: FoodCardData }) => (
  <Link href={`/food/${item.id}` as any} asChild>
    <TouchableOpacity className="bg-white rounded-2xl overflow-hidden border border-border-green mb-5 shadow-sm shadow-green-900/5">
      <Image source={{ uri: item.imageSrc }} className="w-full h-48" resizeMode="cover" />
      <View
        className={`absolute top-3 left-3 px-3 py-1 rounded-full ${
          item.isExpiring ? 'bg-red-100' : 'bg-green-100'
        }`}
      >
        <Text className={`text-xs font-bold ${item.isExpiring ? 'text-red-600' : 'text-green-600'}`}>
          {item.isExpiring ? '🔴 Sắp hết hạn' : '🟢 Còn mới'}
        </Text>
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold text-text-main mb-1">{item.title}</Text>
        <Text className="text-xs text-text-secondary mb-2">{item.posterName}</Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <MapPin size={12} color="#5a7a5a" />
            <Text className="text-xs text-text-secondary">{item.distance}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={12} color="#5a7a5a" />
            <Text className="text-xs text-text-secondary">{item.timeLeft}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

/* ─── Data ─── */

const mockFoods: FoodCardData[] = [
  {
    id: '1',
    title: 'Cơm tấm sườn nướng',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTOjWEQIvvaRes28Do3FdXvNROveBPhNxQ1baThIx3D8I3pJ5PI4kG_zrv0oHJyY9LuJYCINhUyYg0iHu63L2j0jz2eiOA6g0IC8XB0NUGWJVAJXmA7dlUBwK3pOpCkHeaPL-jcBM3_l6UNpQmGq46rJ1szJenBu5SVSoNYqt4WkxI6PIzkK0loh30DEWV9FKTuK4CQNSbURefnbMkJoF55vu6KFpMKPWHpiPLx0OT0moaQyGrvvVFuGkcZT_lPjQc6Pzj9HrxmA',
    posterName: 'Bếp Bà Sáu',
    distance: '0.8 km',
    timeLeft: 'Còn 2 giờ',
    isExpiring: true,
  },
  {
    id: '2',
    title: 'Bánh mì thịt nguội',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVsgcNAzH_eazu1X-sFsidrJwCs-TO6x4c8GO7nHfMIKDVtKizS7-0P7FXWznQAbkvCDld_NV-4E8cSrWc1l07dp1_UBEZcGBZuGckXoc4CsW6rpqax35f08GOK8Vs9VsD5RqnlLFSKsioqhNiYvDLGu4K1C5xNkMeKuc1OSS_jyYplf-DCYQINrleXDrYUL_7gGeMx18Sxc2ijlugSXcyxtV04k8Igp3OXEnFHBD9dRl-NGKdI1My_3uvAP8MwkF68uSnA4mFvg',
    posterName: 'Tiệm bánh Kim Anh',
    distance: '1.2 km',
    timeLeft: 'Còn 5 giờ',
    isExpiring: false,
  },
  {
    id: '3',
    title: 'Phở bò tái nạm',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-kohyUvm46l_4P9BbqCz7wSGA1tgQEcqx3iA5Inxq_Cd6XyELPvzz7-CWWRVhyXg1YRHOVhBzKMD8f5uJjWgzQaXwFHSUc3uk8-FtNfInEpGXBot9NuT6RV2x5CpoK7JnI6i6ks5xd7-NOgNiLhMdWLuH5TgjuxHgYiX6t8aPLfcknrDl6RDYH6tKx5sSo0cLsFAXm0YhqLBT56A1IOgJcCgkDR68UdiJ4BdssO1j-4H6S6PHx30lgkb6XH6HHmBuzWJYT0LaQ',
    posterName: 'Phở Lý Quốc Sư',
    distance: '0.5 km',
    timeLeft: 'Còn 3 giờ',
    isExpiring: false,
  },
  {
    id: '4',
    title: 'Salad rau củ hữu cơ',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnZH6UjtotCUoc5crgyyfeVQhhkWR0gSM3thSZX1ilU5R4RS8CS_RLgoh2T5xW6UYkliQgQ4meJo_W-2SvEIG1GclMlZlaNkyHiA-0ZSVihSNzUNx92ND9UR8MiqeNedIpIbKcmXfAvyqa8m67-2vPufpqpluVy8iRD4XDiUHv_Iwi0zp8P6IVaRasBcDiJt5uwiipB19JCqW7j2dy2HeZaUNOyzz73OGIon-oSND7cb8nHaHrLy-3inhXsZGLHasYc4c8YXUXCw',
    posterName: 'Healthy Garden',
    distance: '2.0 km',
    timeLeft: 'Còn 1 giờ',
    isExpiring: true,
  },
];

/* ─── Page ─── */

const TopHeader = () => (
  <View className="px-5 pt-4 pb-4 flex-row justify-between items-center">
    <View>
      <Text className="text-sm font-semibold text-text-secondary">Vị trí hiện tại</Text>
      <View className="flex-row items-center gap-1 mt-0.5">
        <MapPin size={16} color="#2E7D32" />
        <Text className="text-lg font-bold text-text-main">Quận 1, TP.HCM</Text>
      </View>
    </View>
    <TouchableOpacity className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
      <Text className="text-xl">🔔</Text>
      <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
    </TouchableOpacity>
  </View>
);

const StoriesRow = () => {
  const stories = [
    { id: '1', name: 'Thêm mới', image: null, isAdd: true },
    { id: '2', name: 'Lan', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFhF6vS9-6p3m7l5p58G7624c_Z5v8144_cRD49rV48W2u92P1Q81n7G9fVpB9W1yG27H49k8_aK18X1o2Z0k2yGZtL7hQYWvQn2V_UvYhX0xLg3GgR4J3p5d9bV9rG8l8Q9nIeC3ZpY6wW_R7uU5n-Z3X11bLw3b70n6vD78Q1G6F2z4b0wYQ' },
    { id: '3', name: 'Tâm', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmQoY25K25iKwOq5_Gq8uRmVxW7K0B0y05K2F7U0i472O4N0z2i15M4w4R1Y05P1j9k6F1r4bY9c0O1D27H9kX22fC2zP1O2i154P2E9F2x18e8o3K3uI6oW2i6M7R0Y8z5z0L0w5oY1yU3C5_YqS9G4B0d7U4U6m7PZ4Y5kX1i1P3w32l6X2w1E5P_L4' },
    { id: '4', name: 'Khoa', image: null },
    { id: '5', name: 'Hành', image: null },
  ];

  return (
    <View className="mb-6">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
        {stories.map((story) => (
          <View key={story.id} className="items-center gap-1.5">
            {story.isAdd ? (
              <TouchableOpacity className="w-16 h-16 rounded-full bg-surface border-2 border-dashed border-primary flex items-center justify-center">
                <Text className="text-2xl text-primary">+</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="w-16 h-16 rounded-full border-[3px] border-primary p-0.5">
                <View className="w-full h-full rounded-full bg-gray-200 overflow-hidden items-center justify-center">
                  {story.image ? (
                    <Image source={{ uri: story.image }} className="w-full h-full" />
                  ) : (
                    <Text className="text-2xl">👤</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            <Text className="text-xs font-semibold text-text-main">{story.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function FeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <FlatList
        data={mockFoods}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="pb-2">
            <TopHeader />
            <StoriesRow />
            <View className="px-5">
              <FoodSearchBar />
              <FilterChips />
              <Text className="text-xl font-bold text-text-main mt-8 mb-4">Gần bạn nhất</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <FoodCard item={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
