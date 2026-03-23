// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { Mail, Lock, Eye, ArrowLeft, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

export default function Register() {
  const insets = useSafeAreaInsets();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc.', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.', 'warning');
      return;
    }
    if (!agreedToTerms) {
      showToast('Bạn phải đồng ý với Điều khoản & Chính sách bảo mật.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ fullName, email, password });
      showToast('Đăng ký tài khoản thành công!', 'success');
      setTimeout(() => router.replace('/(tabs)'), 1200);
    } catch (error: any) {
      showToast(error.toString(), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
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

          <TouchableOpacity 
            className="flex-row items-start gap-3 mt-2" 
            activeOpacity={0.8}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View className={`mt-1 w-5 h-5 rounded-[6px] border-[1.5px] items-center justify-center ${agreedToTerms ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-slate-300 bg-white'}`}>
              {agreedToTerms && <Text className="text-white text-xs font-extrabold">✓</Text>}
            </View>
            <Text className="text-sm text-slate-600 flex-1 font-medium leading-relaxed">
              Tôi đồng ý với <Text className="text-[#2E7D32] font-bold">Điều khoản</Text> & <Text className="text-[#2E7D32] font-bold">Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>

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