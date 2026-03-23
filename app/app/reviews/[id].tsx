import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text } from '../../components/ui/text';
import { ArrowLeft, Star } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserReviews } from '../../services/reviewService';

export default function UserReviews() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getUserReviews(id as string);
        setReviews(response.data || []);
      } catch (error) {
        console.log('Error fetching reviews', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const renderItem = ({ item }: { item: any }) => {
    const rater = item.raterId || {};
    
    return (
      <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm shadow-slate-100">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Image 
              source={{ uri: rater.avatar || 'https://i.pravatar.cc/150?img=8' }} 
              className="w-10 h-10 rounded-full bg-slate-50" 
            />
            <View>
              <Text className="font-bold text-slate-800 text-sm">{rater.fullName || 'Người dùng'}</Text>
              <Text className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
             <Star size={12} color="#F59E0B" fill="#F59E0B" />
             <Text className="font-bold text-amber-700 text-xs ml-1">{item.score || 5}</Text>
          </View>
        </View>

        {item.comment ? (
          <Text className="text-sm text-slate-600 leading-relaxed">"{item.comment}"</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAF8]">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-6 pb-2 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-slate-50" activeOpacity={0.7}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-extrabold text-[#1A2E1A]">Đánh giá & Phản hồi</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2E7D32" size="large" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-4xl mb-2">⭐</Text>
              <Text className="text-sm font-medium text-slate-400">Chưa có đánh giá nào cho người dùng này</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
