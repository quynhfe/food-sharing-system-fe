import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://127.0.0.1:5000';

let socket: Socket | null = null;

/** Connect to Socket.io server using the stored JWT token */
export const connectSocket = async (): Promise<Socket | null> => {
  if (socket?.connected) return socket;

  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    console.warn('[Socket] No token found, cannot connect');
    return null;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  return socket;
};

/** Disconnect from the socket server */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Manually disconnected');
  }
};

/** Get the current socket instance */
export const getSocket = (): Socket | null => socket;

/** Join a conversation room */
export const joinRoom = (conversationId: string) => {
  socket?.emit('join_room', conversationId);
};

/** Leave a conversation room */
export const leaveRoom = (conversationId: string) => {
  socket?.emit('leave_room', conversationId);
};

/** Send a message to a room */
export const sendMessage = (conversationId: string, content: string) => {
  socket?.emit('send_message', { conversationId, content });
};

/** Subscribe to incoming messages */
export const onReceiveMessage = (callback: (message: any) => void) => {
  socket?.on('receive_message', callback);
};

/** Unsubscribe from incoming messages */
export const offReceiveMessage = (callback?: (message: any) => void) => {
  if (callback) {
    socket?.off('receive_message', callback);
  } else {
    socket?.off('receive_message');
  }
};
