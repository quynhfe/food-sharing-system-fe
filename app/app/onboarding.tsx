import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { ArrowRight, Cloud, Leaf } from "lucide-react-native";
import { router } from "expo-router";

const ONBOARDING_DATA = [
  {
    step: 1,
    title: "Chia sẻ thực phẩm dễ dàng",
    subtitle:
      "Đăng món ăn dư thừa của bạn chỉ trong 2 phút – giúp người cần, giảm lãng phí",
    buttonText: "Tiếp tục",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop" // Friendly food sharing
  },
  {
    step: 2,
    title: "Kết nối cộng đồng gần bạn",
    subtitle:
      "Hàng trăm người trong khu vực sẵn sàng nhận và chia sẻ thực phẩm mỗi ngày",
    buttonText: "Tiếp tục",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop" // Community / Group
  },
  {
    step: 3,
    title: "Theo dõi tác động của bạn",
    subtitle:
      "Mỗi món bạn chia sẻ đều được ghi nhận – xem bạn đã cứu bao nhiêu kg thực phẩm",
    buttonText: "Bắt đầu ngay",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop" // Environment / Leaf
  }
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const data = ONBOARDING_DATA[step - 1];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F6F8F6] dark:bg-[#131F14]">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingTop: insets.top, 
          paddingBottom: Math.max(insets.bottom, 16) 
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Section */}
        <View className="flex-1 min-h-[380px] w-full relative overflow-hidden items-center justify-center p-8 pb-12">
        {step > 1 && (
          <View className="absolute top-4 right-6 z-20">
            <TouchableOpacity
              onPress={handleSkip}
              className="px-4 py-2">
              <Text className="text-slate-500 font-medium text-sm">Bỏ qua</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Decorative elements based on step */}
        {step === 1 && (
          <View className="absolute inset-0 bg-primary/5 rounded-full scale-125 translate-y-20 mx-auto w-[400px] h-[400px]" />
        )}

        {step === 2 && (
          <View className="relative w-full aspect-square max-w-[320px] bg-primary/10 rounded-full flex items-center justify-center">
            <Image
              source={{ uri: data.image }}
              className="w-[85%] h-[85%] rounded-full opacity-90"
            />
            <View className="absolute top-10 right-4 bg-white p-3 rounded-2xl shadow-lg border border-primary/20">
              <Text className="text-xl">📍</Text>
            </View>
            <View className="absolute bottom-10 left-4 bg-white p-3 rounded-2xl shadow-lg border border-primary/20">
              <Text className="text-xl">🤝</Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View className="w-full h-full gap-1 overflow-hidden bg-primary/5 rounded-3xl flex items-center justify-center relative shadow-sm">
            <View className="absolute inset-0 flex items-center justify-center z-10">
              <View className="w-64 h-80 bg-white rounded-3xl shadow-xl border border-primary/20 flex flex-col p-5">
                <View className="w-full h-8 bg-primary/10 rounded-full mb-6" />
                <View className="flex-row items-center gap-4 mb-8">
                  <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Leaf
                      size={24}
                      color="white"
                      fill="white"
                    />
                  </View>
                  <View className="space-y-2.5 flex-1">
                    <View className="w-24 h-2.5 bg-slate-200 rounded-full" />
                    <View className="w-16 h-2.5 bg-slate-100 rounded-full" />
                  </View>
                </View>
                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 h-20 bg-primary/5 rounded-2xl flex-col items-center justify-center gap-1 border border-primary/10">
                    <Text className="text-base text-primary font-black">
                      12kg
                    </Text>
                    <Text className="text-[10px] text-slate-500 font-medium uppercase">
                      Giảm CO₂
                    </Text>
                  </View>
                  <View className="flex-1 h-20 bg-primary/5 rounded-2xl flex-col items-center justify-center gap-1 border border-primary/10">
                    <Text className="text-base text-primary font-black">
                      5 món
                    </Text>
                    <Text className="text-[10px] text-slate-500 font-medium uppercase">
                      Đã cứu
                    </Text>
                  </View>
                </View>
                <View className="mt-auto items-center mb-2">
                  <Text className="text-5xl opacity-40">🌳</Text>
                </View>
              </View>
            </View>
            <Cloud
              size={60}
              color="#218c28"
              className="absolute top-10 left-10 opacity-20"
            />
            <Leaf
              size={80}
              color="#218c28"
              className="absolute bottom-12 right-6 opacity-30"
            />
          </View>
        )}

        {/* Normal image for step 1 */}
        {step === 1 && (
          <Image
            source={{ uri: data.image }}
            className="w-full h-[300px] rounded-[40px] z-10 mt-10"
            resizeMode="cover"
          />
        )}
        </View>

        {/* Bottom Card Section */}
        <View
          className="w-full bg-white dark:bg-slate-900 rounded-t-[36px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex-col items-center px-8 pt-6 pb-6 z-20 mt-auto">
        {/* Handle */}
        <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6" />

        {/* Progress Dots */}
        <View className="flex-row gap-2 mb-6">
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              className={`h-2 rounded-full ${
                step === dot
                  ? "w-8 bg-primary"
                  : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </View>

        {/* Text */}
        <View className="items-center justify-center mb-6 w-full">
          <Text
            className="text-slate-900 dark:text-slate-100 text-[24px] font-bold leading-tight text-center mb-2 tracking-tight"
            numberOfLines={2}>
            {data.title}
          </Text>
          <Text
            className="text-slate-600 dark:text-slate-400 text-[14px] text-center leading-relaxed"
            numberOfLines={2}>
            {data.subtitle}
          </Text>
        </View>

        {/* Actions */}
        <View className="w-full gap-3 mt-auto">
          <TouchableOpacity
            onPress={handleNext}
            className="w-full bg-primary hover:bg-primary/90 rounded-2xl py-3.5 flex-row items-center justify-center gap-2 shadow-sm shadow-black/5">
            <Text className="text-white font-bold text-lg">
              {data.buttonText}
            </Text>
            {step < 3 && (
              <ArrowRight
                size={20}
                color="white"
              />
            )}
          </TouchableOpacity>

          {step === 3 && (
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              className="py-2 flex-row justify-center items-center gap-1">
              <Text className="text-slate-600 text-sm font-medium">
                Đã có tài khoản?
              </Text>
              <Text className="text-primary font-bold text-sm">Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
