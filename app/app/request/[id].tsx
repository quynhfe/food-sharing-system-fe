// app/request/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Modal, Pressable, TextInput } from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, Check, Hourglass, XCircle, Clock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { getRequestStatus, cancelRequest } from '../../services/requestService';
import { createReview } from '../../services/reviewService';
import Animated, { SlideInDown } from 'react-native-reanimated';

export default function RequestStatus() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  
  // For Screen 16: Complete & Rating
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fallbackFood = {
    title: 'Bánh mì thịt nướng',
    poster: { name: 'Nguyễn Văn A' },
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'
  };

  const fetchData = async () => {
    try {
      if (id === 'mockrequest123' || !/^[0-9a-fA-F]{24}$/.test(id as string)) {
         setTimeout(() => {
           setRequest({
              status: 'pending',
              postId: { title: 'Bánh mì thịt nướng', images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'] },
              donorId: { fullName: 'Minh Tuấn' }
           });
           setLoading(false);
         }, 1000);
         return;
      }

      const response = await getRequestStatus(id as string);
      setRequest(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error fetching status', error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleCancelRequest = async () => {
    setCancelling(true);
    try {
      if (id === 'mockrequest123') {
         Alert.alert('Thành công', 'Hủy yêu cầu giả lập thành công');
         setRequest({ ...request, status: 'cancelled', cancelReason: cancelReason || 'Người dùng hủy' });
         setShowCancelModal(false);
         setCancelling(false);
         return;
      }

      await cancelRequest(id as string, cancelReason);
      Alert.alert('Thành công', 'Yêu cầu của bạn đã được hủy');
      setShowCancelModal(false);
      setCancelling(false);
      fetchData();
    } catch (error: any) {
      setCancelling(false);
      Alert.alert('Lỗi', error.toString());
    }
  };

  const handleSubmittingRating = async () => {
    setSubmittingRating(true);
    try {
      // Create review logic
      // Note: We'd typically use transactionId here, will use a fallback, or request ID
      await createReview(id as string, ratingScore, ratingComment);
      Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá!');
      setShowRateModal(false);
      setSubmittingRating(false);
    } catch (error: any) {
      setSubmittingRating(false);
      Alert.alert('Lỗi', error.toString());
    }
  };

  if (loading && !request) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text className="mt-4 text-slate-500">Đang tải trạng thái...</Text>
      </View>
    );
  }

  const status = request?.status || 'pending';
  const foodData = request?.postId || fallbackFood;
  const donorData = request?.donorId || { fullName: fallbackFood.poster.name };

  const getStatusDisplay = () => {
    switch(status) {
      case 'accepted':
        return { text: 'Được chấp nhận', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100', icon: '🎉' };
      case 'rejected':
        return { text: 'Từ chối', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', icon: '❌' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: '🛑' };
      case 'completed':
        return { text: 'Hoàn tất', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', icon: '✅' };
      default:
        return { text: 'Đang chờ xác nhận', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: '⏳' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View className="flex-1 bg-white relative">
      <View className="flex-row items-center p-4 pt-12">
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100" activeOpacity={0.7}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-bold text-slate-900">Trạng thái yêu cầu</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-col items-center px-6 py-8">
          <View className="relative mb-6">
            <View className={`absolute inset-0 rounded-full ${statusDisplay.bg} opacity-75`}></View>
            <View className={`relative h-16 w-16 items-center justify-center rounded-full ${statusDisplay.bg}`}>
              <Text className="text-3xl">{statusDisplay.icon}</Text>
            </View>
          </View>

          <View className={`mb-4 flex-row items-center rounded-full ${statusDisplay.bg} px-4 py-1.5 border ${statusDisplay.border}`}>
            <Text className={`text-xs font-bold uppercase tracking-wider ${statusDisplay.color}`}>{statusDisplay.text}</Text>
          </View>

          <Text className="mb-8 text-center text-2xl font-bold leading-tight text-slate-900">
            {status === 'pending' ? 'Yêu cầu đang được\nxử lý' : status === 'accepted' ? 'Yêu cầu được\nchấp nhận!' : 'Trạng thái yêu cầu đã\nthay đổi'}
          </Text>

          <View className="mb-10 flex-row w-full items-center justify-between px-2">
            <View className="flex-col items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#2E7D32]">
                <Check size={16} color="#ffffff" />
              </View>
              <Text className="text-[10px] font-medium text-slate-500">Đã gửi</Text>
            </View>
            <View className={`h-[2px] flex-1 ${status === 'accepted' || status === 'completed' ? 'bg-[#2E7D32]' : 'bg-slate-200'} mx-1 mb-6`}></View>
            <View className="flex-col items-center gap-2">
              <View className={`h-8 w-8 items-center justify-center rounded-full ${status === 'accepted' || status === 'completed' ? 'bg-[#2E7D32]' : 'bg-amber-500'}`}>
                {status === 'accepted' || status === 'completed' ? <Check size={16} color="#ffffff" /> : <Hourglass size={16} color="#ffffff" />}
              </View>
              <Text className="text-[10px] font-bold text-amber-600">Xác nhận</Text>
            </View>
            <View className={`h-[2px] flex-1 ${status === 'completed' ? 'bg-[#2E7D32]' : 'bg-slate-200'} mx-1 mb-6`}></View>
            <View className="flex-col items-center gap-2">
              <View className={`h-8 w-8 items-center justify-center rounded-full border-2 ${status === 'completed' ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-slate-200 bg-transparent'}`}>
                {status === 'completed' ? <Check size={16} color="#ffffff" /> : <View className="w-2 h-2 rounded-full bg-slate-300"></View>}
              </View>
              <Text className="text-[10px] font-medium text-slate-400">Hoàn tất</Text>
            </View>
          </View>

          <View className="mb-6 w-full rounded-xl bg-white shadow-sm border border-slate-100 flex-row items-center p-3 gap-4">
            <Image 
              source={{ uri: foodData.images?.[0] || foodData.image || fallbackFood.image }} 
              className="h-16 w-16 shrink-0 rounded-lg" 
            />
            <View className="flex-col gap-0.5 flex-1">
              <Text className="font-bold text-slate-900">{foodData.title}</Text>
              <Text className="text-sm text-slate-500">Người đăng: <Text className="font-medium text-[#2E7D32]">{donorData.fullName}</Text></Text>
            </View>
          </View>

          {request?.cancelReason && (
            <View className="mb-6 w-full p-4 bg-red-50 border border-red-100 rounded-xl">
               <Text className="text-red-800 text-sm font-bold mb-1">Lý do hủy:</Text>
               <Text className="text-red-700 text-sm">{request.cancelReason}</Text>
            </View>
          )}

          <Text className="mb-8 text-center text-sm leading-relaxed text-slate-500">
            {status === 'pending' ? 'Bạn sẽ nhận được thông báo ngay khi người đăng phản hồi yêu cầu của bạn.' : status === 'accepted' ? 'Vui lòng trao đổi với người đăng để nhận món ăn.' : 'Thông tin chi tiết được cập nhật.'}
          </Text>

          <View className="flex-col w-full gap-2">
            {status === 'accepted' && (
              <Button onPress={() => setShowRateModal(true)} className="w-full bg-[#2E7D32]">Xác nhận Hoàn tất & Đánh giá</Button>
            )}
            <Button onPress={() => router.replace('/(tabs)')} className="w-full shadow-sm bg-slate-100"><Text className="text-slate-700 font-bold">← Về trang chủ</Text></Button>
            {status === 'pending' && (
              <TouchableOpacity onPress={() => setShowCancelModal(true)} className="w-full py-2 items-center" activeOpacity={0.7}>
                <Text className="text-sm font-semibold text-red-500">Hủy yêu cầu này</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Review Modal Screen 16 */}
      <Modal visible={showRateModal} transparent animationType="fade">
         <View className="flex-1 justify-end">
            <Pressable className="absolute inset-0 bg-slate-950/65" onPress={() => !submittingRating && setShowRateModal(false)} />
            <Animated.View entering={SlideInDown.duration(300)} className="bg-white rounded-t-[32px] px-6 pt-5 pb-10 z-50">
               <View className="items-center mb-6">
                   <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
               </View>
               <Text className="text-xl font-bold text-slate-900 text-center mb-2">Đánh giá giao dịch</Text>
               <Text className="text-slate-500 text-center text-sm mb-6">Hãy gửi lời nhận xét và số sao để tăng độ uy tín cho nhau bạn nhé!</Text>
               
               <View className="flex-row justify-center gap-2 mb-6">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity key={s} onPress={() => setRatingScore(s)}>
                       <Text className="text-3xl">{s <= ratingScore ? '⭐' : '☆'}</Text>
                    </TouchableOpacity>
                 ))}
               </View>

               <TextInput 
                  placeholder="Lời nhắn cảm ơn, nhận xét..." 
                  value={ratingComment} 
                  onChangeText={setRatingComment}
                  className="w-full h-24 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 text-sm mb-6"
                  multiline
                  textAlignVertical="top"
               />

               <View className="flex-col gap-2">
                  <Button className="w-full bg-[#2E7D32]" onPress={handleSubmittingRating} disabled={submittingRating}>
                     {submittingRating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Gửi đánh giá & Hoàn tất</Text>}
                  </Button>
                  <Button variant="ghost" className="w-full" onPress={() => setShowRateModal(false)}>Hủy</Button>
               </View>
            </Animated.View>
         </View>
      </Modal>

      {/* Cancel Modal with Reason */}
      <Modal visible={showCancelModal} transparent animationType="fade">
         <View className="flex-1 justify-end">
            <Pressable className="absolute inset-0 bg-slate-950/65" onPress={() => !cancelling && setShowCancelModal(false)} />
            <Animated.View entering={SlideInDown.duration(300)} className="bg-white rounded-t-[32px] px-6 pt-5 pb-10 z-50 shadow-2xl shadow-black/30 style={{ backgroundColor: 'white' }}">
               <View className="items-center mb-6">
                   <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
               </View>
               <Text className="text-xl font-bold text-slate-900 text-center mb-4">Bạn muốn hủy yêu cầu?</Text>
               <Text className="text-slate-500 text-center text-sm mb-6">Vui lòng cung cấp lý do để người đăng được biết nếu cần thiết.</Text>
               
               <TextInput 
                  placeholder="Lý do hủy (không bắt buộc)..." 
                  value={cancelReason} 
                  onChangeText={setCancelReason}
                  className="w-full h-24 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 text-sm mb-6"
                  multiline
                  textAlignVertical="top"
               />

               <View className="flex-col gap-2">
                  <Button className="w-full bg-red-500" onPress={handleCancelRequest} disabled={cancelling}>
                     {cancelling ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Xác nhận Hủy</Text>}
                  </Button>
                  <Button variant="ghost" className="w-full" onPress={() => setShowCancelModal(false)}>Hủy bỏ</Button>
               </View>
            </Animated.View>
         </View>
      </Modal>
    </View>
  );
}