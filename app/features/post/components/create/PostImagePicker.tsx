import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Camera, Trash2 } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface PostImagePickerProps {
  images: string[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onPreview: (uri: string) => void;
}

export function PostImagePicker({ images, onAddImage, onRemoveImage, onPreview }: PostImagePickerProps) {
  if (images.length === 0) {
    return (
      <TouchableOpacity
        onPress={onAddImage}
        className="aspect-[4/3] w-full rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 items-center justify-center"
      >
        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
          <Camera size={28} color="#94A3B8" />
        </View>
        <Text className="text-slate-500 font-bold mb-1">Thêm ảnh sản phẩm</Text>
        <Text className="text-slate-400 text-xs">Hỗ trợ tối đa 5 ảnh</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
      {images.map((uri, index) => (
        <TouchableOpacity
          key={index}
          className="relative aspect-[4/3] w-72 rounded-[28px] mr-4 overflow-hidden border border-slate-100 shadow-sm bg-slate-50"
          activeOpacity={0.9}
          onPress={() => onPreview(uri)}
        >
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onRemoveImage(index); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 items-center justify-center z-10"
          >
            <Trash2 size={16} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
      {images.length < 5 && (
        <TouchableOpacity
          onPress={onAddImage}
          className="aspect-[4/3] w-40 rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 items-center justify-center mr-4"
        >
          <Camera size={24} color="#94A3B8" />
          <Text className="text-slate-500 font-bold mt-2 text-sm">Thêm nữa</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
