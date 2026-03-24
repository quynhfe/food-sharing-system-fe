import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, Clock, MapPin, ChevronRight, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { requestService, type RequestData } from '@/services/requestService';
import { getConversationByPost } from '@/services/chatService';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/badge';

type RequestFilter = 'all' | 'pending' | 'success' | 'fail';

const FILTER_CHIPS: { key: RequestFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'success', label: 'Đã duyệt / hoàn tất' },
  { key: 'fail', label: 'Từ chối / hủy' },
];

function matchesFilter(status: string, filter: RequestFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'pending') return status === 'pending';
  if (filter === 'success') return status === 'accepted' || status === 'completed';
  if (filter === 'fail') return status === 'rejected' || status === 'cancelled';
  return true;
}

export default function MyRequests() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatLoading, setChatLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<RequestFilter>('all');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMyRequests = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch {
      showToast('Không thể tải danh sách yêu cầu', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchMyRequests();
      // Poll every 15s so status updates are reflected quickly
      pollRef.current = setInterval(() => fetchMyRequests(false), 15000);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, [fetchMyRequests])
  );

  const handleOpenChat = async (postId: string) => {
    try {
      setChatLoading(postId);
      const conversation = await getConversationByPost(postId);
      router.push(`/messages/${conversation._id}` as any);
    } catch {
      showToast('Không thể mở chat lúc này', 'error');
    } finally {
      setChatLoading(null);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMyRequests(false);
  };

  const filteredRequests = useMemo(
    () => requests.filter((r) => matchesFilter(r.status, filter)),
    [requests, filter]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Chờ xét duyệt', variant: 'default' };
      case 'accepted': return { label: 'Đã chấp nhận', variant: 'success' };
      case 'rejected': return { label: 'Từ chối', variant: 'destructive' };
      case 'completed': return { label: 'Hoàn tất', variant: 'success' };
      case 'cancelled': return { label: 'Đã hủy', variant: 'default' };
      default: return { label: status, variant: 'default' };
    }
  };

  const renderRequestItem = ({ item }: { item: RequestData }) => {
    const post = item.postId;
    const donor = item.donorId;
    const badge = getStatusBadge(item.status);

    const showChat =
      (item.status === 'accepted' || item.status === 'completed') && post?._id;

    return (
      <View className="bg-white p-4 rounded-[24px] mb-4 shadow-sm border border-slate-100 flex-row gap-2 items-stretch">
        <TouchableOpacity
          onPress={() => router.push(`/request/${item._id}`)}
          activeOpacity={0.8}
          className="flex-1 flex-row gap-4 min-w-0"
        >
          <Image
            source={{
              uri:
                post?.images?.[0] ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
            }}
            className="w-20 h-20 rounded-2xl bg-slate-100"
          />
          <View className="flex-1 min-w-0">
            <View className="flex-row justify-between items-start mb-1 gap-2">
              <Text
                className="text-base font-extrabold text-[#1A2E1A] flex-1"
                numberOfLines={1}
              >
                {post?.title || 'Bài đăng đã bị xóa'}
              </Text>
              <Badge label={badge.label} variant={badge.variant as any} />
            </View>
            <Text className="text-xs font-bold text-slate-500 mb-2">
              Đăng bởi {donor?.fullName || 'Ẩn danh'}
            </Text>
            <View className="flex-row items-center gap-3 flex-wrap">
              <View className="flex-row items-center gap-1">
                <Clock size={12} color="#94A3B8" />
                <Text className="text-[10px] font-bold text-slate-400">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                    : '--'}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MapPin size={12} color="#94A3B8" />
                <Text className="text-[10px] font-bold text-slate-400">
                  {post?.location?.district || ''}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {showChat ? (
          <TouchableOpacity
            onPress={() => handleOpenChat(post._id)}
            disabled={chatLoading === post._id}
            className="w-11 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center"
          >
            {chatLoading === post._id ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <MessageCircle size={18} color="#3B82F6" />
            )}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => router.push(`/request/${item._id}`)}
          className="justify-center px-1"
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        >
          <ChevronRight size={20} color="#CBD5E1" />
        </TouchableOpacity>
      </View>
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
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-[#1A2E1A]">Yêu cầu của tôi</Text>
          <Text className="text-xs text-slate-500 font-medium mt-0.5">
            Món bạn xin nhận — trạng thái phê duyệt & chat
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, maxHeight: 56, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: '#fff' }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        {FILTER_CHIPS.map((c, index) => (
          <TouchableOpacity
            key={c.key}
            onPress={() => setFilter(c.key)}
            activeOpacity={0.85}
            style={{
              marginRight: index < FILTER_CHIPS.length - 1 ? 8 : 0,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              backgroundColor: filter === c.key ? '#2E7D32' : '#f8fafc',
              borderColor: filter === c.key ? '#2E7D32' : '#e2e8f0',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: filter === c.key ? '#fff' : '#475569',
              }}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={renderRequestItem}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-4xl mb-4">🤝</Text>
              <Text className="text-lg font-bold text-slate-400 text-center px-4">
                {requests.length === 0
                  ? 'Bạn chưa gửi yêu cầu nhận món nào'
                  : 'Không có yêu cầu trong bộ lọc này'}
              </Text>
              {requests.length === 0 ? (
                <TouchableOpacity
                  onPress={() => router.replace('/(tabs)/explore')}
                  className="mt-4 px-6 py-3 bg-[#2E7D32] rounded-2xl"
                >
                  <Text className="text-white font-bold">Khám phá món ngon</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setFilter('all')}
                  className="mt-4 px-6 py-3 bg-slate-200 rounded-2xl"
                >
                  <Text className="text-slate-800 font-bold">Xem tất cả</Text>
                </TouchableOpacity>
              )}
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
