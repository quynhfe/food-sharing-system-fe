import apiClient from './api-client';
import { storage } from '@/utils/storage';

export const authService = {
  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.success) {
        await storage.setItem('userToken', response.data.data.token);
        await storage.setItem('userInfo', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  login: async (credentials: any) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.success) {
        await storage.setItem('userToken', response.data.data.token);
        await storage.setItem('userInfo', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  logout: async () => {
    await storage.removeItem('userToken');
    await storage.removeItem('userInfo');
  },

  getCurrentUser: async () => {
    try {
      const userInfoString = await storage.getItem('userInfo');
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch {
      return null;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Mã OTP không hợp lệ';
    }
  },

  resetPassword: async (email: string, otp: string, password: string) => {
    try {
      const response = await apiClient.put('/auth/reset-password', { email, otp, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Lỗi kết nối mạng';
    }
  }
};
