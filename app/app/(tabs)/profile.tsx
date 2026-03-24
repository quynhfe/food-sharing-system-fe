import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Award, Leaf, Heart, ChevronRight, LogOut, Package, MessageCircle, MapPin } from 'lucide-react-native';
import { Text } from '../../components/ui/text';
import { Card } from '../../components/ui/card';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { authService } from '../../services/authService';
import { impactService, type ImpactStats } from '../../services/impactService';
import { favoriteService } from '../../services/favoriteService';
import { type PostData } from '@/services/postService';
import { router, useFocusEffect } from 'expo-router';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [favorites, setFavorites] = useState<PostData[]>([]);
  const { toast, showToast, hideToast } = useToast();

  const loadData = useCallback(async () => {
    const data = await authService.getCurrentUser();
    setUser(data);
    try {
      const stats = await impactService.getStats('all');
      setImpact(stats);
    } catch {
      console.warn('Impact stats unavailable');
    }
    try {
      const favs = await favoriteService.getFavoritesLocal();
      setFavorites(favs);
    } catch {
      console.warn('Local favorites unavailable');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
      showToast('Đăng xuất thành công!', 'success');
      setTimeout(() => router.replace('/(auth)/login'), 1000);
    } catch {
      showToast('Không thể đăng xuất lúc này.', 'error');
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View
          className="bg-[#2E7D32] rounded-b-[40px] px-6 pb-12 pt-8 relative overflow-hidden"
          style={{ paddingTop: Math.max(insets.top, 20) }}
        >
          <View className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-extrabold text-white">Hồ sơ 👤</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/messages/index')}
                className="w-12 h-12 bg-white/20 rounded-full items-center justify-center backdrop-blur-md" 
                activeOpacity={0.8}
              >
                <MessageCircle size={22} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-full items-center justify-center backdrop-blur-md" activeOpacity={0.8}>
                <Settings size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center gap-5">
            <View className="relative">
              <Image source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=11" }} className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-slate-200" />
              <View className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-white mb-1">{user?.fullName || 'Người dùng'}</Text>
              <Text className="text-white/80 font-medium mb-2">{user?.email || 'Email chưa cập nhật'}</Text>
              <View className="bg-white/20 self-start px-3 py-1 rounded-full flex-row items-center gap-1.5">
                <Award size={14} color="#FDE047" />
                <Text className="text-white font-bold text-xs">{impact?.levelName || 'Người mới'}</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInUp.duration(600).delay(100)} className="px-6 -mt-8">
          <Card className="border-0 bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 flex-row justify-between">
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-[#E8F5E9] rounded-full items-center justify-center mb-2">
                <Package size={24} color="#2E7D32" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">{impact?.totalShared ?? 0}</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Đã chia sẻ</Text>
            </View>
            <View className="w-px bg-slate-100 mx-2" />
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                <Leaf size={24} color="#F59E0B" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">{impact?.totalFoodKg ?? 0}kg</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Đã cứu</Text>
            </View>
            <View className="w-px bg-slate-100 mx-2" />
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center mb-2">
                <Heart size={24} color="#10B981" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">{impact?.exp ?? 0}</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Điểm XP</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Favorites Horizontal List */}
        {favorites.length > 0 && (
          <View className="mt-8">
            <View className="px-6 flex-row justify-between items-center mb-4">
              <Text className="text-xl font-extrabold text-[#1A2E1A]">Ăn ngon đã lưu</Text>
              <TouchableOpacity onPress={() => router.push('/food/favorites')}>
                <Text className="text-sm font-bold text-[#2E7D32]">Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            >
              {favorites.map((item) => (
                <TouchableOpacity 
                  key={item._id}
                  onPress={() => router.push(`/food/${item._id}`)}
                  activeOpacity={0.8}
                  className="w-40 bg-white rounded-[24px] border border-slate-100 p-2 shadow-sm"
                >
                  <Image 
                    source={{ uri: item.images?.[0] }} 
                    className="w-full h-28 rounded-[20px] bg-slate-100 mb-2"
                  />
                  <Text className="text-sm font-bold text-[#1A2E1A] px-1" numberOfLines={1}>{item.title}</Text>
                  <View className="flex-row items-center gap-1 px-1 mb-1">
                    <MapPin size={10} color="#94A3B8" />
                    <Text className="text-[10px] font-bold text-slate-400" numberOfLines={1}>
                      {item.location?.district}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="px-6 mt-8 gap-4">
          <Text className="text-xl font-extrabold text-[#1A2E1A] mb-2">Tài khoản</Text>
          {[
            { icon: Package, label: 'Bài đăng của tôi', color: '#3B82F6', bg: 'bg-blue-50', onPress: () => {} },
            { icon: Heart, label: 'Danh sách quan tâm', color: '#E53935', bg: 'bg-red-50', onPress: () => router.push('/wishlist' as any) },
            { icon: Award, label: 'Huy hiệu & Thành tích', color: '#F59E0B', bg: 'bg-amber-50', onPress: () => {} },
          ].map((item, index) => (
            <Animated.View key={index} entering={FadeInRight.duration(500).delay(index * 100)}>
              <TouchableOpacity onPress={item.onPress} activeOpacity={0.8} className="flex-row items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
                <View className="flex-row items-center gap-4">
                  <View className={`w-12 h-12 ${item.bg} rounded-full items-center justify-center`}>
                    <item.icon size={22} color={item.color} />
                  </View>
                  <Text className="font-bold text-base text-[#1A2E1A]">{item.label}</Text>
                </View>
                <View>
                  <Text className="font-bold text-base text-[#1A2E1A]">Bài đăng của tôi</Text>
                  <Text className="text-[10px] font-bold text-slate-400">Quản lý thực phẩm của bạn</Text>
                </View>
              </View>
              <View className="w-10 h-10 bg-[#F8FAF8] rounded-full items-center justify-center">
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInRight.duration(500).delay(200)}>
            <TouchableOpacity 
              onPress={() => router.push('/request/me')}
              activeOpacity={0.8} 
              className="flex-row items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-slate-100"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center">
                  <Heart size={22} color="#EC4899" />
                </View>
                <View>
                  <Text className="font-bold text-base text-[#1A2E1A]">Yêu cầu của tôi</Text>
                  <Text className="text-[10px] font-bold text-slate-400">Yêu cầu nhận đồ ăn</Text>
                </View>
              </View>
              <View className="w-10 h-10 bg-[#F8FAF8] rounded-full items-center justify-center">
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInRight.duration(500).delay(250)}>
            <TouchableOpacity 
              onPress={() => router.push('/food/favorites')}
              activeOpacity={0.8} 
              className="flex-row items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-slate-100"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center">
                  <Heart size={22} color="#EF4444" fill="#EF4444" />
                </View>
                <View>
                  <Text className="font-bold text-base text-[#1A2E1A]">Đã lưu trữ</Text>
                  <Text className="text-[10px] font-bold text-slate-400">Các món ăn yêu thích của bạn</Text>
                </View>
              </View>
              <View className="w-10 h-10 bg-[#F8FAF8] rounded-full items-center justify-center">
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </Animated.View>


          <Animated.View entering={FadeInRight.duration(500).delay(300)}>
            <TouchableOpacity activeOpacity={0.8} className="flex-row items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-amber-50 rounded-full items-center justify-center">
                  <Award size={22} color="#F59E0B" />
                </View>
                <View>
                  <Text className="font-bold text-base text-[#1A2E1A]">Huy hiệu & Thành tích</Text>
                  <Text className="text-[10px] font-bold text-slate-400">Cấp: {impact?.levelName || 'Người mới'}</Text>
                </View>
              </View>
              <View className="w-10 h-10 bg-[#F8FAF8] rounded-full items-center justify-center">
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.8} 
            className="flex-row items-center gap-4 bg-red-50 p-4 rounded-[24px] mt-4 border border-red-100"
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
              <LogOut size={22} color="#EF5350" />
            </View>
            <Text className="font-bold text-base text-red-500">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}