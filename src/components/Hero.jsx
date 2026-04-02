'use client';

import { motion } from 'framer-motion';

const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_EMBED_URL;

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#080808] pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.15),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Branding/Offer Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <span className="bg-rose-600/10 border border-rose-600/20 text-rose-500 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest">
            Special Premium Offer
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
          >
            মাত্র ৭ দিন নিয়মিত ব্যবহার করুন
            <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">
              ১০০% টাকা ফেরত গ্যারান্টি
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            বিশ্বস্ত সাপোর্ট ও দ্রুত ডেলিভারির মাধ্যমে আপনার সেরা অভিজ্ঞতা নিশ্চিত করতে আমরা বদ্ধপরিকর।
          </motion.p>
        </div>

        {/* Video Card Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-5xl group"
        >
          <div className="relative p-2 md:p-4 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/5 shadow-2xl overflow-hidden">
            
            {/* Warning Label Inside Card */}
            <div className="mb-4 bg-[#FFE5B4] text-[#7C0B12] py-3 px-6 rounded-2xl text-center font-bold text-sm md:text-base shadow-inner">
               ⚠️ প্রতারণা থেকে সাবধান থাকুন, বিশ্বস্ত প্রতিষ্ঠান থেকে পণ্য নিন।
            </div>

            {/* Video Wrapper */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-rose-600/20 group-hover:border-rose-600/40 transition-colors">
              {heroVideoUrl ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={heroVideoUrl}
                  title="Product Showcase Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0b0f] to-[#080808]">
                  <span className="text-8xl mb-4">✨</span>
                  <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Video Preview Coming Soon</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}