import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FoodPost } from '@/features/feed/types';
import { SearchService, type SearchParams } from '../services/search.service';

interface SearchState {
  // Search input
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;

  // Search history (persisted)
  searchHistory: string[];
  addHistoryItem: (term: string) => void;
  clearHistory: () => void;

  // Category filter
  selectedCategory: string | null; // null = all
  setCategory: (category: string | null) => void;

  // Search results
  searchResults: FoodPost[];
  loadingResults: boolean;
  resultsError: string | null;
  currentPage: number;
  totalPages: number;
  isLoadingMore: boolean;

  // Actions
  searchPosts: (isNewSearch?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

const buildSearchParams = (
  query: string,
  page: number,
  category: string | null
): SearchParams => ({
  search: query || undefined,
  category: category as SearchParams['category'] || undefined,
  page,
  limit: 10,
});

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // ── State ──
      searchQuery: '',
      searchHistory: [],
      selectedCategory: null,
      searchResults: [],
      loadingResults: false,
      resultsError: null,
      currentPage: 0,
      totalPages: 0,
      isLoadingMore: false,

      // ── Setters ──
      setSearchQuery: (query) => set({ searchQuery: query, resultsError: null }),

      clearSearchQuery: () =>
        set({
          searchQuery: '',
          searchResults: [],
          loadingResults: false,
          resultsError: null,
          currentPage: 0,
          totalPages: 0,
        }),

      setCategory: (category) => set({ selectedCategory: category }),

      addHistoryItem: (term) =>
        set((state) => {
          const trimmed = term.trim();
          if (!trimmed) return state;
          const newHistory = [
            trimmed,
            ...state.searchHistory.filter(
              (item) => item.toLowerCase() !== trimmed.toLowerCase()
            ),
          ].slice(0, 10);
          return { searchHistory: newHistory };
        }),

      clearHistory: () => set({ searchHistory: [] }),

      clearResults: () =>
        set({
          searchResults: [],
          currentPage: 0,
          totalPages: 0,
          resultsError: null,
        }),

      // ── Search ──
      searchPosts: async (isNewSearch = true) => {
        const { searchQuery, selectedCategory, currentPage, searchResults } =
          get();
        const trimmedQuery = searchQuery.trim();
        const hasCategory = !!selectedCategory;

        // Need at least a query or a category
        if (!trimmedQuery && !hasCategory) {
          set({
            searchResults: [],
            loadingResults: false,
            currentPage: 0,
            totalPages: 0,
          });
          return;
        }

        const page = isNewSearch ? 1 : currentPage + 1;

        if (isNewSearch) {
          set({ loadingResults: true, resultsError: null, searchResults: [] });
        } else {
          set({ isLoadingMore: true, resultsError: null });
        }

        const params = buildSearchParams(trimmedQuery, page, selectedCategory);
        const { data, error } = await SearchService.searchPosts(params);

        if (error) {
          set({
            searchResults: isNewSearch ? [] : searchResults,
            resultsError: error,
            loadingResults: false,
            isLoadingMore: false,
            currentPage: isNewSearch ? 0 : currentPage,
            totalPages: isNewSearch ? 0 : get().totalPages,
          });
          return;
        }

        if (!data) {
          set({ loadingResults: false, isLoadingMore: false });
          return;
        }

        set({
          searchResults: isNewSearch
            ? data.posts
            : [...searchResults, ...data.posts],
          resultsError: null,
          loadingResults: false,
          isLoadingMore: false,
          currentPage: page,
          totalPages: data.pagination.totalPages,
        });
      },

      loadMore: async () => {
        const { currentPage, totalPages, loadingResults, isLoadingMore } =
          get();
        if (loadingResults || isLoadingMore || currentPage >= totalPages) return;
        await get().searchPosts(false);
      },
    }),
    {
      name: 'food-search-history',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist search history
      partialize: (state) => ({ searchHistory: state.searchHistory }),
    }
  )
);
