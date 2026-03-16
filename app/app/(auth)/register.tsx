import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Leaf, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4

  // Simulated password strength checker
  const handlePasswordChange = (text: string) => {
    let strength = 0;
    if (text.length > 5) strength += 1;
    if (text.length > 8) strength += 1;
    if (/[A-Z]/.test(text)) strength += 1;
    if (/[0-9!@#$%^&*]/.test(text)) strength += 1;
    setPasswordStrength(strength);
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
        >
          {/* Top Bar */}
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-border-green">
              <ArrowLeft size={20} color="#1A2E1A" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-[28px] font-bold text-text-main tracking-tight mb-2">Tạo tài khoản mới 🌱</Text>
            <Text className="text-base text-text-secondary font-medium">Bắt đầu hành trình sống xanh cùng GreenShare</Text>
          </View>

          <View className="space-y-4 mb-8">
            {/* Name */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Họ và tên</Text>
              <TextInput
                placeholder="Nhập họ và tên của bạn"
                placeholderTextColor="#9CA3AF"
                className="bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base focus:border-primary focus:bg-white"
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Email</Text>
              <TextInput
                placeholder="example@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base focus:border-primary focus:bg-white"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Mật khẩu</Text>
              <View className="relative mb-2">
                <TextInput
                  placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  onChangeText={handlePasswordChange}
                  className="bg-surface rounded-xl border border-border-green px-4 py-3.5 pr-12 text-text-main text-base focus:border-primary focus:bg-white"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              <View className="flex-row gap-1.5 mt-1">
                {[1, 2, 3, 4].map((level) => (
                  <View 
                    key={level} 
                    className={`flex-1 h-1.5 rounded-full ${
                      passwordStrength >= level 
                        ? passwordStrength <= 2 ? 'bg-warning' : 'bg-primary' 
                        : 'bg-surface-dark'
                    }`} 
                  />
                ))}
              </View>
              <Text className={`text-xs mt-1.5 font-medium ${
                passwordStrength === 0 ? 'text-text-secondary' : 
                passwordStrength <= 2 ? 'text-warning' : 'text-primary'
              }`}>
                {passwordStrength === 0 ? 'Bảo mật mật khẩu' : 
                 passwordStrength <= 2 ? 'Mật khẩu yếu' : 'Mật khẩu mạnh'}
              </Text>
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Xác nhận mật khẩu</Text>
              <TextInput
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base focus:border-primary focus:bg-white"
              />
            </View>
          </View>

          {/* Terms */}
          <View className="flex-row items-center gap-3 mb-8 px-1">
            <View className="w-5 h-5 border-2 border-primary rounded items-center justify-center bg-primary">
               {/* Checked state mockup */}
               <Text className="text-white text-xs font-bold">✓</Text>
            </View>
            <Text className="flex-1 text-sm text-text-secondary leading-tight">
              Tôi đồng ý với <Text className="text-primary font-bold">Điều khoản</Text> và <Text className="text-primary font-bold">Chính sách bảo mật</Text> của GreenShare
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="bg-primary rounded-2xl py-4 flex-row justify-center items-center gap-2 mb-8 shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-lg">Đăng ký tài khoản</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-auto">
            <Text className="text-text-secondary font-medium">Đã có tài khoản? </Text>
            <Link href={"/(auth)/login" as any} asChild>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text className="text-primary font-bold">Đăng nhập</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
