import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronLeft, Send, Image as ImageIcon } from 'lucide-react-native';

const mockConversations = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    food: 'Bún chả Hà Nội',
    time: '14:30',
    status: 'Đang chờ xác nhận',
    statusColor: 'bg-warning/10',
    statusTextColor: 'text-warning',
    hasUnread: true,
    avatar: 'A',
  },
  {
    id: '2',
    name: 'Trần Thị Bé',
    food: 'Phở Bò Tái Lăn',
    time: '12:15',
    status: 'Đã xác nhận lấy',
    statusColor: 'bg-primary/10',
    statusTextColor: 'text-primary',
    hasUnread: false,
    avatar: 'B',
  },
  {
    id: '3',
    name: 'Lê Minh Khôi',
    food: 'Bánh mì bơ tỏi',
    time: 'Hôm qua',
    status: 'Hoàn tất',
    statusColor: 'bg-surface-dark',
    statusTextColor: 'text-text-secondary',
    hasUnread: false,
    avatar: 'K',
  },
];

const mockChatMessages = [
  { id: '1', text: 'Chào bạn, mình thấy bạn đang đăng tặng cơm tấm, không biết còn không ạ?', isMe: false, time: '14:20' },
  { id: '2', text: 'Chào bạn, dạ còn nha bạn.', isMe: true, time: '14:25' },
  { id: '3', text: 'Tuyệt quá, khoảng 5h chiều mình ghé lấy được không?', isMe: false, time: '14:30' },
];

export default function MessagesScreen() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  if (activeChat) {
    const chatInfo = mockConversations.find(c => c.id === activeChat);
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        {/* Chat Header */}
        <View className="px-4 py-3 border-b border-border-green flex-row items-center gap-3 bg-white">
          <TouchableOpacity onPress={() => setActiveChat(null)} className="p-2 -ml-2 rounded-full hover:bg-surface">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
            <Text className="font-bold text-primary">{chatInfo?.avatar}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-text-main text-base">{chatInfo?.name}</Text>
            <Text className="text-xs text-text-secondary">Về món: {chatInfo?.food}</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={mockChatMessages}
          keyExtractor={item => item.id}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${item.isMe ? 'bg-primary self-end rounded-tr-sm' : 'bg-white border border-border-green self-start rounded-tl-sm shadow-sm'}`}>
              <Text className={`text-base ${item.isMe ? 'text-white' : 'text-text-main'}`}>{item.text}</Text>
              <Text className={`text-[10px] mt-1 text-right ${item.isMe ? 'text-white/70' : 'text-text-secondary'}`}>{item.time}</Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View className="p-4 bg-white border-t border-border-green flex-row items-center gap-3">
          <TouchableOpacity className="p-2 rounded-full bg-surface">
            <ImageIcon size={20} color="#5a7a5a" />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-surface rounded-full px-4 py-2.5 text-text-main border border-border-green focus:border-primary focus:bg-white"
          />
          <TouchableOpacity className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm shadow-black/5">
            <Send size={18} color="white" className="ml-1" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-black text-text-main tracking-tight mb-4">Tin nhắn 💬</Text>
        <View className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3 border border-border-green mb-2 shadow-sm shadow-black/5">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-text-main text-base p-0"
          />
        </View>
      </View>

        <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setActiveChat(item.id)}
            className="mb-3 bg-white rounded-2xl p-4 flex-row items-center gap-4 border border-border-green shadow-sm shadow-black/5"
          >
            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
              <Text className="text-xl font-bold text-primary">{item.avatar}</Text>
            </View>
            
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-bold text-text-main text-base">{item.name}</Text>
                <Text className="text-xs font-semibold text-text-secondary">{item.time}</Text>
              </View>
              <Text className="text-sm text-text-secondary mb-2" numberOfLines={1}>
                {item.hasUnread ? 'Tin nhắn mới từ người này...' : 'Về món: ' + item.food}
              </Text>
              <View className={`self-start px-2.5 py-1 rounded-md ${item.statusColor}`}>
                <Text className={`text-[10px] font-bold uppercase tracking-wide ${item.statusTextColor}`}>
                  {item.status}
                </Text>
              </View>
            </View>

            {item.hasUnread && (
              <View className="w-3 h-3 bg-danger rounded-full" />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
