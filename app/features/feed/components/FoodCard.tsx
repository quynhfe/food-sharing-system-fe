import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin, Clock } from 'lucide-react-native';
import { getFoodBadge, formatDistance, formatTimeLeft } from '@/utils/helpers';
import type { FoodPost } from '../types';

interface FoodCardProps {
  post: FoodPost;
  onPress: () => void;
}

export function FoodCard({ post, onPress }: FoodCardProps) {
  const badge = getFoodBadge(post.status);
  
  // Handled populated donor
  const donorName = typeof post.donorId === 'object' ? post.donorId.fullName : 'Ẩn danh';
  const donorAvatar = typeof post.donorId === 'object' 
    ? post.donorId.avatar 
    : 'https://i.pravatar.cc/150';

  // Distance only exists if 'nearby' filter is used, otherwise mock it visually
  const distance = post.calculatedDistance 
    ? formatDistance(post.calculatedDistance / 1000) 
    : formatDistance((Math.random() * 5) + 0.1); 

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden mb-5"
    >
      <View className="relative h-44 w-full bg-slate-100">
        <Image 
          source={{ uri: post.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' }} 
          className="w-full h-full" 
          resizeMode="cover" 
        />
        <View className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
          <View className={`w-2 h-2 rounded-full ${badge.color === 'bg-red-500' ? 'bg-red-500' : 'bg-[#2E7D32]'}`}></View>
          <Text className="text-slate-800 text-[11px] font-bold">{badge.text}</Text>
        </View>
      </View>
      <View className="p-5">
        <Text className="font-extrabold text-lg text-slate-800 mb-4" numberOfLines={2}>
          {post.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Image source={{ uri: donorAvatar }} className="w-8 h-8 rounded-full bg-slate-200" />
            <Text className="text-sm text-slate-600 font-bold max-w-[100px]" numberOfLines={1}>
              {donorName}
            </Text>
          </View>
          <View className="flex-row items-center gap-3.5">
            <View className="flex-row items-center gap-1.5">
              <MapPin size={14} color="#94A3B8" />
              <Text className="text-xs font-bold text-slate-500">{distance}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Clock size={14} color="#94A3B8" />
              <Text className="text-xs font-bold text-slate-500">{formatTimeLeft(post.expirationDate)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
