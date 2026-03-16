import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, MapPin, Calendar, Image as ImageIcon } from 'lucide-react-native';

const ImagePickerZone = () => (
  <TouchableOpacity className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl py-12 items-center justify-center mb-6 shadow-sm shadow-black/5">
    <View className="bg-primary/10 p-4 rounded-full mb-3">
      <Camera size={32} color="#2E7D32" />
    </View>
    <Text className="text-base font-bold text-primary">Chạm để tải ảnh</Text>
    <Text className="text-sm text-text-secondary mt-1">
      Tải lên tối đa 5 hình ảnh rõ nét
    </Text>
  </TouchableOpacity>
);

const PostFormField = ({
  label,
  placeholder,
  multiline = false,
  required = false
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
}) => (
  <View className="mb-5">
    <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">
      {label} {required && <Text className="text-danger">*</Text>}
    </Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      className={`bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base focus:border-primary focus:bg-white shadow-sm shadow-black/5 ${
        multiline ? 'min-h-[120px] text-start pt-4' : ''
      }`}
      style={multiline ? { textAlignVertical: 'top' } : {}}
    />
  </View>
);

export default function CreatePostScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Fake Header for Bottom Sheet Look */}
      <View className="px-5 pt-4 pb-2 border-b border-border-green/50 bg-white">
        <View className="flex-row justify-between items-center mb-2">
           <Text className="text-2xl font-black text-text-main tracking-tight">Đăng món ăn</Text>
           <TouchableOpacity className="bg-surface px-4 py-2 rounded-full">
             <Text className="text-sm font-bold text-text-main">Hủy</Text>
           </TouchableOpacity>
        </View>
        <Text className="text-text-secondary text-sm">
          Chia sẻ thực phẩm dư thừa để cùng nhau bảo vệ môi trường 🌍
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ImagePickerZone />

        <PostFormField 
          label="Tên món ăn" 
          placeholder="Ví dụ: Cơm cuộn rong biển..." 
          required 
        />
        
        <PostFormField
          label="Mô tả món ăn"
          placeholder="Thành phần, hương vị, lưu ý bảo quản..."
          multiline
        />

        <View className="flex-row gap-4 mb-5">
          <View className="flex-1">
            <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Số lượng</Text>
            <TextInput
              placeholder="0 phần"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base text-center font-semibold shadow-sm shadow-black/5"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Hạn sử dụng <Text className="text-danger">*</Text></Text>
            <TouchableOpacity className="bg-surface rounded-xl border border-border-green px-4 py-3.5 flex-row items-center justify-between shadow-sm shadow-black/5">
              <Text className="text-text-secondary text-base">Hôm nay</Text>
              <Calendar size={18} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Địa điểm lấy món <Text className="text-danger">*</Text></Text>
          <View className="bg-surface rounded-xl border border-border-green px-4 py-3.5 flex-row items-center gap-3 shadow-sm shadow-black/5">
            <MapPin size={18} color="#2E7D32" />
            <TextInput
              placeholder="Nhập địa chỉ của bạn"
              placeholderTextColor="#9CA3AF"
              defaultValue="Quận 1, TP.HCM"
              className="flex-1 text-text-main text-base p-0"
            />
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity className="bg-primary rounded-2xl py-4 items-center shadow-lg shadow-primary/30">
          <Text className="text-white font-bold text-lg">Đăng lên GreenShare</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}
