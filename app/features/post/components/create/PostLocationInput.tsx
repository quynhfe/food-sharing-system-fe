import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';

interface PostLocationInputProps {
  value: string;
  onChange: (val: string) => void;
  onGetLocation: () => void;
}

export function PostLocationInput({ value, onChange, onGetLocation }: PostLocationInputProps) {
  return (
    <Input
      label="Địa điểm lấy món *"
      placeholder="Chọn vị trí trên bản đồ"
      className="bg-[#F8FAF8] border-0 pr-12"
      value={value}
      onChangeText={onChange}
      endIcon={
        <TouchableOpacity
          onPress={onGetLocation}
          className="w-10 h-10 bg-[#E8F5E9] rounded-xl items-center justify-center -mr-2"
        >
          <MapPin color="#2E7D32" size={20} />
        </TouchableOpacity>
      }
    />
  );
}
