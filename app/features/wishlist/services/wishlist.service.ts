import apiClient from '@/services/api-client';
import type { ApiResponse } from '@/types/api';
import type { FoodPost } from '@/features/feed/types';

export interface WishlistItem {
  _id: string;
  userId: string;
  postId: string;
  post: FoodPost;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistPaginatedResponse {
  wishlists: WishlistItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class WishlistService {
  private static basePath = '/wishlist';

  static async addToWishlist(
    postId: string
  ): Promise<ApiResponse<{ _id: string; userId: string; postId: string }>> {
    try {
      const response = await apiClient.post(this.basePath, { postId }, { timeout: 10000 });
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Không thể thêm vào yêu thích',
      };
    }
  }

  static async getWishlist(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<WishlistPaginatedResponse>> {
    try {
      const response = await apiClient.get(this.basePath, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
        },
        timeout: 10000,
      });
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Không thể tải danh sách yêu thích',
      };
    }
  }

  static async removeFromWishlist(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`, { timeout: 10000 });
      return { data: null, error: null };
    } catch (error: any) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Không thể xoá khỏi yêu thích',
      };
    }
  }

  static async checkWishlist(
    postId: string
  ): Promise<ApiResponse<{ wishlisted: boolean; wishlistId: string | null }>> {
    try {
      const response = await apiClient.get(`${this.basePath}/check/${postId}`, {
        timeout: 10000,
      });
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Không thể kiểm tra yêu thích',
      };
    }
  }
}
