import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate ratings: 1 rater per user per transaction
ratingSchema.index({ transactionId: 1, raterId: 1 }, { unique: true });
ratingSchema.index({ ratedUserId: 1 });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
