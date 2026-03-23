import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['donor', 'receiver', 'admin'], default: 'donor' },
    avatar: { type: String },
    address: {
      province: { type: String },
      district: { type: String },
      commune: { type: String },
      detail: { type: String },
    },
    trustScore: {
      score: { type: Number, default: 50, min: 0, max: 100 },
      completionRate: { type: Number, default: 0 },
      noShowCount: { type: Number, default: 0 },
      totalCompleted: { type: Number, default: 0 },
      totalCancelled: { type: Number, default: 0 },
    },
    exp: { type: Number, default: 0, min: 0 }, // EXP points for leveling
    status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    suspendedAt: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
