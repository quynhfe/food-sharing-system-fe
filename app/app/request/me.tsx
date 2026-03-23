import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, Clock, MapPin, ChevronRight, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { requestService, type RequestData } from '@/services/requestService';
import { getConversationByPost } from '@/services/chatService';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/badge';

export default function MyRequests() {
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatLoading, setChatLoading] = useState<string | null>(null);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Chờ xét duyệt', variant: 'default' };
      case 'accepted': return { label: 'Chấp nhận', variant: 'success' };
      case 'rejected': return { label: 'Từ chối', variant: 'destructive' };
      case 'completed': return { label: 'Hoàn tất', variant: 'success' };
      case 'cancelled': return { label: 'Đã hủy', variant: 'secondary' };
      default: return { label: status, variant: 'default' };
    }
  };

  const renderRequestItem = ({ item }: { item: RequestData }) => {
    const post = item.postId;
    const donor = item.donorId;
    const badge = getStatusBadge(item.status);

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/request/${item._id}`)}
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
              <Badge label={badge.label} variant={badge.variant as any} />
            </View>
            <Text className="text-xs font-bold text-slate-500 mb-2">Đăng bởi {donor?.fullName || 'Ẩn danh'}</Text>
            <View className="flex-row items-center gap-3">
               <View className="flex-row items-center gap-1">
                 <Clock size={12} color="#94A3B8" />
                 <Text className="text-[10px] font-bold text-slate-400">
                   {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '--'}
                 </Text>
               </View>
               <View className="flex-row items-center gap-1">
                 <MapPin size={12} color="#94A3B8" />
                 <Text className="text-[10px] font-bold text-slate-400">
                   {post?.location?.district || ''}
                 </Text>
               </View>
            </View>
            {/* Go-to-chat CTA for accepted requests */}
            {item.status === 'accepted' && (
              <TouchableOpacity
                onPress={() => handleOpenChat(post?._id)}
                disabled={chatLoading === post?._id}
                className="mt-2 flex-row items-center gap-1.5 bg-blue-50 self-start px-3 py-1.5 rounded-full border border-blue-100"
              >
                {chatLoading === post?._id
                  ? <ActivityIndicator size={12} color="#3B82F6" />
                  : <MessageCircle size={13} color="#3B82F6" />}
                <Text className="text-blue-600 font-bold text-[10px]">Nhắn tin ngay</Text>
              </TouchableOpacity>
            )}
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
        <Text className="text-xl font-extrabold text-[#1A2E1A]">Yêu cầu của tôi</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={renderRequestItem}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-4xl mb-4">🤝</Text>
              <Text className="text-lg font-bold text-slate-400 text-center">Bạn chưa thực hiện yêu cầu nào</Text>
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
