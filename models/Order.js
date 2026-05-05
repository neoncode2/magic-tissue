import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    productLabel: {
      type: String,
      default: 'Magic Tissue',
    },
    packageLabel: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'bKash', 'Nagad'],
      default: 'COD',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    userId: {
      type: String,
      default: '',
      index: true,
    },
    packageId: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number,
      default: 0,
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
      amount: {
        type: Number,
        default: 0,
      },
      label: {
        type: String,
        default: '',
      },
      spinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSpin',
        default: null,
      },
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
