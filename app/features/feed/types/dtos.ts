export type FeedFilterType = 'newest' | 'nearby' | 'expiring';

// Aligning with standard ApiResponse from '@/types/api'
// The controller returns: { success: true, data: { posts: [], pagination: {} } }
// But apiClient automatically extracts response.data.data if present in your services (like GiftLinke pattern).
// Let's define the actual Data structure returned by the API

export interface PostPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FeedResponse {
  posts: import('./entities').FoodPost[];
  pagination: PostPagination;
}

export interface FeedQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: FeedFilterType;
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}
