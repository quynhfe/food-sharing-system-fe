import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';

export function useImagePicker() {
  const [images, setImages] = useState<string[]>([]);

  const pickFromLibrary = async () => {
    if (images.length >= 5) {
      Alert.alert('Giới hạn ảnh', 'Bạn chỉ có thể đăng tối đa 5 ảnh.');
      return;
    }

    const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Quyền truy cập thư viện ảnh',
        canAskAgain
          ? 'Vui lòng cấp quyền truy cập thư viện ảnh để thêm sản phẩm.'
          : 'Vui lòng cấp quyền trong Cài đặt để thêm ảnh.',
        !canAskAgain
          ? [{ text: 'Hủy', style: 'cancel' }, { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() }]
          : undefined,
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
    }
  };

  const takePhoto = async () => {
    try {
      const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập máy ảnh',
          canAskAgain
            ? 'Vui lòng cấp quyền truy cập máy ảnh để chụp ảnh.'
            : 'Vui lòng cấp quyền truy cập máy ảnh trong Cài đặt.',
          !canAskAgain
            ? [{ text: 'Hủy', style: 'cancel' }, { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() }]
            : undefined,
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled) {
        setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
      }
    } catch (e: any) {
      Alert.alert('Lỗi Camera', e?.message || 'Không thể mở máy ảnh. Vui lòng kiểm tra quyền trong Cài đặt.');
    }
  };

  const handleAddImage = () => {
    if (images.length >= 5) {
      Alert.alert('Giới hạn ảnh', 'Bạn chỉ có thể đăng tối đa 5 ảnh.');
      return;
    }
    Alert.alert('Thêm ảnh sản phẩm', 'Bạn muốn thêm ảnh bằng cách nào?', [
      { text: 'Chụp ảnh', onPress: takePhoto },
      { text: 'Chọn từ thư viện', onPress: pickFromLibrary },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetImages = () => setImages([]);

  return { images, handleAddImage, removeImage, resetImages };
}
