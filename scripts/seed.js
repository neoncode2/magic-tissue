import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import FAQ from '@/models/FAQ';

async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await Product.deleteMany({});
    await Review.deleteMany({});
    await FAQ.deleteMany({});

    // Seed products
    const products = await Product.insertMany([
      {
        name: 'Magic Tissue Premium',
        description: 'প্রিমিয়াম স্কিন কেয়ার পণ্য যা তাৎক্ষণিক আত্মবিশ্বাস বাড়ায়',
        price: 499,
        discount: 50,
        image: '/images/product.jpg',
        features: [
          '১০০% প্রাকৃতিক উপাদান',
          'চর্মরোগ বিশেষজ্ঞ দ্বারা অনুমোদিত',
          'মাত্র ৩০ মিনিটে কাজ করে',
          'সব ধরনের ত্বকের জন্য উপযুক্ত',
        ],
        inStock: true,
      },
    ]);

    // Seed reviews
    const reviews = await Review.insertMany([
      {
        name: 'সারা আহমেদ',
        rating: 5,
        comment: 'অসাধারণ পণ্য! সত্যিই কাজ করে। এখন আমি সবসময় আত্মবিশ্বাসী অনুভব করি।',
        verified: true,
      },
      {
        name: 'ফাতিমা খান',
        rating: 5,
        comment: 'দারুণ গুণমান এবং দুর্দান্ত সেবা। সবাইকে সুপারিশ করছি।',
        verified: true,
      },
      {
        name: 'নাজমা বেগম',
        rating: 5,
        comment: 'মূল্য অসাধারণ। দ্রুত ডেলিভারি এবং ভাল প্যাকেজিং।',
        verified: true,
      },
      {
        name: 'আয়েশা সুলতানা',
        rating: 5,
        comment: 'এটি আমার প্রত্যাশা অতিক্রম করেছে। অবশ্যই আবার কিনবো।',
        verified: true,
      },
    ]);

    // Seed FAQs
    const faqs = await FAQ.insertMany([
      {
        question: 'Magic Tissue কী?',
        answer: 'Magic Tissue একটি প্রিমিয়াম স্কিন কেয়ার পণ্য যা তাৎক্ষণিক আত্মবিশ্বাস বাড়ায় এবং ত্বককে সুরক্ষা প্রদান করে। ১০০% প্রাকৃতিক উপাদান দিয়ে তৈরি।',
        order: 1,
        active: true,
      },
      {
        question: 'কত দ্রুত ফল পাবো?',
        answer: 'আমাদের ফর্মুলা অত্যন্ত কার্যকর এবং মাত্র ৩০ মিনিটের মধ্যে দৃশ্যমান ফল দেখা যায়। ধারাবাহিক ব্যবহারে আরও ভাল ফলাফল পাওয়া যায়।',
        order: 2,
        active: true,
      },
      {
        question: 'কি ধরনের ত্বকের জন্য উপযুক্ত?',
        answer: 'Magic Tissue সব ধরনের ত্বকের জন্য নিরাপদ এবং উপযুক্ত। চর্মরোগ বিশেষজ্ঞ দ্বারা পরীক্ষিত এবং অনুমোদিত।',
        order: 3,
        active: true,
      },
      {
        question: 'ডেলিভারি কত দ্রুত?',
        answer: 'আমরা সারাদেশে ২৪-৪৮ ঘন্টায় বিনামূল্যে ডেলিভারি প্রদান করি। Order confirmation পাওয়ার পর ট্র্যাকিং নম্বর দেওয়া হয়।',
        order: 4,
        active: true,
      },
      {
        question: 'রিটার্ন এবং এক্সচেঞ্জ সম্ভব?',
        answer: 'হ্যাঁ, পণ্য ডেলিভারি থেকে ৭ দিনের মধ্যে কোন প্রশ্ন ছাড়াই রিটার্ন/এক্সচেঞ্জ সম্ভব।',
        order: 5,
        active: true,
      },
      {
        question: 'পেমেন্ট পদ্ধতি কী কী?',
        answer: 'আমরা COD (নগদ প্রদান), bKash, এবং Nagad সহ একাধিক পেমেন্ট পদ্ধতি গ্রহণ করি।',
        order: 6,
        active: true,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`📦 Products: ${products.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`❓ FAQs: ${faqs.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
