import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    productLabel: { type: String, default: 'Magic Tissue' },
    packageLabel: { type: String, default: '' },
    packageId: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    basePrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'bKash', 'Nagad'], default: 'COD' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    userId: { type: String, default: '', index: true },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'none'],
        default: 'none',
      },
      value: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      label: { type: String, default: '' },
      spinId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSpin', default: null },
    },
    notes: String,
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', schema);
