import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedQty: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelReason: { type: String, trim: true },
  },
  { timestamps: true }
);

requestSchema.index({ postId: 1 });
requestSchema.index({ donorId: 1 });
requestSchema.index({ receiverId: 1 });
requestSchema.index({ status: 1 });

const Request = mongoose.model('Request', requestSchema);
export default Request;
