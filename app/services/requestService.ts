import api from './api';

export const createRequest = async (postId: string, requestedQty = 1, message = '') => {
  try {
    const response = await api.post('/requests', { postId, requestedQty, message });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể gửi yêu cầu';
  }
};

export const getRequestStatus = async (id: string) => {
  try {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể lấy thông tin yêu cầu';
  }
};

export const cancelRequest = async (id: string, reason = '') => {
  try {
    const response = await api.post(`/requests/${id}/cancel`, { reason });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể hủy yêu cầu';
  }
};

export const acceptRequest = async (id: string) => {
  try {
    const response = await api.post(`/requests/${id}/accept`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể chấp nhận yêu cầu';
  }
};

export const rejectRequest = async (id: string) => {
  try {
    const response = await api.post(`/requests/${id}/reject`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể từ chối yêu cầu';
  }
};

export const getPostRequests = async (postId: string) => {
  try {
    const response = await api.get(`/requests/post/${postId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể lấy danh sách người xin món';
  }
};
