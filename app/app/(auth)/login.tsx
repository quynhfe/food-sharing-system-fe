import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react-native';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

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
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
              <Leaf size={32} color="#2E7D32" fill="#2E7D32" />
            </View>
            <Text className="text-[28px] font-bold text-text-main mb-2 text-center tracking-tight">Chào mừng trở lại 👋</Text>
            <Text className="text-base text-text-secondary text-center pr-4 font-medium">Đăng nhập để tiếp tục chia sẻ</Text>
          </View>

          <View className="space-y-4 mb-4">
            {/* Email */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Email</Text>
              <TextInput
                placeholder="Nhập email của bạn"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-surface rounded-xl border border-border-green px-4 py-3.5 text-text-main text-base focus:border-primary focus:bg-white"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-bold text-text-main mb-2 tracking-tight">Mật khẩu</Text>
              <View className="relative">
                <TextInput
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
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
            </View>
          </View>

          <TouchableOpacity className="mb-8 self-end py-2">
            <Text className="text-primary font-bold text-sm">Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="bg-primary rounded-2xl py-4 flex-row justify-center items-center gap-2 mb-6 shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-lg">Đăng nhập ngay</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border-green" />
            <Text className="px-4 text-text-secondary text-sm font-medium">Hoặc tiếp tục với</Text>
            <View className="flex-1 h-px bg-border-green" />
          </View>

          {/* Google */}
          <TouchableOpacity className="bg-white border border-border-green shadow-sm rounded-xl py-3.5 items-center flex-row justify-center gap-3 mb-8">
            <Image 
               source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
               className="w-5 h-5" 
               resizeMode="contain"
            />
            <Text className="font-bold text-text-main text-base">Google</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center mt-auto">
            <Text className="text-text-secondary font-medium">Bạn chưa có tài khoản? </Text>
            <Link href={"/(auth)/register" as any} asChild>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text className="text-primary font-bold">Đăng ký</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
