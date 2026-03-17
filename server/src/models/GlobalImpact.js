import mongoose from 'mongoose';

// Singleton collection — only one document exists in DB
const globalImpactSchema = new mongoose.Schema(
  {
    totalMeals: { type: Number, default: 0 },
    totalCO2: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    totalDonors: { type: Number, default: 0 },
    totalReceivers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

/**
 * Upsert the singleton global impact document.
 * @param {Object} delta - Fields to increment
 */
globalImpactSchema.statics.increment = async function (delta) {
  return this.findOneAndUpdate(
    {},
    { $inc: delta, $set: { lastUpdated: new Date() } },
    { upsert: true, new: true }
  );
};

const GlobalImpact = mongoose.model('GlobalImpact', globalImpactSchema);
export default GlobalImpact;
