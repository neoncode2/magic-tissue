'use client';

import { motion } from 'framer-motion';
import useSiteConfig from '@/hooks/useSiteConfig';

export default function ProductShowcase() {
  const { config } = useSiteConfig();
  const benefits = config.benefits;

  return (
    <section id="product" className="section-shell bg-[#080808]">
      <div className="section-frame">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="panel-premium overflow-hidden rounded-[40px] border-[#E50914]/20">
          <div className="bg-gradient-to-r from-[#b20710] to-[#E50914] py-8 text-center">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{benefits.title}</h2>
          </div>

          <div className="bg-[#f9f9f9] p-6 md:p-12">
            <div className="space-y-2">
              {benefits.items.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-6 border-b border-gray-200 py-5 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 shadow-lg">
                    <span className="font-bold text-white">✓</span>
                  </div>
                  <span className="text-xl font-bold leading-tight text-gray-900 md:text-3xl">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="#order-form" className="inline-block rounded-2xl border-b-4 border-yellow-600 bg-[#ffeb00] px-12 py-5 text-2xl font-black tracking-tight text-black shadow-xl transition-transform hover:scale-105">
                এখনই অর্ডার করুন
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
