import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';

interface EmptyStateProps {
  title?: string;
  description?: string;
  isSearching?: boolean;
}

export function EmptyState({ 
  title = "Chưa có món ăn nào", 
  description = "Hiện tại khu vực của bạn chưa có chia sẻ nào mới. Hãy quay lại sau nhé!",
  isSearching = false
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-6">
      {/* Handled image context properly by using an external placeholder if missing */}
      <View className="w-40 h-40 bg-slate-50 rounded-full items-center justify-center mb-6 border border-slate-100">
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486771.png' }} 
          className="w-24 h-24 opacity-60"
          resizeMode="contain"
        />
      </View>
      <Text className="text-xl font-extrabold text-slate-800 text-center mb-3">
        {isSearching ? "Không tìm thấy kết quả" : title}
      </Text>
      <Text className="text-slate-500 text-center text-base leading-relaxed">
        {isSearching 
          ? "Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc." 
          : description}
      </Text>
    </View>
  );
}
