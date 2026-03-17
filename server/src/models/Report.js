import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost' }, // optional
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    decision: { type: String, trim: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

reportSchema.index({ reporterId: 1 });
reportSchema.index({ targetUserId: 1 });
reportSchema.index({ targetPostId: 1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
