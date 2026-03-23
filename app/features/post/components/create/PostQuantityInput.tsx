import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';

interface PostQuantityInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function PostQuantityInput({ value, onChange }: PostQuantityInputProps) {
  const decrement = () => onChange(String(Math.max(1, parseInt(value || '1') - 1)));
  const increment = () => onChange(String(parseInt(value || '1') + 1));

  const handleText = (v: string) => {
    const n = parseInt(v);
    if (v === '') onChange('1');
    else if (!isNaN(n) && n > 0) onChange(String(n));
  };

  return (
    <View className="flex-col gap-2">
      <Text className="text-sm font-extrabold text-[#1A2E1A] ml-1">Số lượng *</Text>
      <View className="flex-row items-center bg-[#F8FAF8] rounded-2xl overflow-hidden border border-slate-100 h-14">
        <TouchableOpacity
          onPress={decrement}
          className="w-14 h-full items-center justify-center bg-slate-100/70"
          activeOpacity={0.7}
        >
          <Text className="text-slate-600 font-extrabold text-2xl leading-none">−</Text>
        </TouchableOpacity>

        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={handleText}
          style={{ flex: 1, textAlign: 'center', fontWeight: '800', fontSize: 18, color: '#1e293b' }}
          selectTextOnFocus
        />

        <TouchableOpacity
          onPress={increment}
          className="w-14 h-full items-center justify-center bg-[#2E7D32]/10"
          activeOpacity={0.7}
        >
          <Text className="text-[#2E7D32] font-extrabold text-2xl leading-none">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
