import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { Text } from '../components/ui/text';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPostRequests, acceptRequest, rejectRequest } from '../services/requestService';
import { Button } from '../components/ui/Button';

export default function ManageRequests() {
  const { postId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchClaimants = async () => {
    try {
      const response = await getPostRequests(postId as string);
      setRequests(response.data || []);
    } catch (error) {
      console.log('Error fetching claimants', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchClaimants();
  }, [postId]);

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptRequest(requestId);
        Alert.alert('Thành công', 'Đã duyệt suất ăn cho người này');
      } else {
        await rejectRequest(requestId);
        Alert.alert('Từ chối', 'Đã từ chối yêu cầu');
      }
      fetchClaimants(); // Refresh
    } catch (error: any) {
      Alert.alert('Lỗi', error.toString());
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const user = item.receiverId || {};
    const isPending = item.status === 'pending';

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 flex-row items-center justify-between shadow-sm shadow-slate-200/30">
        <View className="flex-row items-center gap-3">
          <Image 
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=12' }} 
            className="w-12 h-12 rounded-full bg-slate-100" 
          />
          <View>
            <Text className="font-bold text-slate-800 text-base">{user.fullName || 'Người nhận'}</Text>
            {item.message ? (
              <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>"{item.message}"</Text>
            ) : null}
            <Text className="text-[10px] text-slate-400 mt-1">Đã gửi: {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        {isPending ? (
          <View className="flex-row gap-1.5">
            <TouchableOpacity 
              onPress={() => handleAction(item._id, 'reject')}
              className="h-9 w-9 items-center justify-center rounded-full bg-red-50 border border-red-100"
            >
              <X size={16} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleAction(item._id, 'accept')}
              className="h-9 w-9 items-center justify-center rounded-full bg-green-50 border border-green-100"
            >
              <Check size={16} color="#22c55e" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className={`px-2 py-1 rounded-full ${item.status === 'accepted' ? 'bg-green-50' : 'bg-red-50'}`}>
            <Text className={`text-[10px] font-extrabold ${item.status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      <View style={{ paddingTop: insets.top }} className="bg-white px-6 pb-2 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-extrabold text-[#1A2E1A]">Người xin món</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2E7D32" size="large" />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-4xl mb-2">👋</Text>
              <Text className="text-sm font-medium text-slate-400">Chưa có ai gửi yêu cầu xin món này</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
