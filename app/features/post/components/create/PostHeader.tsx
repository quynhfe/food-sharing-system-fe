import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface PostHeaderProps {
  onBack: () => void;
  isPending: boolean;
  onSubmit: () => void;
  paddingTop: number;
}

export function PostHeader({ onBack, isPending, onSubmit, paddingTop }: PostHeaderProps) {
  return (
    <View style={{ paddingTop }} className="bg-white z-10 border-b border-slate-100 shadow-sm">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
          activeOpacity={0.7}
        >
          <X size={24} color="#1A2E1A" />
        </TouchableOpacity>

        <Text className="text-lg font-extrabold text-[#1A2E1A]">Tạo bài đăng</Text>

        <TouchableOpacity
          className="px-4 py-2 bg-[#2E7D32]/10 rounded-full"
          activeOpacity={0.7}
          onPress={onSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Text className="text-[#2E7D32] font-bold text-sm">Đăng</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
