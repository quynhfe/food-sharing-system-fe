import type { FoodPost } from '../types';

/** API đôi khi trả donorId là string kèm field `donor` đã populate (wishlist, …). */
export function resolveDonorDisplay(post: FoodPost): {
  name: string;
  avatar: string;
} {
  if (typeof post.donorId === 'object' && post.donorId && post.donorId.fullName) {
    return {
      name: post.donorId.fullName,
      avatar: post.donorId.avatar || 'https://i.pravatar.cc/150',
    };
  }
  if (post.donor?.fullName) {
    return {
      name: post.donor.fullName,
      avatar: post.donor.avatar || 'https://i.pravatar.cc/150',
    };
  }
  return { name: 'Ẩn danh', avatar: 'https://i.pravatar.cc/150' };
}
