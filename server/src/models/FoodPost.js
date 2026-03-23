import mongoose from 'mongoose';

const foodPostSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['cooked', 'raw', 'packaged', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: ['kg', 'portion', 'box', 'item'],
      required: true,
    },
    availableQuantity: { type: Number },
    expirationDate: { type: Date, required: true },
    location: {
      province: { type: String },
      district: { type: String },
      detail: { type: String },
      coordinates: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'hidden', 'expired', 'completed', 'deleted', 'reserved'],
      default: 'active',
    },
    isLocked: { type: Boolean, default: false },
    hiddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hiddenAt: { type: Date },
    expiresAt: { type: Date }, // for TTL index
  },
  { timestamps: true }
);

// Set availableQuantity = quantity on creation
foodPostSchema.pre('save', function (next) {
  if (this.isNew && this.availableQuantity === undefined) {
    this.availableQuantity = this.quantity;
  }
  next();
});

foodPostSchema.index({ 'location.coordinates': '2dsphere' });
foodPostSchema.index({ status: 1 });
foodPostSchema.index({ expirationDate: 1 });
foodPostSchema.index({ donorId: 1 });
foodPostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

const FoodPost = mongoose.model('FoodPost', foodPostSchema);
export default FoodPost;
