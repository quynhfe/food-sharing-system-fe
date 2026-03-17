import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  login: async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  },

  getCurrentUser: async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch {
      return null;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  }
};
