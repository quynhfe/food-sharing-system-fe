// services/adminService.ts
import apiClient from './api-client';

export interface AdminDashboard {
  totalUsers: number;
  totalPosts: number;
  totalCompletedTransactions: number;
  recentUsers?: any[];
  recentPosts?: any[];
}

export const adminService = {
  /** GET /admin/dashboard - Lấy thống kê tổng quan (Admin only) */
  getDashboard: async (): Promise<AdminDashboard> => {
    const res = await apiClient.get('/admin/dashboard');
    return res.data.data;
  },

  /** PUT /admin/posts/:id/suspend - Ẩn/suspend bài đăng (Admin only) */
  suspendPost: async (postId: string): Promise<any> => {
    const res = await apiClient.put(`/admin/posts/${postId}/suspend`);
    return res.data.data;
  },

  /** PUT /admin/users/:id/suspend - Ẩn/suspend người dùng (Admin only) */
  suspendUser: async (userId: string): Promise<any> => {
    const res = await apiClient.put(`/admin/users/${userId}/suspend`);
    return res.data.data;
  },
};
