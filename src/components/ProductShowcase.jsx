'use client';

import { motion } from 'framer-motion';
import useSiteConfig from '@/hooks/useSiteConfig';

export default function ProductShowcase() {
  const { config } = useSiteConfig();
  const benefits = config.benefits;

  return (
    <section id="product" className="section-shell relative overflow-hidden bg-[#080808]">
      <div className="section-frame relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative panel-premium overflow-hidden rounded-[40px] border-[#E50914]/20 shadow-[0_0_60px_rgba(229,9,20,0.15)]"
        >
          {/* --- ছবির ব্যাকগ্রাউন্ড সেটআপ --- */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px]">
            <img 
              src="/bg-image/benefit (2).jpg" // আপনার ছবির নাম
              alt="Benefit Background" 
              className="h-full w-full object-cover scale-110"
            />
            {/* ছবির ওপরে ডার্ক ওভারলে যাতে লেখা পড়া যায় */}
            <div className="absolute inset-0 bg-black/70" /> 
          </div>

          <div className="relative z-10">
            {/* Header with Animation */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#b20710]/90 to-[#E50914]/90 py-4 md:py-6 text-center border-b border-rose-600/10"
            >
              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{benefits.title}</h2>
            </motion.div>

            {/* Benefits Content Area - প্যাডিং একটু বাড়ানো হয়েছে */}
            <div className="p-6 md:p-12 lg:p-16">
              <div className="space-y-4">
                {benefits.items.map((item, index) => (
                  <motion.div 
                    key={`${item}-${index}`} 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-5 border-b border-white/5 py-5 last:border-0"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-600 shadow-xl"
                    >
                      <span className="text-xl font-bold text-white">✓</span>
                    </motion.div>
                    {/* লেখাগুলো সাদা করা হয়েছে ছবির ওপরে ফুটিয়ে তোলার জন্য */}
                    <span className="text-2xl font-bold leading-tight text-white md:text-4xl">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Order Button with Glow Animation */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <motion.a 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#order-form" 
                  className="cta-primary rounded-2xl px-14 py-6 text-2xl font-black tracking-tight text-white"
                >
                  এখনই অর্ডার করুন
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
