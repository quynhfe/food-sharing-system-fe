// services/requestService.ts
import apiClient from './api-client';

export interface RequestData {
  _id: string;
  postId: any;
  receiverId: any;
  donorId: any;
  requestedQty?: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export const requestService = {
  /** POST /requests - Gửi yêu cầu nhận thực phẩm */
  createRequest: async (postId: string, requestedQty: number): Promise<RequestData> => {
    const res = await apiClient.post('/requests', { postId, requestedQty });
    return res.data.data;
  },

  /** GET /requests/post/:postId - Lấy danh sách yêu cầu cho 1 bài đăng (Donor) */
  getIncomingRequests: async (postId: string): Promise<RequestData[]> => {
    const res = await apiClient.get(`/requests/post/${postId}`);
    return res.data.data;
  },

  getRequestById: async (id: string): Promise<{ request: RequestData; transaction: any; conversation: any }> => {
    const res = await apiClient.get(`/requests/${id}`);
    return res.data.data;
  },

  /** POST /requests/:id/accept - Chấp nhận yêu cầu */
  acceptRequest: async (id: string): Promise<RequestData & { conversationId?: string }> => {
    const res = await apiClient.post(`/requests/${id}/accept`);
    return res.data.data;
  },

  /** POST /requests/:id/reject - Từ chối yêu cầu */
  rejectRequest: async (id: string): Promise<RequestData> => {
    const res = await apiClient.post(`/requests/${id}/reject`);
    return res.data.data;
  },

  /** POST /requests/:id/cancel - Hủy yêu cầu (bởi Receiver) */
  cancelRequest: async (id: string): Promise<RequestData> => {
    const res = await apiClient.post(`/requests/${id}/cancel`);
    return res.data.data;
  },

  /** PUT /requests/:id/complete - Đánh dấu giao dịch hoàn tất */
  completeRequest: async (id: string): Promise<RequestData> => {
    const res = await apiClient.put(`/requests/${id}/complete`);
    return res.data.data;
  },

  /** PUT /requests/:id/no-show - Báo cáo no-show */
  reportNoShow: async (id: string): Promise<RequestData> => {
    const res = await apiClient.put(`/requests/${id}/no-show`);
    return res.data.data;
  },

  /** GET /requests/me - Lấy danh sách yêu cầu đã gửi (Receiver) */
  getMyRequests: async (): Promise<RequestData[]> => {
    const res = await apiClient.get('/requests/me');
    return res.data.data;
  },

  /** GET /requests/donor/history - Mọi yêu cầu trên bài của người cho (cả chờ & đã xử lý) */
  getDonorRequestHistory: async (): Promise<RequestData[]> => {
    const res = await apiClient.get('/requests/donor/history');
    return res.data.data;
  },
};
