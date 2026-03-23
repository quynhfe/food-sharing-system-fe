import AsyncStorage from '@react-native-async-storage/async-storage';
import { type PostData } from './postService'; // Or FeedPost from entities if generic

const FAVORITES_KEY = '@favorites_posts';

/**
 * Service to manage favorited food posts locally using AsyncStorage.
 * We store the full post object so that offline viewing works seamlessly.
 */
export const favoriteService = {
  /** Gets all favorited posts from local storage */
  getFavoritesLocal: async (): Promise<PostData[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('[favoriteService] Error fetching favorites', e);
      return [];
    }
  },

  /** Toggles a post in local favorites. Returns true if added to favorites, false if removed */
  toggleFavoriteLocal: async (post: PostData): Promise<boolean> => {
    try {
      const favorites = await favoriteService.getFavoritesLocal();
      const existsIndex = favorites.findIndex((p) => p._id === post._id);

      if (existsIndex >= 0) {
        // Remove from list
        favorites.splice(existsIndex, 1);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return false;
      } else {
        // Add to list (at the top)
        favorites.unshift(post);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
      }
    } catch (e) {
      console.error('[favoriteService] Error toggling favorite', e);
      return false; // Assuming failure
    }
  },

  /** Checks if a post ID is in favorites */
  isFavoriteLocal: async (postId: string): Promise<boolean> => {
    try {
      const favorites = await favoriteService.getFavoritesLocal();
      return favorites.some((p) => p._id === postId);
    } catch {
      return false;
    }
  },
};
