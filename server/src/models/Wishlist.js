import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost', required: true },
  },
  { timestamps: true }
);

// Each user can only wishlist a post once
wishlistSchema.index({ userId: 1, postId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1, createdAt: -1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
