import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text } from '../components/ui/text';
import { ArrowLeft, MapPin, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserTransactions } from '../services/transactionService';

export default function TransactionHistory() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'shared' | 'received'>('shared');
  const [data, setData] = useState<any[]>([]);

  const fetchTransactions = async (selectedType: 'shared' | 'received') => {
    setLoading(true);
    try {
      const response = await getUserTransactions(selectedType);
      setData(response.data || []);
    } catch (error) {
      console.log('Error fetching history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(type);
  }, [type]);

  const renderItem = ({ item }: { item: any }) => {
    const food = item.postId || {};
    const withUser = type === 'shared' ? item.receiverId : item.donorId;
    const isCompleted = item.status === 'completed';

    return (
      <TouchableOpacity 
        className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 flex-row gap-3 shadow-sm shadow-slate-200/40"
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/request/[id]', params: { id: item._id } })}
      >
        <Image 
          source={{ uri: food.images?.[0] || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500' }} 
          className="w-20 h-20 rounded-xl bg-slate-50" 
        />
        <View className="flex-1 justify-between py-0.5">
          <View>
            <Text className="font-bold text-slate-800 text-base mb-1" numberOfLines={1}>{food.title || 'Món ăn'}</Text>
            <Text className="text-xs text-slate-400">
              {type === 'shared' ? 'Người nhận: ' : 'Người đăng: '}
              <Text className="font-bold text-slate-600">{withUser?.fullName || 'N/A'}</Text>
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View className={`px-2 py-1 rounded-full ${isCompleted ? 'bg-green-50' : 'bg-slate-50'}`}>
              <Text className={`text-[10px] font-extrabold ${isCompleted ? 'text-green-700' : 'text-slate-500'}`}>
                {isCompleted ? 'HOÀN TẤT' : 'ĐÃ HỦY'}
              </Text>
            </View>
            <Text className="text-[10px] text-slate-400">
              {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-6 pb-2 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-extrabold text-[#1A2E1A]">Lịch sử giao dịch</Text>
      </View>

      {/* Tabs Filter */}
      <View className="flex-row px-6 py-4 gap-3 bg-white border-b border-slate-100/80">
        <TouchableOpacity 
          onPress={() => setType('shared')}
          className={`flex-1 py-3 rounded-2xl items-center border ${type === 'shared' ? 'bg-[#2E7D32] border-[#2E7D32]' : 'bg-white border-slate-200'}`}
        >
          <Text className={`font-bold text-sm ${type === 'shared' ? 'text-white' : 'text-slate-600'}`}>Đã chia sẻ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setType('received')}
          className={`flex-1 py-3 rounded-2xl items-center border ${type === 'received' ? 'bg-[#2E7D32] border-[#2E7D32]' : 'bg-white border-slate-200'}`}
        >
          <Text className={`font-bold text-sm ${type === 'received' ? 'text-white' : 'text-slate-600'}`}>Đã nhận</Text>
        </TouchableOpacity>
      </View>

      {/* List content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2E7D32" size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-3xl mb-2">📦</Text>
              <Text className="text-sm font-medium text-slate-400">Chưa có giao dịch lịch sử</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
