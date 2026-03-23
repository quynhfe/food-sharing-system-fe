// app/(tabs)/messages/[id].tsx – Screen 15: Chat Detail
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, Camera, Send, CheckCircle } from 'lucide-react-native';
import { getChatMessages, completeRequest, Message } from '../../../services/chatService';
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  sendMessage as socketSendMessage,
  onReceiveMessage,
  offReceiveMessage,
} from '../../../services/socketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function formatBubbleTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function groupByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: Record<string, Message[]> = {};
  for (const msg of messages) {
    const day = new Date(msg.createdAt).toDateString();
    if (!groups[day]) groups[day] = [];
    groups[day].push(msg);
  }
  return Object.entries(groups).map(([date, messages]) => ({
    date: formatDateHeader(messages[0].createdAt),
    messages,
  }));
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [convStatus, setConvStatus] = useState<'open' | 'closed'>('open');

  // Get current user id from storage
  useEffect(() => {
    AsyncStorage.getItem('userId').then((uid) => setMyUserId(uid));
  }, []);

  // Fetch message history
  const fetchMessages = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getChatMessages(id);
      setMessages(data.messages);
      setConvStatus(data.conversation.status);

      // Populate header fields from the populated conversation info
      setOtherUserName(data.conversation.otherUser?.fullName ?? '');
      setPostTitle(data.conversation.postTitle ?? '');
      setPostImage(data.conversation.postImage ?? null);

      // requestId is the transactionId (refers to a Request document)
      setRequestId(data.conversation.transactionId as unknown as string);

      if (data.conversation.status === 'closed') setIsCompleted(true);
    } catch (err) {
      console.error('[ChatDetail] Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Socket setup
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const setup = async () => {
      await connectSocket();
      if (!mounted) return;
      joinRoom(id);

      const handler = (msg: Message) => {
        setMessages((prev) => {
          // Avoid duplicate if message already in list (sent by this device)
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      };

      onReceiveMessage(handler);

      return () => {
        offReceiveMessage(handler);
        leaveRoom(id);
      };
    };

    const cleanup = setup();

    return () => {
      mounted = false;
      cleanup.then((fn) => fn?.());
    };
  }, [id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !id || isSending) return;
    setInputText('');
    socketSendMessage(id, text);
  };

  const handleComplete = async () => {
    if (!requestId || isCompleting || isCompleted) return;

    Alert.alert(
      'Đánh dấu hoàn tất',
      'Bạn có chắc chắn muốn đánh dấu giao dịch này là hoàn tất?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'default',
          onPress: async () => {
            try {
              setIsCompleting(true);
              await completeRequest(requestId);
              setIsCompleted(true);
              setConvStatus('closed');
              Alert.alert('Thành công', 'Giao dịch đã được đánh dấu hoàn tất!');
            } catch (err: any) {
              Alert.alert(
                'Lỗi',
                err?.response?.data?.message || 'Không thể hoàn tất giao dịch'
              );
            } finally {
              setIsCompleting(false);
            }
          },
        },
      ]
    );
  };

  // ─── Render one bubble ───────────────────────────────────────────────────
  const renderBubble = (msg: Message, isMe: boolean) => (
    <View
      key={msg._id}
      className={`flex-row items-end gap-2 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}
      style={{ maxWidth: '85%', alignSelf: isMe ? 'flex-end' : 'flex-start' }}
    >
      {/* Avatar (only for other user) */}
      {!isMe && (
        <View className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 items-center justify-center">
          {msg.senderId?.avatar ? (
            <Image source={{ uri: msg.senderId.avatar }} className="w-8 h-8" resizeMode="cover" />
          ) : (
            <Text className="text-primary text-xs font-bold">
              {(msg.senderId?.fullName ?? '?')[0].toUpperCase()}
            </Text>
          )}
        </View>
      )}

      <View className={`flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <Text className="text-[11px] text-slate-500 ml-1">
            {msg.senderId?.fullName ?? ''}
          </Text>
        )}
        <View
          className={`px-4 py-2.5 rounded-2xl ${
            isMe
              ? 'bg-primary rounded-br-sm'
              : 'bg-primary/10 rounded-bl-sm'
          }`}
        >
          <Text
            className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-slate-900'}`}
          >
            {msg.content}
          </Text>
        </View>
        <Text className={`text-[10px] text-slate-400 ${isMe ? 'mr-1' : 'ml-1'}`}>
          {formatBubbleTime(msg.createdAt)}
          {isMe && msg.isRead && '  Đã xem'}
        </Text>
      </View>
    </View>
  );

  // Group messages by date for rendering
  const grouped = groupByDate(messages);

  const flatData: ({ type: 'header'; date: string } | { type: 'msg'; msg: Message })[] = [];
  for (const group of grouped) {
    flatData.push({ type: 'header', date: group.date });
    for (const msg of group.messages) {
      flatData.push({ type: 'msg', msg });
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="bg-white border-b border-primary/10"
        style={{ paddingTop: insets.top + 4 }}
      >
        <View className="flex-row items-center px-4 pb-3 gap-3">
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden items-center justify-center ring-2">
              {postImage ? (
                <Image source={{ uri: postImage }} className="w-10 h-10" resizeMode="cover" />
              ) : (
                <Text className="text-primary font-bold">{otherUserName[0] ?? '?'}</Text>
              )}
            </View>
            <View>
              <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
                {otherUserName || 'Chat'}
              </Text>
              <Text className="text-primary text-xs font-semibold" numberOfLines={1}>
                {postTitle}
                {convStatus === 'closed' ? ' · Hoàn tất' : ' · Đang chờ lấy'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            activeOpacity={0.7}
          >
            <MoreVertical size={22} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Food Info Banner */}
        {(postTitle || postImage) && (
          <View className="mx-4 mb-3 flex-row items-center gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
            {postImage ? (
              <Image
                source={{ uri: postImage }}
                className="w-16 h-16 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-16 h-16 rounded-xl bg-primary/10 items-center justify-center">
                <Text className="text-2xl">🍱</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                {postTitle}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>
                {convStatus === 'closed' ? 'Đã hoàn tất' : 'Đang chờ lấy'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Messages */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#218c28" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={flatData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${index}` : item.msg._id
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View className="flex items-center my-4">
                  <View className="bg-primary/5 px-4 py-1 rounded-full">
                    <Text className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                      {item.date}
                    </Text>
                  </View>
                </View>
              );
            }

            const isMe = item.msg.senderId?._id === myUserId;
            return renderBubble(item.msg, isMe);
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Text className="text-3xl mb-3">👋</Text>
              <Text className="text-slate-500 font-medium">Bắt đầu cuộc trò chuyện!</Text>
              <Text className="text-slate-400 text-sm mt-1 text-center">
                {'Nhắn tin để sắp xếp việc lấy đồ'}
              </Text>
            </View>
          }
        />
      )}

      {/* "Mark Complete" floating button */}
      {!isCompleted && convStatus === 'open' && (
        <View
          className="absolute left-0 right-0 flex items-center pointer-events-none"
          style={{ bottom: 88 }}
        >
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-primary px-6 py-3 rounded-full shadow-lg"
            style={{
              shadowColor: '#218c28',
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}
            onPress={handleComplete}
            disabled={isCompleting}
            activeOpacity={0.85}
          >
            {isCompleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <CheckCircle size={18} color="white" />
            )}
            <Text className="text-white font-bold text-sm uppercase tracking-wide">
              Đánh dấu hoàn tất
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completed banner */}
      {isCompleted && (
        <View className="absolute left-0 right-0 flex items-center" style={{ bottom: 88 }}>
          <View className="flex-row items-center gap-2 bg-green-100 px-5 py-2.5 rounded-full border border-green-200">
            <CheckCircle size={16} color="#16a34a" />
            <Text className="text-green-700 font-bold text-sm">Giao dịch đã hoàn tất</Text>
          </View>
        </View>
      )}

      {/* Input bar */}
      <View
        className="bg-white border-t border-primary/10 px-4 py-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full"
            activeOpacity={0.7}
            disabled={isCompleted}
          >
            <Camera size={20} color={isCompleted ? '#94a3b8' : '#218c28'} />
          </TouchableOpacity>

          <TextInput
            className="flex-1 bg-[#f6f8f6] rounded-full px-5 py-2.5 text-sm text-slate-900"
            placeholder={isCompleted ? 'Cuộc trò chuyện đã kết thúc' : 'Nhắn tin...'}
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isCompleted}
            multiline
          />

          <TouchableOpacity
            className={`w-10 h-10 items-center justify-center rounded-full ${
              inputText.trim() && !isCompleted ? 'bg-primary' : 'bg-slate-200'
            }`}
            onPress={handleSend}
            disabled={!inputText.trim() || isCompleted}
            activeOpacity={0.8}
          >
            <Send size={18} color={inputText.trim() && !isCompleted ? 'white' : '#94a3b8'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
