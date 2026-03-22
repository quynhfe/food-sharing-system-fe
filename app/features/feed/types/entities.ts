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
}
