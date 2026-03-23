// services/postService.ts
import apiClient from './api-client';

export interface CreatePostData {
  title: string;
  description?: string;
  category: 'cooked' | 'raw' | 'packaged' | 'other';
  quantity: number;
  unit: 'kg' | 'portion' | 'box' | 'item';
  expirationDate: string;
  location: {
    province: string;
    district: string;
    detail: string;
    coordinates: {
      type: 'Point';
      coordinates: number[];
    };
  };
  images?: string[];
}

export interface PostData extends CreatePostData {
  _id: string;
  donorId: any;
  status: 'active' | 'closed' | 'suspended';
  createdAt: string;
  updatedAt: string;
  availableQuantity?: number;
  calculatedDistance?: number;
}

export const postService = {
  /** GET /posts - Lấy tất cả bài đăng (public) */
  getPosts: async (params?: { search?: string; filter?: string; page?: number; limit?: number; latitude?: number; longitude?: number; maxDistance?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.filter) query.append('filter', params.filter);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.latitude !== undefined) query.append('latitude', String(params.latitude));
    if (params?.longitude !== undefined) query.append('longitude', String(params.longitude));
    if (params?.maxDistance) query.append('maxDistance', String(params.maxDistance));
    const res = await apiClient.get(`/posts?${query.toString()}`);
    return res.data.data;
  },

  /** GET /posts/:id - Lấy chi tiết bài đăng */
  getPostById: async (id: string): Promise<PostData> => {
    const res = await apiClient.get(`/posts/${id}`);
    return res.data.data;
  },

  /** GET /posts/me - Lấy bài đăng của tôi */
  getMyPosts: async (): Promise<PostData[]> => {
    const res = await apiClient.get('/posts/me');
    return res.data.data;
  },

  /** POST /posts - Tạo bài đăng mới (cần auth) */
  createPost: async (data: CreatePostData): Promise<PostData> => {
    const res = await apiClient.post('/posts', data);
    return res.data.data;
  },

  /** PUT /posts/:id - Cập nhật bài đăng */
  updatePost: async (id: string, data: Partial<CreatePostData>): Promise<PostData> => {
    const res = await apiClient.put(`/posts/${id}`, data);
    return res.data.data;
  },
};
