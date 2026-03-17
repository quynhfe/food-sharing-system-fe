// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleForgot = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.forgotPassword(email);
      setIsSent(true);
      // In this mock flow, you can show the token if needed, or just a success message
      console.log('Reset Token:', res.data.resetToken);
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
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight">Quên mật khẩu? 🔑</Text>
          <Text className="text-slate-500 mt-3 text-base font-medium">
            {isSent 
              ? 'Yêu cầu khôi phục đã được xử lý. Vui lòng kiểm tra email (Giả lập: Xem log server để thấy token).' 
              : 'Đừng lo, hãy nhập email của bạn để bắt đầu quá trình khôi phục.'}
          </Text>
        </View>

        {!isSent ? (
          <View className="px-6 flex-col gap-5">
            <Input 
              label="Email" 
              placeholder="example@email.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              startIcon={<Mail size={20} color="#94a3b8" />} 
              value={email}
              onChangeText={setEmail}
            />

            <Button 
              onPress={handleForgot} 
              className={`w-full mt-6 shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
              disabled={isLoading}
              startIcon={<Send size={20} color="white" />}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </View>
        ) : (
          <View className="px-6">
            <Button 
              onPress={() => router.replace('/(auth)/login')} 
              className="w-full mt-6"
            >
              Quay lại đăng nhập
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
