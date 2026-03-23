import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useQueryClient } from '@tanstack/react-query';

import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreatePost } from '@/features/post/hooks/useCreatePost';
import { useImagePicker } from '@/features/post/hooks/useImagePicker';
import {
  PostHeader,
  PostImagePicker,
  PostCategoryPicker,
  PostQuantityInput,
  PostUnitPicker,
  PostLocationInput,
  PostImagePreviewModal,
  PostConfirmModal,
} from '@/features/post/components/create';

export default function CreatePost() {
  const insets = useSafeAreaInsets();
  const createPostMutation = useCreatePost();
  const queryClient = useQueryClient();

  // Image picker
  const { images, handleAddImage, removeImage, resetImages } = useImagePicker();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<'kg' | 'portion' | 'box' | 'item'>('portion');
  const [category, setCategory] = useState<'cooked' | 'raw' | 'packaged' | 'other'>('cooked');
  const [expirationDate] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
  const [locationText, setLocationText] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Lỗi', 'Quyền truy cập vị trí bị từ chối'); return; }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoordinates({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      const res = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (res.length > 0) {
        const p = res[0];
        setLocationText([p.street, p.subregion, p.city, p.region].filter(Boolean).join(', ') || 'Vị trí hiện tại');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
    }
  };

  const handlePreSubmit = () => {
    if (!title || !quantity || !locationText || !coordinates) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc và lấy vị trí.');
      return;
    }
    if (images.length === 0) { Alert.alert('Lỗi', 'Vui lòng thêm ít nhất 1 hình ảnh sản phẩm.'); return; }
    setShowConfirmModal(true);
  };

  const handleSubmit = () => {
    if (!coordinates) return;
    setShowConfirmModal(false);
    createPostMutation.mutate(
      { title, description, category, quantity: parseInt(quantity, 10), unit, expirationDate, locationText, latitude: coordinates.lat, longitude: coordinates.lng, images },
      {
        onSuccess: (res: any) => {
          if (res?.error) { Alert.alert('Lỗi', res.error); return; }
          
          // Reset form completely
          setTitle('');
          setDescription('');
          setQuantity('1');
          setUnit('portion');
          setCategory('cooked');
          setLocationText('');
          setCoordinates(null);
          resetImages();

          // Invalidate caches so the home screen and map see the new post instantly
          queryClient.invalidateQueries();

          Alert.alert('Thành công', 'Đăng món ăn thành công!');
          router.push('/(tabs)' as any);
        },
        onError: (err: any) => Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra khi đăng bài'),
      }
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <PostHeader
        paddingTop={insets.top}
        onBack={() => router.back()}
        isPending={createPostMutation.isPending}
        onSubmit={handlePreSubmit}
      />

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Images */}
        <View className="mb-8">
          <PostImagePicker
            images={images}
            onAddImage={handleAddImage}
            onRemoveImage={removeImage}
            onPreview={setPreviewImage}
          />
        </View>

        {/* Form Fields */}
        <View className="flex-col gap-6 pb-8">
          <Input
            label="Tên món ăn *"
            placeholder="VD: Cơm tấm sườn bì chả"
            className="bg-[#F8FAF8] border-0"
            value={title}
            onChangeText={setTitle}
          />

          <Textarea
            label="Mô tả"
            placeholder="Màu sắc, hương vị, tình trạng..."
            className="bg-[#F8FAF8] border-0"
            value={description}
            onChangeText={setDescription}
          />

          <PostCategoryPicker value={category} onChange={setCategory} />

          <View className="flex-row gap-4 mt-2 items-end">
            <View className="w-1/2">
              <PostQuantityInput value={quantity} onChange={setQuantity} />
            </View>
            <PostUnitPicker value={unit} onChange={setUnit} />
          </View>

          <View className="mt-2">
            <PostLocationInput value={locationText} onChange={setLocationText} onGetLocation={getLocation} />
          </View>

          <Button
            className="w-full mt-6 shadow-xl shadow-[#2E7D32]/30 bg-[#2E7D32]"
            onPress={handlePreSubmit}
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-extrabold text-lg">🌱 Đăng món ăn</Text>
            }
          </Button>
        </View>
      </ScrollView>

      <PostImagePreviewModal uri={previewImage} onClose={() => setPreviewImage(null)} />

      <PostConfirmModal
        visible={showConfirmModal}
        title={title}
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmModal(false)}
        bottomInset={insets.bottom}
      />
    </KeyboardAvoidingView>
  );
}