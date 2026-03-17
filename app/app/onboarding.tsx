// app/onboarding.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from '../components/ui/text';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../components/ui/Button';
import { MotiView, MotiImage, AnimatePresence } from 'moti';

const slides = [
  {
    title: "Chia sẻ thực phẩm dễ dàng",
    subtitle: "Đăng món ăn dư thừa của bạn chỉ trong 2 phút – giúp người cần, giảm lãng phí",
    image: "https://images.unsplash.com/photo-1593113565694-c6f8716c0296?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Kết nối cộng đồng gần bạn",
    subtitle: "Hàng trăm người trong khu vực sẵn sàng nhận và chia sẻ thực phẩm mỗi ngày",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Theo dõi tác động của bạn",
    subtitle: "Mỗi món bạn chia sẻ đều được ghi nhận – xem bạn đã cứu bao nhiêu kg thực phẩm",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800",
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF8]">
      <View className="flex-row justify-end px-6 py-4">
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')} activeOpacity={0.7}>
          <Text className="text-slate-500 font-bold text-sm">Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative overflow-hidden items-center justify-center px-8">
        <AnimatePresence exitBeforeEnter>
          <MotiImage
            key={step}
            source={{ uri: slides[step].image }}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-[280px] h-[280px] rounded-full shadow-2xl bg-slate-100"
            resizeMode="cover"
          />
        </AnimatePresence>
      </View>

      <View className="bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex-col items-center px-8 pt-6 pb-12">
        <View className="w-12 h-1.5 bg-slate-200 rounded-full mb-8"></View>

        <View className="flex-row gap-2.5 mb-8">
          {[0, 1, 2].map(i => (
            <View key={i} className={`h-2.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#2E7D32]' : 'w-2.5 bg-slate-200'}`} />
          ))}
        </View>

        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={step}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            className="items-center min-h-[120px]"
          >
            <Text className="text-slate-800 text-center text-[28px] font-extrabold leading-tight mb-4">{slides[step].title}</Text>
            <Text className="text-slate-500 text-center text-base leading-relaxed">{slides[step].subtitle}</Text>
          </MotiView>
        </AnimatePresence>

        <View className="w-full mt-6">
          {step < 2 ? (
            <Button className="w-full" onPress={handleNext} endIcon={<ArrowRight size={20} color="white" />}>
              Tiếp tục
            </Button>
          ) : (
            <View className="flex-col gap-4 w-full">
               <Button className="w-full" onPress={handleNext}>Bắt đầu ngay</Button>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')} className="flex-row justify-center mt-2 p-2">
                <Text className="text-sm font-medium text-slate-600">
                  Đã có tài khoản? <Text className="text-[#2E7D32] font-extrabold">Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}