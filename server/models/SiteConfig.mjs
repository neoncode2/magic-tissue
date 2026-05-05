import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    price: Number,
    shipping: String,
    badge: String,
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    packages: [PackageSchema],
  },
  { timestamps: true }
);

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', schema);
