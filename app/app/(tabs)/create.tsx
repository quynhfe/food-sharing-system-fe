// app/(tabs)/create.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Camera, MapPin, ImagePlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pickImageFromLibrary } from '@/utils/imagePicker';

import { Text } from '../../components/ui/text';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { postService } from '@/services/postService';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Select } from '@/components/ui/Select';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateQueries } from '@/lib/query-keys';

export default function CreatePost() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'portion' | 'box' | 'item' | ''>('');
  const [expirationDate, setExpirationDate] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [detail, setDetail] = useState('');
  const [category, setCategory] = useState<'cooked' | 'raw' | 'packaged' | 'other' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setImageUri(uri);
    else if (uri === null) showToast('Cần cấp quyền truy cập thư viện ảnh.', 'warning');
  };

  const handleSubmit = async () => {
    if (!title || !quantity || !unit || !expirationDate || !province || !district || !category) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc (*).', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      await postService.createPost({
        title,
        description,
        category: category as any,
        quantity: parseInt(quantity),
        unit: unit as any,
        expirationDate: new Date(expirationDate).toISOString(),
        location: { 
          province, 
          district, 
          detail,
          coordinates: {
            type: 'Point',
            coordinates: [108.2208, 16.0678] // Dummy Da Nang coordinates
          }
        },
        images: imageUri ? [imageUri] : []
      });
      // Invalidate the food post lists to ensure the newly created post shows up immediately
      invalidateQueries.food(queryClient);
      
      showToast('Bài đăng đã được tạo thành công!', 'success');
      setTimeout(() => router.replace('/(tabs)'), 1200);
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Không thể tạo bài đăng.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white z-10 border-b border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
            <X size={24} color="#1A2E1A" />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-[#1A2E1A]">Tạo bài đăng</Text>
          <TouchableOpacity className="px-4 py-2 bg-[#2E7D32]/10 rounded-full" activeOpacity={0.7} onPress={handleSubmit} disabled={isLoading}>
            <Text className="text-[#2E7D32] font-bold text-sm">{isLoading ? '...' : 'Đăng'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Khung ảnh */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={pickImage}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 mb-8"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 items-center justify-center gap-3">
              <View className="w-16 h-16 bg-[#E8F5E9] rounded-full items-center justify-center">
                <ImagePlus size={28} color="#2E7D32" />
              </View>
              <Text className="text-slate-500 text-sm font-medium">Bấm để chọn ảnh món ăn</Text>
            </View>
          )}
          {imageUri && (
            <View className="absolute bottom-4 left-4">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-row items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm"
                activeOpacity={0.8}
              >
                <Camera size={16} color="#1A2E1A" />
                <Text className="text-sm font-bold text-[#1A2E1A]">Đổi ảnh</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Form nhập liệu */}
        <View className="flex-col gap-6 pb-8">
          <Input
            label="Tên món ăn *"
            placeholder="VD: Cơm tấm sườn bì chả"
            className="bg-[#F8FAF8] border-0"
            value={title}
            onChangeText={setTitle}
          />

          <Select
            label="Danh mục *"
            placeholder="Chọn loại thực phẩm"
            value={category}
            onValueChange={(val) => setCategory(val as any)}
            options={[
              { label: '🥣 Đồ ăn đã nấu', value: 'cooked' },
              { label: '🥦 Nguyên liệu tươi', value: 'raw' },
              { label: '📦 Đóng gói/Đồ hộp', value: 'packaged' },
              { label: '✨ Khác', value: 'other' }
            ]}
          />

          <Textarea
            label="Mô tả"
            placeholder="Màu sắc, hương vị, tình trạng..."
            className="bg-[#F8FAF8] border-0"
            value={description}
            onChangeText={setDescription}
          />

          <View className="flex-row gap-4 items-start">
            <View className="flex-[0.4]">
              <Input
                label="Số lượng *"
                keyboardType="numeric"
                placeholder="1"
                className="bg-[#F8FAF8] border-0 text-center font-extrabold text-lg"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View className="flex-[0.6]">
              <Select
                label="Đơn vị *"
                placeholder="Đơn vị"
                value={unit}
                onValueChange={(val) => setUnit(val as any)}
                options={[
                  { label: 'Hộp', value: 'box' },
                  { label: 'Phần', value: 'portion' },
                  { label: 'kg', value: 'kg' },
                  { label: 'Cái', value: 'item' }
                ]}
              />
            </View>
          </View>

          <Input
            label="Hạn sử dụng * (YYYY-MM-DD)"
            placeholder="VD: 2026-03-30"
            className="bg-[#F8FAF8] border-0"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />

          <Input
            label="Tỉnh / Thành phố *"
            placeholder="VD: TP.HCM"
            className="bg-[#F8FAF8] border-0"
            value={province}
            onChangeText={setProvince}
          />

          <Input
            label="Quận / Huyện *"
            placeholder="VD: Quận 1"
            className="bg-[#F8FAF8] border-0"
            value={district}
            onChangeText={setDistrict}
          />

          <Input
            label="Địa chỉ chi tiết"
            placeholder="Số nhà, tên đường..."
            className="bg-[#F8FAF8] border-0 pr-12"
            value={detail}
            onChangeText={setDetail}
            endIcon={
              <TouchableOpacity className="w-10 h-10 bg-[#E8F5E9] rounded-xl items-center justify-center -mr-2">
                <MapPin color="#2E7D32" size={20} />
              </TouchableOpacity>
            }
          />

          <Button className="w-full mt-6 h-14 shadow-xl shadow-[#2E7D32]/30 bg-[#2E7D32]" onPress={handleSubmit} disabled={isLoading}>
            <Text className="text-white font-extrabold text-lg">🌱 {isLoading ? 'Đang đăng...' : 'Đăng món ăn'}</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}