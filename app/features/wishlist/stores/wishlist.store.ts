import { create } from 'zustand';
import type { FoodPost } from '@/features/feed/types';
import {
  WishlistService,
  type WishlistItem,
} from '../services/wishlist.service';

interface WishlistState {
  // Data
  wishlist: WishlistItem[];
  wishlistMap: Record<string, string>; // postId → wishlistId (for O(1) lookup)

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  loadingItems: Set<string>; // postIds currently being toggled
  error: string | null;

  // Actions
  fetchWishlist: (page?: number, isRefresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchAllWishlistMap: () => Promise<void>;
  addToWishlist: (postId: string) => Promise<boolean>;
  removeFromWishlist: (postId: string) => Promise<boolean>;
  toggleWishlist: (post: FoodPost) => Promise<void>;
  isSaved: (postId: string) => boolean;
  isItemLoading: (postId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  wishlistMap: {},
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  loadingItems: new Set(),
  error: null,

  isSaved: (postId: string) => !!get().wishlistMap[postId],

  isItemLoading: (postId: string) => get().loadingItems.has(postId),

  // ── Fetch paginated wishlist ──
  fetchWishlist: async (page = 1, isRefresh = false) => {
    if (get().isLoading && !isRefresh) return;

    if (page === 1) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    const { data, error } = await WishlistService.getWishlist({
      page,
      limit: 10,
    });

    if (error) {
      set({ isLoading: false, isLoadingMore: false, error });
      return;
    }

    if (data) {
      const newItems = data.wishlists || [];
      const newMap = page === 1 ? {} : { ...get().wishlistMap };
      newItems.forEach((item) => {
        newMap[item.postId] = item._id;
      });

      set((state) => {
        const updatedWishlist =
          page === 1
            ? newItems
            : [
                ...state.wishlist,
                ...newItems.filter(
                  (item) =>
                    !state.wishlist.some((existing) => existing._id === item._id)
                ),
              ];

        return {
          wishlist: updatedWishlist,
          wishlistMap: newMap,
          currentPage: page,
          totalPages: data.pagination.totalPages,
          hasMore: data.pagination.hasMore,
          isLoading: false,
          isLoadingMore: false,
          error: null,
        };
      });
    } else {
      set({ isLoading: false, isLoadingMore: false });
    }
  },

  // ── Load more ──
  loadMore: async () => {
    const { hasMore, currentPage, isLoading, isLoadingMore } = get();
    if (!hasMore || isLoading || isLoadingMore) return;
    await get().fetchWishlist(currentPage + 1);
  },

  // ── Fetch all for map sync (on app start) ──
  fetchAllWishlistMap: async () => {
    try {
      const { data } = await WishlistService.getWishlist({
        page: 1,
        limit: 999,
      });
      if (data?.wishlists) {
        const newMap: Record<string, string> = {};
        data.wishlists.forEach((item) => {
          newMap[item.postId] = item._id;
        });
        set({ wishlistMap: newMap });
      }
    } catch (err) {
      console.warn('Failed to sync wishlist map:', err);
    }
  },

  // ── Add to wishlist (optimistic) ──
  addToWishlist: async (postId: string) => {
    // Add to loading set
    set((state) => ({
      loadingItems: new Set([...state.loadingItems, postId]),
    }));

    // Optimistic: add to map immediately
    const tempId = `temp_${postId}_${Date.now()}`;
    set((state) => ({
      wishlistMap: { ...state.wishlistMap, [postId]: tempId },
    }));

    const { data, error } = await WishlistService.addToWishlist(postId);

    // Remove from loading
    set((state) => {
      const newLoading = new Set(state.loadingItems);
      newLoading.delete(postId);
      return { loadingItems: newLoading };
    });

    if (error) {
      // Rollback
      set((state) => {
        const newMap = { ...state.wishlistMap };
        delete newMap[postId];
        return { wishlistMap: newMap };
      });
      return false;
    }

    if (data) {
      // Replace temp with real ID
      set((state) => ({
        wishlistMap: { ...state.wishlistMap, [postId]: data._id },
      }));
      return true;
    }

    return false;
  },

  // ── Remove from wishlist (optimistic) ──
  removeFromWishlist: async (postId: string) => {
    const { wishlistMap, wishlist } = get();
    const wishlistId = wishlistMap[postId];
    if (!wishlistId) return false;

    // Add to loading set
    set((state) => ({
      loadingItems: new Set([...state.loadingItems, postId]),
    }));

    // Save previous state for rollback
    const prevMap = { ...wishlistMap };
    const prevWishlist = [...wishlist];

    // Optimistic: remove immediately
    set((state) => {
      const newMap = { ...state.wishlistMap };
      delete newMap[postId];
      return {
        wishlistMap: newMap,
        wishlist: state.wishlist.filter((item) => item.postId !== postId),
      };
    });

    const { error } = await WishlistService.removeFromWishlist(wishlistId);

    // Remove from loading
    set((state) => {
      const newLoading = new Set(state.loadingItems);
      newLoading.delete(postId);
      return { loadingItems: newLoading };
    });

    if (error) {
      // Rollback
      set({ wishlistMap: prevMap, wishlist: prevWishlist });
      return false;
    }

    return true;
  },

  // ── Toggle (convenience) ──
  toggleWishlist: async (post: FoodPost) => {
    if (get().isSaved(post._id)) {
      await get().removeFromWishlist(post._id);
    } else {
      await get().addToWishlist(post._id);
    }
  },
}));
