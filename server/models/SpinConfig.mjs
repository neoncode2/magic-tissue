import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    popupEnabled: { type: Boolean, default: true },
    minDelaySeconds: { type: Number, default: 5 },
    maxDelaySeconds: { type: Number, default: 20 },
    showProbability: { type: Number, default: 0.5 },
    exitIntentEnabled: { type: Boolean, default: true },
    sideImageUrl: { type: String, default: '' },
    popupTitle: { type: String, default: 'Spin the wheel for a surprise discount' },
    popupSubtitle: { type: String, default: 'Try your luck once and unlock a verified reward for checkout.' },
    popupButtonText: { type: String, default: 'Spin Now' },
    forceResultOptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SpinOption', default: null },
  },
  { timestamps: true }
);

export const SpinConfig = mongoose.models.SpinConfig || mongoose.model('SpinConfig', schema);
