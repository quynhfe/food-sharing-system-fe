import apiClient from '@/services/api-client';
import type { ApiResponse } from '@/types/api';
import type { FoodPost } from '@/features/feed/types';

export interface SearchParams {
  search?: string;
  category?: 'cooked' | 'raw' | 'packaged' | 'other';
  filter?: 'newest' | 'expiring' | 'nearby';
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}

export interface SearchPaginatedResponse {
  posts: FoodPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class SearchService {
  private static basePath = '/posts';

  static async searchPosts(
    params: SearchParams
  ): Promise<ApiResponse<SearchPaginatedResponse>> {
    try {
      const response = await apiClient.get(SearchService.basePath, {
        params: {
          search: params.search,
          category: params.category,
          filter: params.filter || 'newest',
          page: params.page || 1,
          limit: params.limit || 10,
          latitude: params.latitude,
          longitude: params.longitude,
          maxDistance: params.maxDistance,
        },
        timeout: 10000,
      });

      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      console.warn('[SearchService] searchPosts error:', error.message);
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Không thể tìm kiếm',
      };
    }
  }
}
