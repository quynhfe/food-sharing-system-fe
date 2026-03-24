import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/Button';

interface PostConfirmModalProps {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  bottomInset: number;
}

export function PostConfirmModal({ visible, title, onConfirm, onCancel, bottomInset }: PostConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-slate-900/40"
          onPress={onCancel}
        />
        <View
          className="bg-white rounded-t-[40px] px-6 pt-4 z-40 max-h-[80%]"
          style={{ paddingBottom: Math.max(bottomInset, 24) }}
        >
          <View className="items-center mb-8">
            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </View>

          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-[#2E7D32]/10 rounded-full items-center justify-center mb-6 border-4 border-[#F8FAF8] shadow-sm">
              <Text className="text-4xl">🌱</Text>
            </View>
            <Text className="text-2xl font-extrabold text-[#1A2E1A] text-center mb-4">Xác nhận đăng bài?</Text>
            <Text className="text-slate-500 text-center text-base leading-relaxed font-medium px-2">
              Bài đăng <Text className="font-extrabold text-[#2E7D32]">{title}</Text> sẽ được hiển thị với mọi người. Bạn đã chắc chắn thông tin chính xác?
            </Text>
          </View>

          <View className="w-full gap-3">
            <Button
              className="w-full h-14 rounded-2xl bg-[#2E7D32] shadow-lg shadow-[#2E7D32]/20"
              onPress={onConfirm}
            >
              <Text className="text-white font-extrabold text-lg">Đăng bài ngay</Text>
            </Button>
            <Button
              variant="ghost"
              className="w-full h-14 rounded-2xl bg-[#F8FAF8]"
              onPress={onCancel}
            >
              <Text className="text-[#1A2E1A] font-extrabold text-lg">Kiểm tra lại</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
