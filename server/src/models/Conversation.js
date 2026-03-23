import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      unique: true,
    },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    lastMessage: {
      content: { type: String },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sentAt: { type: Date },
    },
  },
  { timestamps: true }
);

conversationSchema.index({ donorId: 1 });
conversationSchema.index({ receiverId: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
