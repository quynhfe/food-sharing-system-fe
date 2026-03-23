import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

interface PostImagePreviewModalProps {
  uri: string | null;
  onClose: () => void;
}

export function PostImagePreviewModal({ uri, onClose }: PostImagePreviewModalProps) {
  return (
    <Modal
      visible={uri !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-center items-center">
        <View className="absolute top-4 right-4 z-10 pt-safe">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {uri && (
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '80%' }}
            contentFit="contain"
          />
        )}
      </View>
    </Modal>
  );
}
