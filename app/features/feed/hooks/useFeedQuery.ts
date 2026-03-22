import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { FeedService } from '../services/feed.service';
import type { FeedQueryParams } from '../types';

export function useInfiniteFeedQuery(filters: FeedQueryParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.food.list(filters),
    // React Query v5 syntax for infinite queries
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await FeedService.getPosts({
        ...filters,
        page: pageParam as number,
        limit: 10,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { page, totalPages, hasMore } = lastPage.pagination;
      return hasMore ? page + 1 : undefined;
    },
  });
}

export function useFeedPostQuery(id: string) {
  // In a real app we'd have a getById method in FeedService
  // but for this task we are focusing on the list
  return useQuery({
    queryKey: queryKeys.food.detail(id),
    queryFn: async () => {
      // Placeholder for detail fetch
      return null;
    },
    enabled: !!id,
  });
}
