export const siteDefaults = {
  hero: {
    badge: 'Special Premium Offer',
    title: 'মাত্র ৭ দিন নিয়মিত ব্যবহার করুন',
    highlight: '১০০% টাকা ফেরত গ্যারান্টি',
    subtitle:
      'বিশ্বস্ত সাপোর্ট, দ্রুত ডেলিভারি এবং প্রিমিয়াম প্রেজেন্টেশনের মাধ্যমে আপনার সেরা অভিজ্ঞতা নিশ্চিত করতে আমরা প্রস্তুত।',
    warningText: 'প্রতারকদের থেকে সাবধান থাকুন। বিশ্বস্ত প্রতিষ্ঠানের কাছ থেকেই অর্ডার করুন।',
    videoEmbedUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_EMBED_URL || '',
  },
  benefits: {
    title: 'Magic Tissue-এর উপকারিতা',
    items: [
      'মাত্র ৩০ মিনিটেই Active Feel পাওয়া যায়।',
      'প্রিমিয়াম Sealed Pack এবং Discreet Delivery।',
      'সহজ ব্যবহার, কোনো ঝামেলা নেই।',
      'দ্রুত অর্ডার কনফার্মেশন এবং হোম ডেলিভারি।',
      'সারাদেশে Cash on Delivery সুবিধা।',
      'সীমিত সময়ের স্পেশাল ক্যাম্পেইন অফার।',
    ],
  },
  offer: {
    badge: 'Exclusive Flash Sale',
    title: 'মেগা অফার',
    highlight: '৫০% ডিসকাউন্ট',
    countdownMinutes: 29,
    originalPrice: 499,
    salePrice: 249,
    ctaText: 'অর্ডার করুন',
    stockText: 'স্টক সীমিত, দেরি করবেন না',
    backgroundImage: '/Tissue-Magic-2.jpg',
    benefitBullets: ['৩০ মিনিট গ্যারান্টি', 'ফ্রি হোম ডেলিভারি'],
  },
  packages: [
    {
      id: 'single-pack',
      label: 'Magic Tissue - ১ পিস',
      price: 249,
      shipping: 'ফ্রি ডেলিভারি',
      badge: 'ট্রায়াল প্যাক',
    },
    {
      id: 'double-pack',
      label: 'Magic Tissue - ২ পিস',
      price: 449,
      shipping: 'অতিরিক্ত ছাড় + ফ্রি ডেলিভারি',
      badge: 'বেস্ট ভ্যালু',
    },
  ],
  mediaPosts: [
    {
      id: 'hero-video',
      title: 'Hero Video',
      platform: 'YouTube',
      url: process.env.NEXT_PUBLIC_HERO_VIDEO_EMBED_URL || '',
    },
  ],
};

export function mergeSiteConfig(input = {}) {
  return {
    ...siteDefaults,
    ...input,
    hero: {
      ...siteDefaults.hero,
      ...(input.hero || {}),
    },
    benefits: {
      ...siteDefaults.benefits,
      ...(input.benefits || {}),
      items:
        Array.isArray(input.benefits?.items) && input.benefits.items.length > 0
          ? input.benefits.items
          : siteDefaults.benefits.items,
    },
    offer: {
      ...siteDefaults.offer,
      ...(input.offer || {}),
      benefitBullets:
        Array.isArray(input.offer?.benefitBullets) && input.offer.benefitBullets.length > 0
          ? input.offer.benefitBullets
          : siteDefaults.offer.benefitBullets,
    },
    packages:
      Array.isArray(input.packages) && input.packages.length > 0
        ? input.packages
        : siteDefaults.packages,
    mediaPosts:
      Array.isArray(input.mediaPosts) && input.mediaPosts.length > 0
        ? input.mediaPosts
        : siteDefaults.mediaPosts,
  };
}
