import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Text } from './text';

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function Select({ label, placeholder, options, value, onValueChange, error, className }: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onValueChange(val);
    setModalVisible(false);
  };

  return (
    <View className={`flex-col gap-2 ${className}`}>
      {label && <Text className="text-sm font-bold text-[#1A2E1A]">{label}</Text>}
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        className={`h-14 px-4 bg-[#F8FAF8] rounded-2xl flex-row items-center justify-between border ${
          error ? 'border-red-500' : 'border-slate-100'
        }`}
      >
        <Text className={`text-sm ${selectedOption ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.label : placeholder || 'Chọn một tuỳ chọn'}
        </Text>
        <ChevronDown size={20} color="#94A3B8" />
      </TouchableOpacity>

      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-xl font-extrabold text-[#1A2E1A]">{label || 'Chọn tuỳ chọn'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text className="text-[#2E7D32] font-bold">Xong</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item.value)}
                      className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl ${
                        value === item.value ? 'bg-[#E8F5E9]' : 'bg-slate-50'
                      }`}
                    >
                      <Text className={`text-base font-bold ${value === item.value ? 'text-[#2E7D32]' : 'text-slate-700'}`}>
                        {item.label}
                      </Text>
                      {value === item.value && <Check size={20} color="#2E7D32" />}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
