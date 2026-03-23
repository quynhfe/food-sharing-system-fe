import api from './api';

export const getUserTransactions = async (type: 'shared' | 'received' = 'shared') => {
  try {
    const response = await api.get(`/users/me/transactions?type=${type}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Không thể lấy lịch sử giao dịch';
  }
};
