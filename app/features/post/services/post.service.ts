import apiClient from '@/services/api-client';
import type { ApiResponse } from '@/types/api';
import type { CreatePostDTO } from '../types';

export class PostService {
  private static basePath = '/posts';

  static async createPost(data: CreatePostDTO): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('quantity', String(data.quantity));
      formData.append('unit', data.unit);
      formData.append('expirationDate', data.expirationDate);
      formData.append('locationText', data.locationText);
      formData.append('latitude', String(data.latitude));
      formData.append('longitude', String(data.longitude));

      // Append images
      data.images.forEach((imageUri, index) => {
        const filename = imageUri.split('/').pop() || `image-${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('images', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      });

      const response = await apiClient.post(this.basePath, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        data: response.data.data || response.data,
        error: null,
      };
    } catch (error: any) {
      console.error('PostService.createPost error:', error);
      return {
        data: null,
        error: error.response?.data?.message || 'Không thể tạo bài đăng',
      };
    }
  }

  static async getPostDetails(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`${this.basePath}/${id}`);
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Không thể lấy thông tin bài đăng',
      };
    }
  }

  static async getMyPosts(): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get(`${this.basePath}/me`);
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Không thể lấy danh sách bài đăng của bạn',
      };
    }
  }

  static async deletePost(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return { data: null, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Không thể xóa bài đăng',
      };
    }
  }

  static async getPostsForMap(params: { latitude: number; longitude: number; radius?: number }): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get(`${this.basePath}/map`, {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 10000,
        },
      });
      return {
        data: response.data?.data ?? null,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Không thể tải bản đồ món ăn',
      };
    }
  }
}
