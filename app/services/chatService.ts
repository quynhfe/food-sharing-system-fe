import api from './api';

/** GET /api/v1/chats – list all conversations for the current user */
export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data.data as Chat[];
};

/**
 * GET /api/v1/chats/by-post/:postId
 * Find the conversation linked to a specific food post for the current user.
 * Throws if no conversation exists (post not yet accepted).
 */
export const getConversationByPost = async (postId: string): Promise<Chat> => {
  const response = await api.get(`/chats/by-post/${postId}`);
  return response.data.data as Chat;
};

/** GET /api/v1/chats/:id/messages – message history for a conversation */
export const getChatMessages = async (conversationId: string, page = 1, limit = 50) => {
  const response = await api.get(`/chats/${conversationId}/messages`, {
    params: { page, limit },
  });
  return response.data.data as { messages: Message[]; conversation: ConversationDetail };
};

/** PUT /api/v1/requests/:id/complete — mỗi bên bấm một lần; khi đủ hai bên mới chốt */
export const completeRequest = async (requestId: string): Promise<CompleteRequestResponse> => {
  const response = await api.put(`/requests/${requestId}/complete`);
  return response.data.data;
};

export interface CompleteRequestResponse {
  message: string;
  fullyCompleted: boolean;
  donorConfirmed: boolean;
  receiverConfirmed: boolean;
  request?: unknown;
  transaction?: unknown;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OtherUser {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface LastMessage {
  content: string;
  senderId: string;
  sentAt: string;
}

export interface Chat {
  _id: string;
  otherUser: OtherUser;
  postTitle: string;
  postImage?: string;
  lastMessage?: LastMessage;
  status: 'open' | 'closed';
  updatedAt: string;
}

export interface MessageSender {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: MessageSender;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationDetail {
  _id: string;
  transactionId: string;
  requestId?: string | null;
  donorId: string;
  receiverId: string;
  status: 'open' | 'closed';
  otherUser: OtherUser;
  postTitle: string;
  postImage?: string | null;
  donorConfirmed?: boolean;
  receiverConfirmed?: boolean;
  requestStatus?: string | null;
}
