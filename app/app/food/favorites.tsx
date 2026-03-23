import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, Clock, MapPin, ChevronRight, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { favoriteService } from '@/services/favoriteService';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/badge';
import { type PostData } from '@/services/postService';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [favorites, setFavorites] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFavorites = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await favoriteService.getFavoritesLocal();
      setFavorites(data);
    } catch {
      showToast('Không thể tải danh sách yêu thích', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchFavorites(false);
  };

  const renderFavoriteItem = ({ item }: { item: PostData }) => {
    const post = item;
    const donor = typeof post.donorId === 'object' ? post.donorId : { fullName: 'Ẩn danh' };

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/food/${item._id}`)}
        activeOpacity={0.8}
        className="bg-white p-4 rounded-[24px] mb-4 shadow-sm border border-slate-100 flex-row gap-4"
      >
        <Image 
          source={{ uri: post?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' }} 
          className="w-20 h-20 rounded-2xl bg-slate-100" 
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-base font-extrabold text-[#1A2E1A] flex-1 mr-2" numberOfLines={1}>
              {post?.title || 'Bài đăng đã bị xóa'}
            </Text>
            <Badge label={post.status === 'active' ? 'Còn nhận' : 'Đã đóng'} variant={post.status === 'active' ? 'success' : 'default'} />
          </View>
          <Text className="text-xs font-bold text-slate-500 mb-2">Đăng bởi {donor?.fullName || 'Ẩn danh'}</Text>
          <View className="flex-row items-center gap-3">
             <View className="flex-row items-center gap-1">
               <Clock size={12} color="#94A3B8" />
               <Text className="text-[10px] font-bold text-slate-400">
                 {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : '--'}
               </Text>
             </View>
             <View className="flex-row items-center gap-1">
               <MapPin size={12} color="#94A3B8" />
               <Text className="text-[10px] font-bold text-slate-400">
                 {post.location?.district || ''}
               </Text>
             </View>
          </View>
        </View>
        <View className="justify-center">
           <ChevronRight size={20} color="#CBD5E1" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      
      {/* Header */}
      <View
        className="bg-white px-6 pb-4 pt-4 flex-row items-center gap-4 border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center"
        >
          <ArrowLeft size={20} color="#1A2E1A" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-[#1A2E1A]">Đã lưu trữ</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
           data={favorites as any}
           keyExtractor={(item: any) => item._id}
           contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
           renderItem={renderFavoriteItem as any}
           ListEmptyComponent={
             <View className="flex-1 items-center justify-center mt-20">
               <Heart size={48} color="#CBD5E1" strokeWidth={1.5} className="mb-4" />
               <Text className="text-lg font-bold text-slate-400 text-center">Chưa có bài viết yêu thích</Text>
               <TouchableOpacity 
                 onPress={() => router.replace('/(tabs)/explore')}
                 className="mt-4 px-6 py-3 bg-[#2E7D32] rounded-2xl"
               >
                 <Text className="text-white font-bold">Khám phá món ngon ngay</Text>
               </TouchableOpacity>
             </View>
           }
           refreshControl={
             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#2E7D32" />
           }
        />
      )}
    </View>
  );
}
