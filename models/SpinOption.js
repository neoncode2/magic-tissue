import mongoose from 'mongoose';

const SpinOptionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'none'],
      required: true,
      default: 'none',
    },
    value: {
      type: Number,
      default: 0,
      min: 0,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SpinOption || mongoose.model('SpinOption', SpinOptionSchema);
