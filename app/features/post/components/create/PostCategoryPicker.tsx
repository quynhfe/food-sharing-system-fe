import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

const CATEGORIES = [
  { label: 'Đã nấu chín', value: 'cooked' },
  { label: 'Thực phẩm thô', value: 'raw' },
  { label: 'Đóng gói', value: 'packaged' },
  { label: 'Khác', value: 'other' },
] as const;

type CategoryValue = typeof CATEGORIES[number]['value'];

interface PostCategoryPickerProps {
  value: CategoryValue;
  onChange: (val: CategoryValue) => void;
}

export function PostCategoryPicker({ value, onChange }: PostCategoryPickerProps) {
  return (
    <View className="flex-col gap-2">
      <Text className="text-sm font-extrabold text-[#1A2E1A] ml-1">Danh mục *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            onPress={() => onChange(cat.value)}
            className={`px-4 py-3 rounded-xl border mr-3 ${
              value === cat.value ? 'bg-[#2E7D32]/10 border-[#2E7D32]' : 'bg-[#F8FAF8] border-slate-100'
            }`}
          >
            <Text className={`font-bold ${value === cat.value ? 'text-[#2E7D32]' : 'text-slate-600'}`}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
