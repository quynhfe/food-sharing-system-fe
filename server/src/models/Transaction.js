import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
      unique: true,
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'no_show'],
      default: 'active',
    },
    donorConfirmed: { type: Boolean, default: false },
    receiverConfirmed: { type: Boolean, default: false },
    donorConfirmedAt: { type: Date },
    receiverConfirmedAt: { type: Date },
    completedAt: { type: Date },
    noShowReportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    noShowAt: { type: Date },
  },
  { timestamps: true }
);

transactionSchema.index({ donorId: 1 });
transactionSchema.index({ receiverId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
