import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, Check, Hourglass, X, MessageCircle, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestService, type RequestData } from '@/services/requestService';
import { getConversationByPost } from '@/services/chatService';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

type Status = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

const STATUS_CONFIG: Record<Status, {
  icon: string;
  color: string;
  bgColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
}> = {
  pending: {
    icon: '⏳',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    badge: 'Đang chờ xác nhận',
    badgeColor: 'text-amber-700',
    title: 'Yêu cầu đang được xử lý',
    subtitle: 'Bạn sẽ nhận được thông báo ngay khi người đăng phản hồi yêu cầu của bạn.',
  },
  accepted: {
    icon: '🎉',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    badge: 'Đã được chấp nhận!',
    badgeColor: 'text-green-700',
    title: 'Yêu cầu được phê duyệt',
    subtitle: 'Người đăng đã chấp nhận yêu cầu của bạn. Hãy nhắn tin để sắp xếp việc lấy đồ nhé!',
  },
  rejected: {
    icon: '😔',
    color: '#EF5350',
    bgColor: '#FFEBEE',
    badge: 'Yêu cầu bị từ chối',
    badgeColor: 'text-red-600',
    title: 'Yêu cầu không được chấp nhận',
    subtitle: 'Rất tiếc, người đăng đã từ chối yêu cầu của bạn. Bạn có thể tìm kiếm các món ăn khác nhé!',
  },
  completed: {
    icon: '✅',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    badge: 'Hoàn tất',
    badgeColor: 'text-green-700',
    title: 'Giao dịch hoàn tất',
    subtitle: 'Cảm ơn bạn đã tham gia chia sẻ thức ăn. Mỗi hành động nhỏ đều tạo ra sự thay đổi!',
  },
  cancelled: {
    icon: '🚫',
    color: '#94A3B8',
    bgColor: '#F1F5F9',
    badge: 'Đã hủy',
    badgeColor: 'text-slate-500',
    title: 'Yêu cầu đã bị hủy',
    subtitle: 'Yêu cầu này đã bị hủy. Bạn có thể đặt yêu cầu mới bất cứ lúc nào.',
  },
};

export default function RequestStatus() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();

  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRequest = useCallback(async (showSpinner = true) => {
    if (!id) return;
    try {
      if (showSpinner) setLoading(true);
      const data = await requestService.getRequestById(id);
      setRequest(data.request);
    } catch {
      // silent refresh on poll errors
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest(true);
    // Poll every 10s to catch status changes in real-time
    pollRef.current = setInterval(() => fetchRequest(false), 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchRequest]);

  const handleCancel = async () => {
    if (!request?._id || isCancelling) return;
    try {
      setIsCancelling(true);
      await requestService.cancelRequest(request._id);
      showToast('Đã hủy yêu cầu', 'success');
      await fetchRequest(false);
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Không thể hủy yêu cầu', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOpenChat = async () => {
    const postId = typeof request?.postId === 'object' ? request.postId._id : request?.postId;
    if (!postId) return;
    try {
      setIsChatLoading(true);
      const conversation = await getConversationByPost(postId);
      router.push(`/messages/${conversation._id}` as any);
    } catch {
      showToast('Không thể mở chat lúc này', 'error');
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!request) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-xl font-bold text-slate-800 mb-4">Không tìm thấy yêu cầu</Text>
        <TouchableOpacity onPress={() => router.back()} className="px-6 py-3 bg-[#2E7D32] rounded-full">
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = (request.status || 'pending') as Status;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const post = typeof request.postId === 'object' ? request.postId : null;
  const donor = typeof request.donorId === 'object' ? request.donorId : null;

  // Stepper logic
  const stepDone = status !== 'pending';
  const stepCompleted = status === 'completed';
  const stepRejected = status === 'rejected' || status === 'cancelled';

  return (
    <View className="flex-1 bg-white">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />

      {/* Header */}
      <View
        className="flex-row items-center px-4 border-b border-slate-100"
        style={{ paddingTop: Math.max(insets.top, 20), paddingBottom: 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-bold text-slate-900">Trạng thái yêu cầu</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-col items-center px-6 py-8">

          {/* Status Icon */}
          <View className="relative mb-6">
            <View className="h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: cfg.bgColor }}>
              <Text className="text-4xl">{cfg.icon}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            className="mb-4 flex-row items-center rounded-full px-4 py-1.5 border"
            style={{ backgroundColor: cfg.bgColor, borderColor: cfg.color + '40' }}
          >
            <Text className={`text-xs font-bold uppercase tracking-wider ${cfg.badgeColor}`}>
              {cfg.badge}
            </Text>
          </View>

          {/* Title */}
          <Text className="mb-8 text-center text-2xl font-bold leading-tight text-slate-900">
            {cfg.title}
          </Text>

          {/* Progress Stepper */}
          <View className="mb-10 flex-row w-full items-center justify-between px-2">
            {/* Step 1: Sent */}
            <View className="flex-col items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]">
                <Check size={16} color="#fff" />
              </View>
              <Text className="text-[10px] font-medium text-slate-500">Đã gửi</Text>
            </View>

            {/* Line 1→2 */}
            <View className={`h-[2px] flex-1 mx-1 mb-6 ${stepDone && !stepRejected ? 'bg-[#2E7D32]' : stepRejected ? 'bg-red-400' : 'bg-slate-200'}`} />

            {/* Step 2: Confirm */}
            <View className="flex-col items-center gap-2">
              {stepRejected ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <X size={16} color="#fff" />
                </View>
              ) : stepDone ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]">
                  <Check size={16} color="#fff" />
                </View>
              ) : (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                  <Hourglass size={16} color="#fff" />
                </View>
              )}
              <Text className={`text-[10px] font-bold ${stepRejected ? 'text-red-500' : stepDone ? 'text-green-700' : 'text-amber-600'}`}>
                {stepRejected ? 'Từ chối' : 'Xác nhận'}
              </Text>
            </View>

            {/* Line 2→3 */}
            <View className={`h-[2px] flex-1 mx-1 mb-6 ${stepCompleted ? 'bg-[#2E7D32]' : 'bg-slate-200'}`} />

            {/* Step 3: Complete */}
            <View className="flex-col items-center gap-2">
              {stepCompleted ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]">
                  <CheckCircle size={16} color="#fff" />
                </View>
              ) : (
                <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-transparent">
                  <View className="w-2 h-2 rounded-full bg-slate-300" />
                </View>
              )}
              <Text className={`text-[10px] font-medium ${stepCompleted ? 'text-green-700' : 'text-slate-400'}`}>
                Hoàn tất
              </Text>
            </View>
          </View>

          {/* Food Card */}
          {post && (
            <View className="mb-6 w-full rounded-2xl bg-white shadow-sm border border-slate-100 flex-row items-center p-3 gap-4">
              <Image
                source={{ uri: post.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' }}
                className="h-16 w-16 shrink-0 rounded-xl bg-slate-100"
              />
              <View className="flex-col gap-1 flex-1">
                <Text className="font-bold text-slate-900" numberOfLines={1}>{post.title}</Text>
                <Text className="text-sm text-slate-500">
                  Người đăng: <Text className="font-bold text-[#2E7D32]">{donor?.fullName || 'Ẩn danh'}</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Subtitle */}
          <Text className="mb-8 text-center text-sm leading-relaxed text-slate-500 px-2">
            {cfg.subtitle}
          </Text>

          {/* Action buttons */}
          <View className="flex-col w-full gap-3">
            {/* Accepted: show Chat CTA */}
            {status === 'accepted' && (
              <TouchableOpacity
                onPress={handleOpenChat}
                disabled={isChatLoading}
                className="w-full h-14 bg-[#2E7D32] rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
                style={{ shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
                activeOpacity={0.85}
              >
                {isChatLoading
                  ? <ActivityIndicator size="small" color="white" />
                  : <MessageCircle size={20} color="white" />}
                <Text className="text-white font-extrabold text-base">Nhắn tin với người đăng</Text>
              </TouchableOpacity>
            )}

            {/* Rejected / Cancelled: go explore */}
            {(status === 'rejected' || status === 'cancelled') && (
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)/explore' as any)}
                className="w-full h-14 bg-[#2E7D32] rounded-2xl items-center justify-center shadow-lg"
                activeOpacity={0.85}
              >
                <Text className="text-white font-extrabold text-base">🔍 Tìm món khác</Text>
              </TouchableOpacity>
            )}

            {/* Always: go home */}
            {status !== 'accepted' && (
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)' as any)}
                className="w-full h-14 bg-slate-100 rounded-2xl items-center justify-center"
                activeOpacity={0.85}
              >
                <Text className="text-slate-700 font-bold text-base">← Về trang chủ</Text>
              </TouchableOpacity>
            )}

            {/* Pending: show cancel */}
            {status === 'pending' && (
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isCancelling}
                className="w-full py-3 items-center"
                activeOpacity={0.7}
              >
                {isCancelling
                  ? <ActivityIndicator size="small" color="#EF5350" />
                  : <Text className="text-sm font-semibold text-red-500">Hủy yêu cầu này</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}