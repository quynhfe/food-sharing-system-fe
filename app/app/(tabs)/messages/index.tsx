// app/(tabs)/messages/index.tsx – Screen 14: Chat List
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { getChats, Chat } from '../../../services/chatService';
import { connectSocket } from '../../../services/socketService';

type FilterTab = 'all' | 'open' | 'closed';

const STATUS_LABELS: Record<string, string> = {
  open: 'Đang chat',
  closed: 'Hoàn tất',
};

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-primary/10 text-primary',
  closed: 'bg-green-100 text-green-600',
};

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else {
    return `${diffDays} ngày trước`;
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const fetchChats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await getChats();
      setChats(data);
    } catch (err) {
      console.error('[MessagesScreen] Failed to load chats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
    connectSocket(); // ensure socket is connected
  }, [fetchChats]);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      search.trim() === '' ||
      chat.otherUser.fullName.toLowerCase().includes(search.toLowerCase()) ||
      chat.postTitle.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'open' && chat.status === 'open') ||
      (activeTab === 'closed' && chat.status === 'closed');

    return matchesSearch && matchesTab;
  });

  const renderItem = ({ item }: { item: Chat }) => {
    const statusStyle = STATUS_STYLES[item.status] ?? 'bg-slate-200 text-slate-600';
    const statusLabel = STATUS_LABELS[item.status] ?? item.status;

    return (
      <TouchableOpacity
        className="flex-row gap-3 p-3 rounded-2xl active:bg-white"
        style={{ gap: 12 }}
        onPress={() => router.push(`/messages/${item._id}` as any)}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="relative" style={{ width: 56, height: 56 }}>
          {item.otherUser.avatar ? (
            <Image
              source={{ uri: item.otherUser.avatar }}
              className="w-14 h-14 rounded-full border border-slate-100"
              resizeMode="cover"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
              <Text className="text-primary font-bold text-lg">
                {getInitials(item.otherUser.fullName)}
              </Text>
            </View>
          )}
          {item.postImage && (
            <View className="absolute -bottom-1 -left-1 w-6 h-6 rounded-lg border-2 border-white overflow-hidden bg-white shadow-sm">
                <Image source={{ uri: item.postImage }} className="w-full h-full" resizeMode="cover" />
            </View>
          )}
          {item.status === 'open' && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1" style={{ minWidth: 0 }}>
          <View className="flex-row justify-between items-start" style={{ marginBottom: 2 }}>
            <Text
              className="font-bold text-base text-slate-900"
              numberOfLines={1}
              style={{ flex: 1, marginRight: 8 }}
            >
              {item.otherUser.fullName}
            </Text>
            <Text className="text-[11px] text-slate-400">
              {formatTime(item.updatedAt)}
            </Text>
          </View>

          <Text className="text-primary text-xs font-semibold" numberOfLines={1} style={{ marginBottom: 4 }}>
            {item.postTitle}
          </Text>

          <View className="flex-row justify-between items-center">
            <Text
              className="text-sm text-slate-500 flex-1"
              numberOfLines={1}
              style={{ marginRight: 8 }}
            >
              {item.lastMessage?.content || 'Chưa có tin nhắn'}
            </Text>
            <View
              className={`px-2 py-0.5 rounded-full ${statusStyle.split(' ')[0]}`}
              style={{ flexShrink: 0 }}
            >
              <Text
                className={`text-[10px] font-bold uppercase tracking-wider ${statusStyle.split(' ')[1]}`}
              >
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'open', label: 'Đang mở' },
    { key: 'closed', label: 'Hoàn tất' },
  ];

  return (
    <View className="flex-1 bg-[#f6f8f6]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="bg-[#f6f8f6]/95 px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-slate-900">Tin nhắn</Text>
          <TouchableOpacity className="p-2 rounded-full" activeOpacity={0.7}>
            <Search size={22} color="#218c28" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4"
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
        >
          <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-slate-800"
            placeholder="Tìm cuộc trò chuyện..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter tabs */}
        <View className="flex-row border-b border-primary/10">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className="flex-1 py-3 items-center"
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-400'
                }`}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#218c28" />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchChats(true)}
              tintColor="#218c28"
              colors={['#218c28']}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">💬</Text>
              <Text className="text-slate-500 text-base font-medium text-center">
                {search ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có tin nhắn nào'}
              </Text>
              {!search && (
                <Text className="text-slate-400 text-sm text-center mt-1">
                  Khi bạn nhận yêu cầu thực phẩm, cuộc trò chuyện sẽ xuất hiện ở đây
                </Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}
