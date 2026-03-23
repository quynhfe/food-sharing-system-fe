// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Text } from '../../components/ui/text';
import { Mail, Lock, Eye, Leaf } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';

export default function Login() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Tạm thời bỏ qua validate và API để vào thẳng Home Test
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>
        <View className="flex-col items-center pb-8">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center shadow-sm">
              <Leaf size={22} color="#fff" />
            </View>
            <Text className="text-slate-800 text-2xl font-bold tracking-tight">FoodShare</Text>
          </View>
        </View>

        <View className="px-6 pb-8">
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight">Chào mừng{"\n"}trở lại 👋</Text>
          <Text className="text-slate-500 text-base mt-2 font-medium">Đăng nhập để tiếp tục chia sẻ</Text>
        </View>

        <View className="px-6 flex-col gap-5">
          <Input
            label="Email"
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            autoCapitalize="none"
            startIcon={<Mail size={20} color="#94a3b8" />}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            secureTextEntry
            startIcon={<Lock size={20} color="#94a3b8" />}
            endIcon={<Eye size={20} color="#94a3b8" />}
            value={password}
            onChangeText={setPassword}
          />

          <View className="flex-row justify-end">
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text className="text-[#2E7D32] text-sm font-bold">Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleLogin}
            className={`w-full mt-4 shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </View>

        <View className="px-6 py-8 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-slate-100"></View>
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">hoặc</Text>
          <View className="h-px flex-1 bg-slate-100"></View>
        </View>

        <View className="px-6">
          <Button variant="outline" className="w-full" startIcon={<Image source={{ uri: "https://www.svgrepo.com/show/475656/google-color.svg" }} className="w-6 h-6" />}>
            Tiếp tục với Google
          </Button>
        </View>

        <View className="flex-1 justify-end items-center pt-10">
          <Text className="text-slate-600 text-sm font-medium">
            Chưa có tài khoản? <Text onPress={() => router.push('/(auth)/register')} className="text-[#2E7D32] font-extrabold">Đăng ký ngay</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}