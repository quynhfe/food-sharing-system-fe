// app/(auth)/reset-password.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { storage } from '../../utils/storage';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Ít nhất 6 ký tự', valid: password.length >= 6 },
    { label: 'Có chữ hoa', valid: /[A-Z]/.test(password) },
    { label: 'Có số', valid: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.valid).length;
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-[#2E7D32]'];
  const labels = ['', 'Yếu', 'Trung bình', 'Mạnh'];

  if (!password) return null;

  return (
    <View className="mt-3">
      <View className="flex-row gap-1.5 h-1.5">
        {[0, 1, 2].map((i) => (
          <View key={i} className={`flex-1 rounded-full ${i < score ? colors[score] : 'bg-slate-200'}`} />
        ))}
      </View>
      <Text className={`text-xs mt-1.5 font-bold ${score === 3 ? 'text-[#2E7D32]' : score === 2 ? 'text-amber-500' : 'text-red-400'}`}>
        {labels[score]}
      </Text>
      <View className="flex-col gap-1 mt-2">
        {checks.map((c, i) => (
          <View key={i} className="flex-row items-center gap-1.5">
            <CheckCircle size={12} color={c.valid ? '#2E7D32' : '#CBD5E1'} />
            <Text className={`text-xs font-medium ${c.valid ? 'text-[#2E7D32]' : 'text-slate-400'}`}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ResetPassword() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự.', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      const email = await storage.getItem('resetEmail');
      const otp = await storage.getItem('resetOtp');
      if (!email || !otp) {
        showToast('Phiên xác thực không hợp lệ. Vui lòng thử lại.', 'error');
        router.replace('/(auth)/forgot-password');
        return;
      }
      await authService.resetPassword(email, otp, password);
      // Cleanup stored data
      await storage.removeItem('resetEmail');
      await storage.removeItem('resetOtp');
      setIsDone(true);
      showToast('Mật khẩu đã được thay đổi thành công!', 'success');
    } catch (error: any) {
      showToast(error.toString(), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isDone) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
        <View className="w-32 h-32 bg-[#E8F5E9] rounded-full items-center justify-center mb-8 shadow-lg shadow-[#2E7D32]/20">
          <Text className="text-6xl">🎉</Text>
        </View>
        <Text className="text-3xl font-extrabold text-[#1A2E1A] text-center mb-3">Đặt lại thành công!</Text>
        <Text className="text-slate-500 text-base font-medium text-center leading-relaxed mb-10">
          Mật khẩu của bạn đã được cập nhật.{'\n'}Vui lòng đăng nhập lại.
        </Text>
        <Button className="w-full shadow-md shadow-[#2E7D32]/20" onPress={() => router.replace('/(auth)/login')}>
          Đăng nhập ngay
        </Button>
      </View>
    );
  }

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
            <Text className="text-6xl">🔐</Text>
          </View>
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight text-center mb-3">
            Mật khẩu mới
          </Text>
          <Text className="text-slate-500 text-base font-medium text-center leading-relaxed">
            Tạo một mật khẩu mạnh để{'\n'}bảo vệ tài khoản của bạn.
          </Text>
        </View>

        {/* Step indicator */}
        <View className="flex-row items-center justify-center gap-2 px-6 mb-8">
          {[1, 2, 3].map((step) => (
            <View key={step} className={`h-2 rounded-full ${step === 3 ? 'w-8 bg-[#2E7D32]' : 'w-2 bg-slate-200'}`} />
          ))}
        </View>

        {/* Form */}
        <View className="px-6 flex-col gap-5">
          <View>
            <Input
              label="Mật khẩu mới"
              placeholder="••••••••"
              secureTextEntry={!showPass}
              startIcon={<Lock size={20} color="#94a3b8" />}
              endIcon={
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              }
              value={password}
              onChangeText={setPassword}
            />
            <PasswordStrength password={password} />
          </View>

          <Input
            label="Xác nhận mật khẩu mới"
            placeholder="••••••••"
            secureTextEntry={!showConfirm}
            startIcon={<Lock size={20} color="#94a3b8" />}
            endIcon={
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
              </TouchableOpacity>
            }
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Match indicator */}
          {confirmPassword.length > 0 && (
            <View className="flex-row items-center gap-2 -mt-2">
              <CheckCircle size={16} color={password === confirmPassword ? '#2E7D32' : '#EF4444'} />
              <Text className={`text-xs font-bold ${password === confirmPassword ? 'text-[#2E7D32]' : 'text-red-400'}`}>
                {password === confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
              </Text>
            </View>
          )}

          <Button
            onPress={handleReset}
            className={`w-full mt-4 shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang cập nhật...' : 'Đặt mật khẩu mới'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
