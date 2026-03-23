import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { postService, type PostData } from '@/services/postService';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';

export default function MyPosts() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMyPosts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await postService.getMyPosts();
      setPosts(data as any);
    } catch {
      showToast('Không thể tải bài đăng của bạn', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchMyPosts();
      pollRef.current = setInterval(() => fetchMyPosts(false), 15000);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, [fetchMyPosts])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMyPosts(false);
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      
      {/* Header */}
      <View
        className="bg-white px-6 pb-4 pt-4 flex-row items-center justify-between border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center"
        >
          <ArrowLeft size={20} color="#1A2E1A" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-[#1A2E1A]">Bài đăng của tôi</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/create')}
          className="w-10 h-10 bg-[#2E7D32] rounded-full items-center justify-center"
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <FoodCard 
              post={item as any} 
              onPress={() => router.push(`/food/${item._id}`)} 
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-4xl mb-4">📦</Text>
              <Text className="text-lg font-bold text-slate-400">Bạn chưa có bài đăng nào</Text>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/create')}
                className="mt-4 px-6 py-3 bg-[#2E7D32] rounded-2xl"
              >
                <Text className="text-white font-bold">Đăng món ngay</Text>
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
