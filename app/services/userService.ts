import apiClient from './api-client';
import { type FoodPost } from '../features/feed/types/entities';

export interface UserProfile {
  _id: string;
  fullName: string;
  email?: string;
  avatar?: string;
  trustScore: {
    score: number;
    completionRate: number;
    noShowCount: number;
    totalCompleted: number;
    totalCancelled: number;
  };
  exp: number;
  role: string;
  createdAt: string;
}

export interface ProfileResponse {
  user: UserProfile;
  activePosts: FoodPost[];
}

export const userService = {
  getProfile: async (id: string): Promise<ProfileResponse> => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data.data;
  },
};
