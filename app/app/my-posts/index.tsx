import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowLeft, Trash2, Edit3, PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { PostService } from '@/features/post/services/post.service';
import { FoodCard } from '@/features/feed/components/FoodCard';
import { EmptyState } from '@/features/feed/components/EmptyState';
import { FoodCardSkeleton } from '@/features/feed/components/FoodCardSkeleton';
import { useToast } from '@/context/ToastContext';
import type { FoodPost } from '@/features/feed/types';

export default function MyPostsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: response, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['myPosts'],
    queryFn: PostService.getMyPosts,
  });

  const posts = response?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PostService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      // Also invalidate feed
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast('Đã xóa bài đăng thành công', 'success');
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error.message || 'Không thể xóa bài đăng lúc này.');
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xóa Bài Đăng',
      'Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => deleteMutation.mutate(id) 
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: FoodPost }) => (
    <View className="mb-6">
      <FoodCard post={item} onPress={() => router.push(`/food/${item._id}` as any)} />
      <View className="flex-row items-center gap-3 mt-3 px-1">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 h-10 rounded-xl bg-slate-100"
          activeOpacity={0.7}
          onPress={() => {
            // Placeholder: currently the app doesn't have an edit form UI requested yet.
            Alert.alert('Thông báo', 'Tính năng chỉnh sửa đang được phát triển.');
          }}
        >
          <Edit3 size={16} color="#475569" />
          <Text className="text-slate-700 font-bold text-sm">Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 h-10 rounded-xl bg-red-50"
          activeOpacity={0.7}
          onPress={() => handleDelete(item._id)}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Trash2 size={16} color="#EF4444" />
          )}
          <Text className="text-red-500 font-bold text-sm">Xóa bài</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* Header */}
      <View
        className="bg-white px-6 pb-5 rounded-b-[28px] shadow-sm shadow-slate-200/50 z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#334155" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-extrabold text-slate-800">
                Bài đăng của tôi
              </Text>
              <Text className="text-sm font-medium text-slate-500">
                {posts.length} bài đã đăng
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/create' as any)}
            className="w-10 h-10 rounded-full bg-[#E8F5E9] items-center justify-center"
            activeOpacity={0.7}
          >
            <PlusCircle size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View className="px-6 pt-6">
          <FoodCardSkeleton />
          <View className="h-6" />
          <FoodCardSkeleton />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center pt-20">
          <EmptyState title="Đã có lỗi xảy ra" description="Không thể tải danh sách bài đăng." />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}
          ListEmptyComponent={
            <EmptyState
              title="Bạn chưa có bài đăng nào"
              description="Hãy chia sẻ thức ăn dư thừa của bạn để giúp đỡ người khác nhé!"
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#2E7D32"
              colors={['#2E7D32']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
