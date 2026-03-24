import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  Gift,
  XCircle,
  Ban,
} from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationService, type NotificationItem } from '@/features/notification/services/notification.service';
import { EmptyState } from '@/features/feed/components/EmptyState';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) => NotificationService.getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      return lastPage.data.pagination.hasMore ? lastPage.data.pagination.page + 1 : undefined;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.pages.flatMap((page) => page?.data?.notifications || []) || [];
  const unreadCount = data?.pages[0]?.data?.unreadCount || 0;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'POST_EXPIRED':
        return <Clock size={20} color="#EF4444" />;
      case 'REQUEST_RECEIVED':
        return <Gift size={20} color="#3B82F6" />;
      case 'REQUEST_ACCEPTED':
        return <CheckCircle size={20} color="#10B981" />;
      case 'TRANSACTION_COMPLETED':
        return <CheckCircle size={20} color="#2E7D32" />;
      case 'REQUEST_REJECTED':
        return <XCircle size={20} color="#DC2626" />;
      case 'REQUEST_CANCELLED':
        return <Ban size={20} color="#64748B" />;
      case 'WARNING':
        return <AlertCircle size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#64748B" />;
    }
  };

  const resolvePostId = (item: NotificationItem): string | undefined => {
    const rp = item.relatedPostId;
    if (!rp) return undefined;
    if (typeof rp === 'string') return rp;
    return rp._id;
  };

  const resolveConversationId = (item: NotificationItem): string | undefined => {
    const c = item.relatedConversationId;
    if (!c) return undefined;
    if (typeof c === 'string') return c;
    return c._id;
  };

  const openFromNotification = (item: NotificationItem) => {
    if (item.type === 'REQUEST_RECEIVED') {
      router.push('/donor-requests' as any);
      return;
    }
    const convId = resolveConversationId(item);
    if (convId) {
      router.push(`/messages/${convId}` as any);
      return;
    }
    const postId = resolvePostId(item);
    if (postId) {
      router.push(`/food/${postId}` as any);
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        className={`flex-row p-4 border-b border-slate-100 ${!item.isRead ? 'bg-[#F0FDF4]' : 'bg-white'}`}
        activeOpacity={0.7}
        onPress={() => {
          if (!item.isRead) {
            markAsReadMutation.mutate(item._id);
          }
          openFromNotification(item);
        }}
      >
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${!item.isRead ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
          {getIconForType(item.type)}
        </View>
        <View className="flex-1">
          <Text className={`text-sm mb-1 ${!item.isRead ? 'font-extrabold text-slate-800' : 'font-bold text-slate-700'}`}>
            {item.title}
          </Text>
          <Text className={`text-sm leading-5 ${!item.isRead ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
            {item.message}
          </Text>
          <Text className="text-xs text-slate-400 mt-2 font-medium">
            {new Date(item.createdAt).toLocaleString('vi-VN')}
          </Text>
        </View>
        {!item.isRead && (
          <View className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 ml-2" />
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className="h-10" />;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#2E7D32" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="bg-white px-6 pb-4 border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center">
              <ArrowLeft size={20} color="#334155" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-extrabold text-slate-800">Thông báo</Text>
              {unreadCount > 0 && (
                <Text className="text-sm font-medium text-[#2E7D32]">{unreadCount} tin chưa đọc</Text>
              )}
            </View>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={() => markAllAsReadMutation.mutate()}>
              <Text className="text-[#2E7D32] font-bold">Đọc tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator size="large" color="#2E7D32" />
            </View>
          ) : (
            <EmptyState title="Không có thông báo nào" description="Bạn sẽ thấy các hoạt động và thông báo mới nhất tại đây." />
          )
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} tintColor="#2E7D32" colors={['#2E7D32']} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}
