// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import { Mail, Lock, Eye, ArrowLeft, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';

export default function Register() {
  const insets = useSafeAreaInsets();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ fullName, email, password });
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}>
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pt-2 pb-8">
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight">Tạo tài khoản mới 🌱</Text>
          <Text className="text-slate-500 mt-3 text-base font-medium">Tham gia cùng chúng tôi để bắt đầu hành trình xanh của bạn.</Text>
        </View>

        <View className="px-6 flex-col gap-5">
          <Input 
            label="Họ và tên" 
            placeholder="Nhập họ và tên của bạn" 
            startIcon={<User size={20} color="#94a3b8" />} 
            value={fullName}
            onChangeText={setFullName}
          />
          <Input 
            label="Email" 
            placeholder="example@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            startIcon={<Mail size={20} color="#94a3b8" />} 
            value={email}
            onChangeText={setEmail}
          />

          <View className="flex-col w-full">
            <Input 
              label="Mật khẩu" 
              placeholder="••••••••" 
              secureTextEntry 
              startIcon={<Lock size={20} color="#94a3b8" />} 
              endIcon={<Eye size={20} color="#94a3b8" />} 
              value={password}
              onChangeText={setPassword}
            />
            <View className="mt-3">
              <View className="flex-row gap-1.5 h-1.5 w-full">
                <View className="flex-1 rounded-full bg-[#2E7D32]"></View>
                <View className="flex-1 rounded-full bg-[#2E7D32]"></View>
                <View className="flex-1 rounded-full bg-[#2E7D32]/20"></View>
                <View className="flex-1 rounded-full bg-[#2E7D32]/20"></View>
              </View>
              <Text className="text-[11px] mt-2 text-[#2E7D32] font-bold">Mật khẩu khá (Sử dụng thêm ký tự đặc biệt)</Text>
            </View>
          </View>

          <Input 
            label="Xác nhận mật khẩu" 
            placeholder="••••••••" 
            secureTextEntry 
            startIcon={<Lock size={20} color="#94a3b8" />} 
            endIcon={<Eye size={20} color="#94a3b8" />} 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View className="flex-row items-start gap-3 mt-2">
            <View className="mt-1 w-5 h-5 rounded-[6px] border-[1.5px] border-slate-300"></View>
            <Text className="text-sm text-slate-600 flex-1 font-medium leading-relaxed">
              Tôi đồng ý với <Text className="text-[#2E7D32] font-bold">Điều khoản</Text> & <Text className="text-[#2E7D32] font-bold">Chính sách bảo mật</Text>
            </Text>
          </View>

          <Button 
            onPress={handleRegister} 
            className={`w-full mt-6 shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </View>

        <View className="flex-1 justify-end items-center pt-10 pb-6">
          <Text className="text-slate-600 text-sm font-medium">
            Đã có tài khoản? <Text onPress={() => router.replace('/(auth)/login')} className="text-[#2E7D32] font-extrabold">Đăng nhập</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}