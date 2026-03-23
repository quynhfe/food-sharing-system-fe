import mongoose from 'mongoose';

const impactRecordSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      unique: true,
    },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
    mealsShared: { type: Number }, // computed field
    co2Reduced: { type: Number },  // computed field (kg)
    calculatedAt: { type: Date },
  },
  { timestamps: true }
);

impactRecordSchema.index({ donorId: 1 });
impactRecordSchema.index({ receiverId: 1 });

const ImpactRecord = mongoose.model('ImpactRecord', impactRecordSchema);
export default ImpactRecord;
