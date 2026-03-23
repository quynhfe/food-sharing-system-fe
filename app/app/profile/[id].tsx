import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Award, Leaf, Heart, CheckCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';
import { userService, type UserProfile } from '@/services/userService';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { type FoodPost } from '@/features/feed/types/entities';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<FoodPost[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await userService.getProfile(id);
        setProfile(data.user);
        setPosts(data.activePosts);
      } catch (err) {
        console.error('[UserProfile] Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-xl font-bold text-slate-800">Không tìm thấy người dùng</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 px-6 py-2 bg-[#2E7D32] rounded-full"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header Background */}
        <View 
          className="bg-[#2E7D32] rounded-b-[40px] px-6 pb-16 pt-8 relative overflow-hidden"
          style={{ paddingTop: Math.max(insets.top, 20) }}
        >
          <View className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-11 h-11 bg-white/20 rounded-full items-center justify-center backdrop-blur-md mb-6"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-5">
            <View className="relative">
              <Image 
                source={{ uri: profile.avatar || "https://i.pravatar.cc/150?img=11" }} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-slate-200" 
              />
              <View className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-2xl font-extrabold text-white">{profile.fullName}</Text>
                <CheckCircle size={18} color="white" />
              </View>
              <Text className="text-white/80 font-medium mb-2">Thành viên từ {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</Text>
              <View className="bg-white/20 self-start px-3 py-1 rounded-full flex-row items-center gap-1.5">
                <Award size={14} color="#FDE047" />
                <Text className="text-white font-bold text-xs">⭐ {profile.trustScore?.score || 0}/100 Trust</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)} className="px-6 -mt-8">
          <Card className="border-0 bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 flex-row justify-between">
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-[#E8F5E9] rounded-full items-center justify-center mb-2">
                <Leaf size={24} color="#2E7D32" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">{profile.trustScore?.totalCompleted || 0}</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">Giao dịch</Text>
            </View>
            <View className="w-px bg-slate-100 mx-2" />
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                <Award size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A]">{profile.exp || 0}</Text>
              <Text className="text-xs font-bold text-slate-500 text-center">XP</Text>
            </View>
            <View className="items-center flex-1">
                   <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-2">
                     <Heart size={24} color="#EC4899" />
                   </View>
                   <Text className="text-base font-bold text-[#1A2E1A]">{profile.trustScore?.completionRate || 0}%</Text>
                   <Text className="text-[10px] font-bold text-slate-400 text-center">Tỷ lệ hoàn tất</Text>
                 </View>
          </Card>
        </Animated.View>

        {/* Active Posts Section */}
        <View className="px-6 mt-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-extrabold text-[#1A2E1A]">Món đang chia sẻ ({posts.length})</Text>
          </View>

          {posts.length > 0 ? (
            <View>
              {posts.map((post, index) => (
                <Animated.View key={post._id} entering={FadeInLeft.delay(index * 100)}>
                  <FoodCard 
                    post={post as any} 
                    onPress={() => router.push(`/food/${post._id}`)} 
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-[32px] p-10 items-center border border-slate-100 border-dashed">
              <Text className="text-4xl mb-4">🍽️</Text>
              <Text className="text-slate-400 font-bold text-center">Hiện tại chưa có món nào đang được chia sẻ</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
