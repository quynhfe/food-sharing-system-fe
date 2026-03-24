import apiClient from '@/services/api-client';
import type { ApiResponse } from '@/types/api';

export interface NotificationItem {
  _id: string;
  userId: string;
  type: 'SYSTEM' | 'POST_EXPIRED' | 'REQUEST_RECEIVED' | 'REQUEST_ACCEPTED' | 'WARNING';
  title: string;
  message: string;
  isRead: boolean;
  relatedPostId?: { _id: string; title: string };
  createdAt: string;
}

export interface NotificationPaginatedResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class NotificationService {
  private static basePath = '/notifications';

  static async getNotifications(params: { page?: number; limit?: number }): Promise<ApiResponse<NotificationPaginatedResponse>> {
    try {
      const response = await apiClient.get(this.basePath, {
        params: {
          page: params.page || 1,
          limit: params.limit || 15,
        },
      });
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Không thể tải thông báo',
      };
    }
  }

  static async markAsRead(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`${this.basePath}/${id}/read`);
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Lỗi xử lý',
      };
    }
  }

  static async markAllAsRead(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`${this.basePath}/read-all`);
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Lỗi xử lý',
      };
    }
  }
}
