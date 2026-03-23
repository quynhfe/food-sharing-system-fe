import api from './api';

export const createReview = async (transactionId: string, score: number, comment = '') => {
  try {
    const response = await api.post('/reviews', { transactionId, score, comment });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể gửi đánh giá';
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/reviews`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể lấy danh sách đánh giá';
  }
};
