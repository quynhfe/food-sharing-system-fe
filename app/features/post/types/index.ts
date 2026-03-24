import type { PostDonor } from '../../feed/types';

export interface CreatePostDTO {
  title: string;
  description?: string;
  category: 'cooked' | 'raw' | 'packaged' | 'other';
  quantity: number;
  unit: 'kg' | 'portion' | 'box' | 'item';
  expirationDate: string; // ISO String
  locationText: string;
  latitude: number;
  longitude: number;
  images: string[]; // local URIs to upload
}
