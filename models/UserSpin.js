import mongoose from 'mongoose';

const UserSpinSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    rewardLabel: {
      type: String,
      default: '',
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'none'],
        default: 'none',
      },
      value: {
        type: Number,
        default: 0,
      },
      optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SpinOption',
        default: null,
      },
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    spunAt: {
      type: Date,
      default: Date.now,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserSpin || mongoose.model('UserSpin', UserSpinSchema);
