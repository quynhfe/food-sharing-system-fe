// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { storage } from '../../utils/storage';

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleForgot = async () => {
    if (!email) {
      showToast('Vui lòng nhập địa chỉ email của bạn.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Email không đúng định dạng.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      // Lưu email để dùng ở màn tiếp theo
      await storage.setItem('resetEmail', email);
      showToast('Mã OTP đã được gửi đến email của bạn!', 'success');
      setTimeout(() => router.push('/(auth)/verify-otp'), 1000);
    } catch (error: any) {
      showToast(error.toString(), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}>
        
        {/* Header nav */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View className="items-center px-6 pb-8 pt-2">
          <View className="w-28 h-28 bg-[#E8F5E9] rounded-full items-center justify-center mb-6 shadow-sm shadow-[#2E7D32]/10">
            <Text className="text-6xl">📧</Text>
          </View>
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight text-center mb-3">
            Quên mật khẩu?
          </Text>
          <Text className="text-slate-500 text-base font-medium text-center leading-relaxed">
            Nhập địa chỉ email đã đăng ký.{'\n'}Chúng tôi sẽ gửi mã OTP để xác nhận.
          </Text>
        </View>

        {/* Step indicator */}
        <View className="flex-row items-center justify-center gap-2 px-6 mb-8">
          {[1, 2, 3].map((step) => (
            <View key={step} className={`h-2 rounded-full ${step === 1 ? 'w-8 bg-[#2E7D32]' : 'w-2 bg-slate-200'}`} />
          ))}
        </View>

        {/* Form */}
        <View className="px-6 flex-col gap-5">
          <Input
            label="Địa chỉ Email"
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            startIcon={<Mail size={20} color="#94a3b8" />}
            value={email}
            onChangeText={setEmail}
          />

          <Button
            onPress={handleForgot}
            className={`w-full mt-4 shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
            startIcon={<Send size={20} color="white" />}
          >
            {isLoading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP'}
          </Button>
        </View>

        {/* Footer */}
        <View className="flex-1 justify-end items-center pt-10">
          <Text className="text-slate-600 text-sm font-medium">
            Nhớ mật khẩu rồi? <Text onPress={() => router.replace('/(auth)/login')} className="text-[#2E7D32] font-extrabold">Đăng nhập</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
