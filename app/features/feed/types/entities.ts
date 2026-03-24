export interface PostDonor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface FoodPost {
  _id: string;
  donorId: PostDonor | string;
  /** Khi donorId là id string, API (wishlist, …) có thể gửi kèm object donor đã populate */
  donor?: Partial<PostDonor> & { _id?: string; trustScore?: unknown };
  title: string;
  description: string;
  category: 'cooked' | 'raw' | 'packaged' | 'other';
  quantity: number;
  availableQuantity: number;
  unit: 'kg' | 'portion' | 'box' | 'item';
  expirationDate: string;
  location: {
    province: string;
    district: string;
    detail: string;
    coordinates?: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  images: string[];
  status: 'active' | 'hidden' | 'expired' | 'completed' | 'deleted';
  createdAt: string;
  updatedAt: string;
  calculatedDistance?: number; // Only present when filter=nearby
  pendingRequestsCount?: number; // Count of pending requests for the donor
  /** Gắn từ GET /posts/me — thống kê yêu cầu theo bài (chủ bài) */
  requestSummary?: {
    pendingCount: number;
    acceptedCount: number;
    completedCount: number;
  };
}
