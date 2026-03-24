import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, X, User, MessageCircle, ChevronRight } from 'lucide-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { requestService } from '@/services/requestService';
import { getConversationByPost } from '@/services/chatService';
import { EmptyState } from '@/features/feed/components/EmptyState';
import { useToast } from '@/context/ToastContext';
import type { FoodPost } from '@/features/feed/types';
import type { RequestData } from '@/services/requestService';

type PopulatedRequest = RequestData & {
  postId?: string | FoodPost;
  receiverId?:
    | string
    | { _id?: string; fullName?: string; avatar?: string };
};

type TabKey = 'pending' | 'history';

const tabStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 16,
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderRadius: 16,
  },
  tabCell: {
    flex: 1,
    borderRadius: 12,
    minHeight: 48,
    overflow: 'hidden',
  },
  tabCellActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  /** Single tappable surface: must wrap Text (empty Pressable/overlay breaks touches on some devices). */
  tabTouchable: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});

function receiverName(r: PopulatedRequest): string {
  const rec = r.receiverId;
  if (rec && typeof rec === 'object' && rec.fullName) return rec.fullName;
  return 'Người nhận';
}

function postFromRequest(req: PopulatedRequest): FoodPost | null {
  const p = req.postId;
  if (p && typeof p === 'object' && p !== null && '_id' in p) return p as FoodPost;
  return null;
}

function statusBadge(status: string) {
  switch (status) {
    case 'pending':
      return { label: 'Chờ duyệt', variant: 'default' as const };
    case 'accepted':
      return { label: 'Đã chấp nhận', variant: 'success' as const };
    case 'rejected':
      return { label: 'Đã từ chối', variant: 'destructive' as const };
    case 'completed':
      return { label: 'Hoàn tất', variant: 'success' as const };
    case 'cancelled':
      return { label: 'Đã hủy', variant: 'default' as const };
    default:
      return { label: status, variant: 'default' as const };
  }
}

export default function DonorRequestsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>('pending');
  const [chatLoading, setChatLoading] = useState<string | null>(null);

  const {
    data: historyList = [],
    isPending: historyPending,
    isError: historyError,
    refetch: refetchHistory,
    isRefetching: refetchingHistory,
  } = useQuery({
    queryKey: ['donorRequestHistory'],
    queryFn: requestService.getDonorRequestHistory,
  });

  const refetchAll = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['donorRequestHistory'] });
    await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    await queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
  }, [queryClient]);

  const pendingList = useMemo(
    () =>
      historyList
        .filter((r: PopulatedRequest) => r.status === 'pending')
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [historyList]
  );

  const historySorted = useMemo(
    () =>
      historyList
        .filter((r: PopulatedRequest) => r.status !== 'pending')
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        ),
    [historyList]
  );

  const acceptMutation = useMutation({
    mutationFn: (requestId: string) => requestService.acceptRequest(requestId),
    onSuccess: (data: any) => {
      showToast('Đã chấp nhận yêu cầu.', 'success');
      queryClient.invalidateQueries({ queryKey: ['donorRequestHistory'] });
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['impactStats'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      const cid = data?.conversationId;
      if (cid) {
        router.push(`/messages/${cid}` as any);
      }
    },
    onError: (e: any) => {
      showToast(
        e?.response?.data?.message || e?.message || 'Không thể chấp nhận',
        'error'
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => requestService.rejectRequest(requestId),
    onSuccess: () => {
      showToast('Đã từ chối yêu cầu.', 'info');
      queryClient.invalidateQueries({ queryKey: ['donorRequestHistory'] });
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (e: any) => {
      showToast(
        e?.response?.data?.message || e?.message || 'Không thể từ chối',
        'error'
      );
    },
  });

  const onReject = (requestId: string) => {
    Alert.alert('Từ chối yêu cầu?', 'Người nhận sẽ được thông báo.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Từ chối',
        style: 'destructive',
        onPress: () => rejectMutation.mutate(requestId),
      },
    ]);
  };

  const openChatForPost = async (postId: string | undefined) => {
    if (!postId) {
      showToast('Không xác định được bài đăng', 'error');
      return;
    }
    try {
      setChatLoading(postId);
      const conversation = await getConversationByPost(postId);
      router.push(`/messages/${conversation._id}` as any);
    } catch {
      showToast('Chưa có cuộc trò chuyện (chỉ tạo sau khi chấp nhận)', 'info');
    } finally {
      setChatLoading(null);
    }
  };

  const renderPending = ({ item }: { item: PopulatedRequest }) => {
    const post = postFromRequest(item);
    const qty = item.requestedQty ?? 1;
    const busy = acceptMutation.isPending || rejectMutation.isPending;

    return (
      <View className="bg-white rounded-[24px] border border-slate-100 p-4 mb-4 shadow-sm">
        <Text className="text-xs font-bold text-[#2E7D32] uppercase mb-1">
          {post?.title || 'Bài đăng'}
        </Text>
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center">
            <User size={20} color="#64748B" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-extrabold text-[#1A2E1A]">
              {receiverName(item)}
            </Text>
            <Text className="text-sm text-slate-500 font-medium">
              Muốn nhận:{' '}
              <Text className="font-bold text-slate-700">
                {qty} {post?.unit ?? ''}
              </Text>
            </Text>
            {item.message ? (
              <Text className="text-xs text-slate-400 mt-1" numberOfLines={2}>
                “{item.message}”
              </Text>
            ) : null}
          </View>
        </View>
        <View className="flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-red-200 bg-red-50"
            onPress={() => onReject(item._id)}
            disabled={busy}
          >
            <View className="flex-row items-center justify-center gap-2">
              <X size={18} color="#DC2626" />
              <Text className="text-red-600 font-extrabold">Từ chối</Text>
            </View>
          </Button>
          <Button
            className="flex-1 h-12 rounded-2xl bg-[#2E7D32]"
            onPress={() => acceptMutation.mutate(item._id)}
            disabled={busy}
          >
            {acceptMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <Check size={18} color="#fff" />
                <Text className="text-white font-extrabold">Chấp nhận</Text>
              </View>
            )}
          </Button>
        </View>
      </View>
    );
  };

  const renderHistory = ({ item }: { item: PopulatedRequest }) => {
    const post = postFromRequest(item);
    const postId = post?._id;
    const badge = statusBadge(item.status);
    const canChat =
      item.status === 'accepted' || item.status === 'completed';

    return (
      <View className="bg-white rounded-[24px] border border-slate-100 p-4 mb-4 shadow-sm flex-row gap-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push(`/request/${item._id}` as any)}
          className="flex-1 flex-row gap-2"
        >
          <View className="flex-1">
            <View className="flex-row justify-between items-start gap-2 mb-1">
              <Text
                className="text-base font-extrabold text-[#1A2E1A] flex-1"
                numberOfLines={2}
              >
                {post?.title || 'Bài đăng'}
              </Text>
              <Badge label={badge.label} variant={badge.variant} />
            </View>
            <Text className="text-sm text-slate-600 font-medium mb-1">
              Người nhận:{' '}
              <Text className="font-bold text-slate-800">{receiverName(item)}</Text>
            </Text>
            <Text className="text-xs text-slate-400 font-medium">
              Cập nhật:{' '}
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleString('vi-VN')
                : '—'}
            </Text>
          </View>
          <View className="justify-center pr-1">
            <ChevronRight size={20} color="#CBD5E1" />
          </View>
        </TouchableOpacity>
        {canChat && postId ? (
          <TouchableOpacity
            onPress={() => openChatForPost(postId)}
            disabled={chatLoading === postId}
            className="justify-center items-center w-12 rounded-xl bg-blue-50 border border-blue-100"
          >
            {chatLoading === postId ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <MessageCircle size={20} color="#3B82F6" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const listData = tab === 'pending' ? pendingList : historySorted;
  const loading = historyPending;

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <View
        className="bg-white px-6 pb-4 rounded-b-[28px] shadow-sm border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center border border-slate-100"
          >
            <ArrowLeft size={20} color="#334155" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-slate-800">
              Yêu cầu trên bài của tôi
            </Text>
            <Text className="text-sm font-medium text-slate-500">
              Phê duyệt, lịch sử & chat với người nhận
            </Text>
          </View>
        </View>

        <View style={tabStyles.tabRow}>
          <View
            style={[
              tabStyles.tabCell,
              tab === 'pending' ? tabStyles.tabCellActive : null,
            ]}
            collapsable={false}
          >
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === 'pending' }}
              activeOpacity={0.92}
              onPress={() => setTab('pending')}
              style={tabStyles.tabTouchable}
            >
              <Text
                className={`text-sm font-extrabold text-center ${
                  tab === 'pending' ? 'text-[#2E7D32]' : 'text-slate-500'
                }`}
              >
                Chờ duyệt
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              tabStyles.tabCell,
              tab === 'history' ? tabStyles.tabCellActive : null,
            ]}
            collapsable={false}
          >
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === 'history' }}
              activeOpacity={0.92}
              onPress={() => setTab('history')}
              style={tabStyles.tabTouchable}
            >
              <Text
                className={`text-sm font-extrabold text-center ${
                  tab === 'history' ? 'text-[#2E7D32]' : 'text-slate-500'
                }`}
              >
                Đã xử lý
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {historyError ? (
        <View className="flex-1 justify-center px-6 pt-10">
          <EmptyState
            title="Không tải được dữ liệu"
            description="Kiểm tra đăng nhập và thử lại."
          />
          <Button
            onPress={() => refetchHistory()}
            className="mt-4 rounded-2xl bg-[#2E7D32]"
          >
            <Text className="text-white font-bold">Thử lại</Text>
          </Button>
        </View>
      ) : loading && listData.length === 0 ? (
        <View className="flex-1 justify-center pt-20">
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text className="text-center text-slate-500 mt-4 font-medium">
            Đang tải…
          </Text>
        </View>
      ) : (
        <FlatList
          key={tab}
          data={listData}
          keyExtractor={(item: PopulatedRequest) => item._id}
          renderItem={(info) =>
            tab === 'pending' ? renderPending(info) : renderHistory(info)
          }
          extraData={tab}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 40,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refetchingHistory}
              onRefresh={refetchAll}
              tintColor="#2E7D32"
              colors={['#2E7D32']}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={
                tab === 'pending'
                  ? 'Không có yêu cầu đang chờ'
                  : 'Chưa có lịch sử'
              }
              description={
                tab === 'pending'
                  ? 'Khi có người bấm “Yêu cầu nhận ngay” trên bài của bạn, họ sẽ hiện ở đây.'
                  : 'Các yêu cầu đã chấp nhận, từ chối, hủy hoặc hoàn tất sẽ nằm ở tab này.'
              }
            />
          }
        />
      )}
    </View>
  );
}
