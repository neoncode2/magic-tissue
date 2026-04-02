import mongoose from 'mongoose';

const MediaPostSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    platform: String,
    url: String,
  },
  { _id: false }
);

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

const SiteConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'site',
    },
    hero: {
      badge: String,
      title: String,
      highlight: String,
      subtitle: String,
      warningText: String,
      videoEmbedUrl: String,
    },
    benefits: {
      title: String,
      items: [String],
    },
    offer: {
      badge: String,
      title: String,
      highlight: String,
      countdownMinutes: Number,
      originalPrice: Number,
      salePrice: Number,
      ctaText: String,
      stockText: String,
      backgroundImage: String,
      benefitBullets: [String],
    },
    packages: [PackageSchema],
    mediaPosts: [MediaPostSchema],
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
