import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

const UNITS = [
  { label: 'Phần', value: 'portion' },
  { label: 'Hộp', value: 'box' },
  { label: 'Kg', value: 'kg' },
  { label: 'Món', value: 'item' },
] as const;

type UnitValue = typeof UNITS[number]['value'];

interface PostUnitPickerProps {
  value: UnitValue;
  onChange: (val: UnitValue) => void;
}

export function PostUnitPicker({ value, onChange }: PostUnitPickerProps) {
  return (
    <View className="flex-col gap-2 flex-1">
      <Text className="text-sm font-extrabold text-[#1A2E1A] ml-1">Đơn vị *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
        {UNITS.map((u) => (
          <TouchableOpacity
            key={u.value}
            onPress={() => onChange(u.value)}
            className={`px-3 py-2.5 rounded-xl border mr-2 items-center justify-center min-w-[60px] h-14 ${
              value === u.value ? 'bg-[#2E7D32] border-[#2E7D32]' : 'bg-[#F8FAF8] border-slate-100'
            }`}
          >
            <Text className={`font-bold ${value === u.value ? 'text-white' : 'text-slate-600'}`}>
              {u.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
