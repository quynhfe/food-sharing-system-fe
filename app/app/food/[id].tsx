// app/food/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeft, Heart, MapPin, Clock, Calendar, MessageCircle, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Text } from '../../components/ui/text';
import { Badge } from '../../components/ui/badge';
import { formatDistance, formatTimeLeft } from '../../utils/helpers';
import { Button } from '@/components/ui/Button';
import { postService, type PostData } from '@/services/postService';
import { requestService, type RequestData } from '@/services/requestService';
import { getConversationByPost } from '@/services/chatService';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';
import { favoriteService } from '@/services/favoriteService';

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [showConfirm, setShowConfirm] = useState(false);
  const [food, setFood] = useState<PostData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<RequestData[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const isOwner = user?._id === (typeof food?.donorId === 'object' ? food.donorId._id : food?.donorId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await postService.getPostById(id as string);
        setFood(data);

        // Fetch user favorites locally to check if this post is favorited
        const isFav = await favoriteService.isFavoriteLocal(id as string);
        setIsFavorite(isFav);

      } catch {
        console.warn('Failed to fetch post, using mock data');
        // Fallback mock
        setFood({
          _id: id as string,
          title: 'Salad Ức Gà Áp Chảo & Hạt Quinoa',
          description: 'Món ăn đầy đủ dinh dưỡng với ức gà áp chảo, hạt quinoa, bơ sáp và các loại rau xanh hữu cơ sạch từ vườn nhà.',
          category: 'cooked',
          images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'],
          donorId: { fullName: 'Lê Minh Anh', avatar: 'https://i.pravatar.cc/150?img=9', trustScore: { score: 94 } },
          quantity: 3,
          unit: 'portion',
          expirationDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          location: { 
            province: 'TP.HCM', 
            district: 'Quận 1', 
            detail: 'Sảnh chung cư Vinhome Golden River',
            coordinates: { type: 'Point', coordinates: [106.7001, 10.7711] }
          },
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          calculatedDistance: 800,
          availableQuantity: 3,
        } as any);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchPost();
      authService.getCurrentUser().then(setUser);
    }
  }, [id]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (isOwner && id) {
        try {
          setIsLoadingRequests(true);
          const requests = await requestService.getIncomingRequests(id as string);
          setIncomingRequests(requests);
        } catch (e) {
          console.error('[FoodDetail] Error fetching requests:', e);
        } finally {
          setIsLoadingRequests(false);
        }
      }
    };
    fetchRequests();
  }, [id, isOwner]);

  const handleSendRequest = async () => {
    try {
      setIsRequesting(true);
      if (!food) return;
      await requestService.createRequest(id as string, food.availableQuantity || 1);
      setShowConfirm(false);
      showToast('Yêu cầu đã được gửi thành công!', 'success');
      setTimeout(() => router.push(`/request/${id}` as any), 1500);
    } catch (e: any) {
      setShowConfirm(false);
      showToast(e?.response?.data?.message || 'Không thể gửi yêu cầu lúc này.', 'error');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const result = await requestService.acceptRequest(requestId);
      showToast('Đã chấp nhận yêu cầu!', 'success');
      // Refresh list
      const updated = await requestService.getIncomingRequests(id as string);
      setIncomingRequests(updated);
      // Optional: Refresh food data for quantity update
      const updatedFood = await postService.getPostById(id as string);
      setFood(updatedFood);
      
      // Navigate to chat
      if (result.conversationId) {
        setTimeout(() => {
          router.push(`/messages/${result.conversationId}` as any);
        }, 1000);
      }
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Lỗi khi chấp nhận yêu cầu', 'error');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await requestService.rejectRequest(requestId);
      showToast('Đã từ chối yêu cầu', 'info');
      const updated = await requestService.getIncomingRequests(id as string);
      setIncomingRequests(updated);
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Lỗi khi từ chối yêu cầu', 'error');
    }
  };

  /** Navigate to the chat room for this post, or guide user to request first */
  const handleChatPress = async () => {
    if (isChatting) return;
    try {
      setIsChatting(true);
      const conversation = await getConversationByPost(id as string);
      router.push(`/messages/${conversation._id}` as any);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404) {
        showToast('Yêu cầu nhận thực phẩm trước để bắt đầu chat!', 'error');
      } else {
        showToast('Không thể mở chat lúc này. Vui lòng thử lại.', 'error');
      }
    } finally {
      setIsChatting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFav || !food) return;
    try {
      setIsTogglingFav(true);
      const nowFavorite = await favoriteService.toggleFavoriteLocal(food);
      setIsFavorite(nowFavorite);
      showToast(nowFavorite ? 'Đã thêm vào danh sách yêu thích' : 'Đã xoá khỏi danh sách yêu thích', 'success');
    } catch {
      showToast('Lỗi khi cập nhật yêu thích', 'error');
    } finally {
      setIsTogglingFav(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!food) return null;

  const posterName = food.donorId?.fullName || 'Người dùng';
  const posterAvatar = food.donorId?.avatar || 'https://i.pravatar.cc/150?img=9';
  const posterTrust = food.donorId?.trustScore || 0;
  const mainImage = food.images?.[0] || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800';
  const locationText = [food.location?.district, food.location?.province].filter(Boolean).join(', ');

  return (
    <View className="flex-1 bg-white">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hình ảnh và Header */}
        <View className="relative h-[320px] w-full">
          <Image source={{ uri: mainImage }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />
          <View className="absolute left-4 right-4 flex-row justify-between z-50" style={{ top: Math.max(insets.top, 20) }}>
            <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/30" activeOpacity={0.8}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleToggleFavorite}
              disabled={isTogglingFav}
              className={`w-11 h-11 rounded-full items-center justify-center border ${isFavorite ? 'bg-white border-white' : 'bg-white/20 backdrop-blur-md border-white/30'}`} 
              activeOpacity={0.8}
            >
              {isTogglingFav ? (
                <ActivityIndicator size="small" color={isFavorite ? '#ff4757' : 'white'} />
              ) : (
                <Heart size={24} color={isFavorite ? '#ff4757' : 'white'} fill={isFavorite ? '#ff4757' : 'transparent'} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Nội dung chính */}
        <View className="flex-1 -mt-8 rounded-t-[40px] bg-white px-6 pt-5 pb-32 z-10">
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <View className="flex-row items-center gap-3 mb-5">
            <Badge label={food.status === 'active' ? 'Còn nhận' : 'Đã đóng'} variant={food.status === 'active' ? 'success' : 'default'} />
            {food.calculatedDistance !== undefined && (
              <View className="flex-row h-7 items-center gap-1.5 rounded-full bg-[#F8FAF8] px-3 border border-slate-100">
                <MapPin size={14} color="#64748B" />
                <Text className="text-xs font-bold text-slate-600">{formatDistance(food.calculatedDistance / 1000)}</Text>
              </View>
            )}
          </View>

          <Text className="mb-3 text-[24px] font-extrabold leading-tight text-[#1A2E1A]">{food.title}</Text>

          <Text className="mb-6 text-base leading-relaxed text-slate-600 font-medium">{food.description}</Text>

          <View className="flex-row items-center justify-between border-y border-slate-100 py-5 mb-6">
            <View className="flex-col items-center gap-1.5">
              <Text className="text-xl">🍽️</Text>
              <Text className="text-sm font-bold text-[#1A2E1A]">{food.availableQuantity ?? food.quantity} {food.unit}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Clock size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">{formatTimeLeft(food.expirationDate)}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="flex-col items-center gap-1.5">
              <Calendar size={20} color="#2E7D32" />
              <Text className="text-sm font-bold text-[#1A2E1A]">HSD {formatDate(food.expirationDate)}</Text>
            </View>
          </View>

          {/* User Card */}
          <View className="flex-row items-center justify-between rounded-[24px] border border-slate-100 bg-[#F8FAF8] p-4 mb-6 shadow-sm shadow-slate-100">
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: posterAvatar }} className="w-12 h-12 rounded-full bg-slate-200" />
              <View>
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Text className="text-base font-bold text-[#1A2E1A]">{posterName}</Text>
                  <CheckCircle size={16} color="#3B82F6" />
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-extrabold text-[#2E7D32]">
                    ⭐ {typeof posterTrust === 'object' ? posterTrust.score : (posterTrust || 0)}/100 Trust
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              className="rounded-full bg-[#2E7D32]/10 px-4 py-2" 
              activeOpacity={0.7}
              onPress={() => {
                const donorId = typeof food.donorId === 'object' ? food.donorId._id : food.donorId;
                router.push(`/profile/${donorId}` as any);
              }}
            >
              <Text className="text-xs font-extrabold text-[#2E7D32]">Xem hồ sơ</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View className="flex-row items-start gap-3 bg-white p-4 rounded-[24px] border border-slate-100">
            <View className="w-10 h-10 rounded-full bg-[#F8FAF8] items-center justify-center">
              <MapPin size={20} color="#2E7D32" />
            </View>
            <View className="flex-1 justify-center pt-0.5">
              <Text className="text-base font-extrabold text-[#1A2E1A] mb-1">{locationText}</Text>
              <Text className="text-sm font-medium text-slate-500 leading-relaxed">{food.location?.detail}</Text>
            </View>
          </View>

          {/* Owner Dashboard - Incoming Requests */}
          {isOwner && (
            <View className="mt-8">
              <Text className="text-xl font-extrabold text-[#1A2E1A] mb-4">Danh sách yêu cầu ({incomingRequests.length})</Text>
              
              {isLoadingRequests ? (
                <ActivityIndicator size="small" color="#2E7D32" className="my-4" />
              ) : incomingRequests.length > 0 ? (
                <View className="gap-4">
                  {incomingRequests.map((req) => (
                    <View key={req._id} className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                      <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                          <Image source={{ uri: req.receiverId?.avatar || "https://i.pravatar.cc/150?img=11" }} className="w-10 h-10 rounded-full bg-slate-100" />
                          <View>
                            <Text className="font-bold text-slate-900">{req.receiverId?.fullName || "Người dùng"}</Text>
                            <Text className="text-[10px] font-bold text-[#2E7D32]">⭐ {req.receiverId?.trustScore?.score || 0}/100 Trust</Text>
                          </View>
                        </View>
                        <Badge 
                          label={req.status === 'pending' ? 'Chờ duyệt' : req.status === 'accepted' ? 'Đã nhận' : 'Khác'} 
                          variant={req.status === 'pending' ? 'default' : req.status === 'accepted' ? 'success' : 'default'} 
                        />
                      </View>
                      
                      {req.status === 'pending' ? (
                        <View className="flex-row gap-2">
                          <TouchableOpacity 
                            onPress={() => handleAcceptRequest(req._id)}
                            className="flex-1 bg-[#2E7D32] py-2.5 rounded-xl items-center"
                          >
                            <Text className="text-white font-bold text-xs">Phê duyệt</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => handleRejectRequest(req._id)}
                            className="flex-1 bg-slate-50 border border-slate-100 py-2.5 rounded-xl items-center"
                          >
                            <Text className="text-slate-600 font-bold text-xs">Từ chối</Text>
                          </TouchableOpacity>
                        </View>
                      ) : req.status === 'accepted' && (
                        <TouchableOpacity 
                          onPress={handleChatPress}
                          className="w-full bg-blue-50 py-2.5 rounded-xl items-center flex-row justify-center gap-2"
                        >
                          <MessageCircle size={16} color="#3B82F6" />
                          <Text className="text-blue-600 font-bold text-xs">Nhắn tin ngay</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-slate-50 rounded-[24px] p-8 items-center border border-dashed border-slate-200">
                  <Text className="text-slate-400 font-medium">Chưa có ai yêu cầu món này ⏱️</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/90 backdrop-blur-xl px-6 py-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="flex-row gap-3">
          {/* Chat button: only show for non-owners. Owners see chats via the messages icon in the header. */}
          {!isOwner && (
            <Button
              variant="outline"
              className="w-14 h-14 p-0 items-center justify-center rounded-2xl bg-[#F8FAF8] border-slate-200"
              onPress={handleChatPress}
              disabled={isChatting}
            >
              {isChatting
                ? <ActivityIndicator size="small" color="#2E7D32" />
                : <MessageCircle size={24} color="#1A2E1A" />}
            </Button>
          )}
          <Button
            className={`flex-1 h-14 rounded-2xl ${isOwner ? 'bg-blue-500' : 'bg-[#2E7D32]'} shadow-xl shadow-slate-200/30`}
            onPress={() => !isOwner && setShowConfirm(true)}
            disabled={food.status !== 'active' || isOwner}
          >
            <Text className="text-white font-extrabold text-lg">
              {isOwner ? '⚡ Bài đăng của bạn' : (food.status === 'active' ? 'Yêu cầu nhận ngay' : 'Đã đóng')}
            </Text>
          </Button>
        </View>
      </View>

      {/* Bottom Sheet Modal xác nhận */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View className="flex-1 justify-end">
          <Pressable className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onPress={() => setShowConfirm(false)} />
          <Animated.View entering={SlideInDown.duration(400).springify()} className="bg-white rounded-t-[40px] px-6 pt-4 pb-10 z-40 max-h-[80%]" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <View className="items-center mb-8">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </View>
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-[#2E7D32]/10 rounded-full items-center justify-center mb-6 border-4 border-[#F8FAF8] shadow-sm">
                <Text className="text-4xl">🤝</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#1A2E1A] text-center mb-4">Xác nhận yêu cầu?</Text>
              <Text className="text-slate-500 text-center text-base leading-relaxed font-medium px-2">
                Bạn đang yêu cầu nhận món <Text className="font-extrabold text-[#2E7D32]">{food.title}</Text> từ <Text className="font-extrabold text-[#1A2E1A]">{posterName}</Text>. Người đăng sẽ xem xét và phản hồi sớm nhất.
              </Text>
            </View>
            <View className="w-full gap-3">
              <Button className="w-full h-14 rounded-2xl bg-[#2E7D32] shadow-lg shadow-[#2E7D32]/20" onPress={handleSendRequest} disabled={isRequesting}>
                <Text className="text-white font-extrabold text-lg">{isRequesting ? 'Đang gửi...' : 'Xác nhận gửi'}</Text>
              </Button>
              <Button variant="ghost" className="w-full h-14 rounded-2xl bg-[#F8FAF8]" onPress={() => setShowConfirm(false)}>
                <Text className="text-[#1A2E1A] font-extrabold text-lg">Hủy</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}