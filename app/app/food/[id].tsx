import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Star, MapPin, Clock, Send, MessageCircle, Info } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-light" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white items-center justify-center border border-border-green shadow-sm shadow-black/5">
          <ArrowLeft size={20} color="#1a2e1a" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center border border-border-green shadow-sm shadow-black/5">
          <Heart size={20} color="#ef5350" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View className="mx-5 my-2 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5DAbJpIpRhGw9CWhhInNiMx_El_9fkj0cU6uR74WczkG-6IGvpC_XebtWcEcmFNnutK42NCd8Galbd_mZJUSjHvC_2hbyQFqNR2MLrSIkaAabARLPgsP__V3Q6qyWCSBaVa2VZNS3hO0zKfo_CDJcCftyQ9OjUnVd2qEgh-LcPqG9X82DJGosOSFOtyvWYkR5-QbUZ0vbFLeUZxTV9K1Rf5gQ9-tJ_fJyhcRQF_voFswdoSAn7L0sHiD_Xd6gdK18p5CrWHBDg' }}
            className="w-full h-64"
            resizeMode="cover"
          />
          {/* Pagination dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-white" />
            <View className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <View className="w-2.5 h-2.5 rounded-full bg-white/40" />
          </View>
        </View>

        {/* Status Badge */}
        <View className="px-5 mt-4">
          <View className="self-start flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light mb-3">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <Text className="text-xs font-bold text-primary uppercase">Còn nhận</Text>
          </View>

          <Text className="text-2xl font-bold text-text-main mb-2">Cơm tấm sườn bì chả</Text>
          <Text className="text-sm text-text-secondary leading-relaxed">
            Phần cơm được chuẩn bị từ nhà hàng sáng nay, đầy đủ sườn bì chả, dưa leo và nước mắm.
            Còn nguyên trong hộp xốp chưa khui, đảm bảo vệ sinh.
          </Text>

          {/* Quantity & Expiry */}
          <View className="flex-row items-center gap-4 py-4 mt-3 border-y border-border-green">
            <View className="flex-row items-center gap-2">
              <Text className="text-primary">🍽️</Text>
              <Text className="text-sm font-semibold text-text-main">3 phần</Text>
            </View>
            <View className="w-px h-4 bg-border-green" />
            <View className="flex-row items-center gap-2">
              <Clock size={14} color="#2f7f34" />
              <Text className="text-sm font-semibold text-text-main">HSD: 15/03/2025</Text>
            </View>
          </View>

          {/* Poster Info */}
          <View className="bg-white rounded-2xl p-4 mt-4 border border-border-green shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-xl">👩</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-text-main">Nguyễn Thị Lan</Text>
                <View className="flex-row items-center gap-1">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-xs font-bold text-text-main">94/100</Text>
                  <Text className="text-xs text-text-secondary ml-2">23 lần chia sẻ</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-start gap-2">
              <MapPin size={16} color="#2f7f34" />
              <View>
                <Text className="font-medium text-text-main text-sm">Quận 1, TP.HCM</Text>
                <Text className="text-xs text-text-secondary">Cách bạn 0.8km</Text>
              </View>
            </View>
          </View>

          {/* Info Note */}
          <View className="flex-row items-center gap-2 p-3 bg-yellow-50 rounded-xl mt-4 mb-4">
            <Info size={14} color="#92400e" />
            <Text className="text-xs text-yellow-800 flex-1">
              Vui lòng xác nhận qua tin nhắn sau khi gửi yêu cầu nhận.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View 
        className="px-5 pt-4 bg-white" 
        style={{ 
          borderTopWidth: 1, 
          borderTopColor: '#d4e8d4', 
          paddingBottom: Math.max(insets.bottom + 12, 16) 
        }}
      >
        <TouchableOpacity className="bg-primary rounded-xl py-4 items-center flex-row justify-center gap-2 mb-2">
          <Send size={18} color="#ffffff" />
          <Text className="text-white font-bold text-base">Gửi yêu cầu nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border-2 border-primary/30 rounded-xl py-4 items-center flex-row justify-center gap-2">
          <MessageCircle size={18} color="#2f7f34" />
          <Text className="text-primary font-bold text-base">Nhắn tin hỏi thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
