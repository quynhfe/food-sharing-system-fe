// app/(tabs)/messages.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, CheckCheck } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/Input';

const mockChats = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    food: 'Bánh mì kẹp thịt',
    message: 'Mình đang qua lấy bạn nhé.',
    time: '10:30',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    name: 'Trần Thị Hoa',
    food: 'Salad ức gà',
    message: 'Cảm ơn bạn nhiều, đồ ăn ngon lắm!',
    time: '09:15',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

export default function Messages() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <View
        className="bg-white z-20 px-6 pb-4 shadow-sm shadow-slate-200/40 rounded-b-[32px]"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-extrabold text-[#1A2E1A]">Tin nhắn 💬</Text>
            <Text className="text-slate-500 font-medium mt-1">Kết nối với cộng đồng</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-[#F1F5F1] rounded-full items-center justify-center" activeOpacity={0.8}>
            <CheckCheck size={22} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className="bg-[#F8FAF8] border-0 h-14 rounded-2xl"
          startIcon={<Search color="#94A3B8" size={20} />}
        />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="gap-4">
          {mockChats.map((chat, index) => (
            <Animated.View key={chat.id} entering={FadeInUp.duration(500).delay(index * 100)}>
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-row items-center gap-4 bg-white p-4 rounded-[28px] shadow-sm shadow-slate-200/50"
                onPress={() => router.push(`/messages/${chat.id}` as any)}
              >
                <View className="relative">
                  <Image source={{ uri: chat.avatar }} className="w-16 h-16 rounded-full bg-slate-100" />
                  <Image source={{ uri: chat.image }} className="w-6 h-6 rounded-full border-2 border-white absolute -bottom-1 -right-1" />
                </View>

                <View className="flex-1 justify-center">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-extrabold text-base text-[#1A2E1A]" numberOfLines={1}>{chat.name}</Text>
                    <Text className={`text-[11px] font-bold ${chat.unread > 0 ? 'text-[#2E7D32]' : 'text-slate-400'}`}>{chat.time}</Text>
                  </View>
                  <Text className="text-[#2E7D32] text-[11px] font-bold mb-1 bg-[#2E7D32]/10 self-start px-2 py-0.5 rounded-full">{chat.food}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className={`text-sm flex-1 pr-4 ${chat.unread > 0 ? 'text-[#1A2E1A] font-bold' : 'text-slate-500 font-medium'}`} numberOfLines={1}>
                      {chat.message}
                    </Text>
                    {chat.unread > 0 && (
                      <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                        <Text className="text-white text-[10px] font-bold">{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}