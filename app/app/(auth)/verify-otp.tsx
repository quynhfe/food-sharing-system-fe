// app/(auth)/verify-otp.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, TouchableOpacity, ScrollView, KeyboardAvoidingView,
  Platform, TextInput, ActivityIndicator
} from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { storage } from '../../utils/storage';

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    storage.getItem('resetEmail').then((e) => { if (e) setEmail(e); });
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // only last typed char
    setOtp(newOtp);
    // Auto-focus next
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      showToast('Vui lòng nhập đủ 6 chữ số OTP.', 'warning');
      return;
    }
    try {
      setIsLoading(true);
      await authService.verifyOtp(email, otpString);
      // Save OTP for reset step
      await storage.setItem('resetOtp', otpString);
      showToast('Xác nhận thành công!', 'success');
      setTimeout(() => router.push('/(auth)/reset-password'), 800);
    } catch (error: any) {
      showToast(error.toString(), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setIsResending(true);
      await authService.forgotPassword(email);
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(60);
      inputRefs.current[0]?.focus();
      showToast('Mã OTP mới đã được gửi!', 'success');
    } catch (error: any) {
      showToast(error.toString(), 'error');
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '*') + c);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled">

        {/* Header nav */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View className="items-center px-6 pb-8 pt-2">
          <View className="w-28 h-28 bg-[#E8F5E9] rounded-full items-center justify-center mb-6 shadow-sm shadow-[#2E7D32]/10">
            <ShieldCheck size={52} color="#2E7D32" />
          </View>
          <Text className="text-slate-800 text-3xl font-extrabold leading-tight text-center mb-3">
            Nhập mã OTP
          </Text>
          <Text className="text-slate-500 text-base font-medium text-center leading-relaxed">
            Mã 6 chữ số đã được gửi đến{'\n'}
            <Text className="text-[#2E7D32] font-bold">{maskedEmail || 'email của bạn'}</Text>
          </Text>
        </View>

        {/* Step indicator */}
        <View className="flex-row items-center justify-center gap-2 px-6 mb-8">
          {[1, 2, 3].map((step) => (
            <View key={step} className={`h-2 rounded-full ${step === 2 ? 'w-8 bg-[#2E7D32]' : 'w-2 bg-slate-200'}`} />
          ))}
        </View>

        {/* OTP Input */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-center gap-3">
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                style={{
                  width: 48,
                  height: 60,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: otp[index] ? '#2E7D32' : '#E2E8F0',
                  backgroundColor: otp[index] ? '#F0FDF4' : '#F8FAFC',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '900',
                  color: '#1A2E1A',
                }}
              />
            ))}
          </View>

          {/* Timer */}
          <View className="items-center mt-6">
            {countdown > 0 ? (
              <Text className="text-slate-500 text-sm font-medium">
                Gửi lại sau <Text className="text-[#2E7D32] font-bold">{countdown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isResending} activeOpacity={0.7}>
                {isResending ? (
                  <ActivityIndicator size="small" color="#2E7D32" />
                ) : (
                  <Text className="text-[#2E7D32] text-sm font-bold">Gửi lại mã OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit */}
        <View className="px-6">
          <Button
            onPress={handleVerify}
            className={`w-full shadow-md shadow-[#2E7D32]/20 ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading || otp.join('').length < OTP_LENGTH}
          >
            {isLoading ? 'Đang xác nhận...' : 'Xác nhận mã OTP'}
          </Button>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
