'use client';

import { motion } from 'framer-motion';
import useSiteConfig from '@/hooks/useSiteConfig';

export default function Hero() {
  const { config } = useSiteConfig();
  const hero = config.hero;

  return (
    <section id="hero" className="section-shell relative overflow-hidden bg-[#080808] pt-16 md:pt-15">
      {/* Animated Background Image - Optimized for Visibility */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }} // ছবির ভিজিবিলিটি ৩৫% রাখা হয়েছে
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/bg-image/Hero.jpg" 
          alt="Hero Background" 
          className="h-full w-full object-cover blur-[2px]" // হালকা ব্লার টেক্সটকে স্পষ্ট করবে
        />
        {/* ছবির ওপরে ডার্ক ওভারলে এবং গ্রাডিয়েন্ট */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/60 to-[#080808]" />
      </motion.div>

      <div className="section-frame relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 flex justify-center"
        >
          <span className="rounded-full border border-rose-600/20 bg-rose-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-500">
            {hero.badge}
          </span>
        </motion.div>

        <div className="mx-auto mb-8 max-w-4xl text-center md:mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-2xl" // শ্যাডো যোগ করা হয়েছে
          >
            {hero.title}
            <span className="mt-4 block bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              {hero.highlight}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4, duration: 1 }}
            className="mx-auto mt-6 max-w-2xl text-base font-medium text-gray-200 md:text-lg bg-black/20 backdrop-blur-sm rounded-lg p-2" // সাবটাইটেলের পেছনে হালকা ব্লার
          >
            {hero.subtitle}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6, type: 'spring' }}
          className="mx-auto max-w-5xl"
        >
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-2xl md:p-4">
             <div className="relative aspect-video overflow-hidden rounded-2xl border border-rose-600/20 bg-black">
                {hero.videoEmbedUrl ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={hero.videoEmbedUrl}
                    title="Product Showcase Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0b0f] to-[#080808]">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="mb-4 text-7xl text-rose-600"
                    >▶</motion.span>
                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">Video Preview Coming Soon</p>
                  </div>
                )}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}