/**
 * Centralized query keys for React Query
 * This helps maintain consistency and makes it easier to invalidate related queries
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Food posts
  food: {
    all: ['food'] as const,
    lists: () => [...queryKeys.food.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.food.lists(), filters] as const,
    details: () => [...queryKeys.food.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.food.details(), id] as const,
  },

  // Requests
  requests: {
    all: ['requests'] as const,
    lists: () => [...queryKeys.requests.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.requests.lists(), filters] as const,
    details: () => [...queryKeys.requests.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.requests.details(), id] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
} as const;

/**
 * Helper function to invalidate all queries for a specific domain
 */
export const invalidateQueries = {
  auth: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
  },
  food: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.food.all });
  },
  requests: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
  },
  users: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  },
  notifications: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  },
  all: (queryClient: any) => {
    queryClient.invalidateQueries();
  },
};
