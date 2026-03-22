import { create } from 'zustand';
import type { FeedFilterType } from '../types';

interface FeedState {
  activeFilter: FeedFilterType;
  searchText: string;
  latitude?: number;
  longitude?: number;

  setActiveFilter: (filter: FeedFilterType) => void;
  setSearchText: (text: string) => void;
  setLocation: (lat: number, lng: number) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedState>()((set) => ({
  activeFilter: 'newest',
  searchText: '',
  latitude: undefined,
  longitude: undefined,

  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchText: (text) => set({ searchText: text }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  reset: () => set({ activeFilter: 'newest', searchText: '' }),
}));

// Quick selectors
export const useActiveFilter = () => useFeedStore((state) => state.activeFilter);
export const useSearchText = () => useFeedStore((state) => state.searchText);
export const useFeedLocation = () => useFeedStore((state) => ({ 
  latitude: state.latitude, 
  longitude: state.longitude 
}));
export const useFeedActions = () => useFeedStore((state) => ({
  setActiveFilter: state.setActiveFilter,
  setSearchText: state.setSearchText,
  setLocation: state.setLocation,
  reset: state.reset,
}));
