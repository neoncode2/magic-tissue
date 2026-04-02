'use client';

import { motion } from 'framer-motion';
import useSiteConfig from '@/hooks/useSiteConfig';

export default function Hero() {
  const { config } = useSiteConfig();
  const hero = config.hero;

  return (
    <section id="hero" className="section-shell overflow-hidden bg-[#080808] pt-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.15),transparent_50%)]" />

      <div className="section-frame relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-center">
          <span className="rounded-full border border-rose-600/20 bg-rose-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-500 md:text-sm">
            {hero.badge}
          </span>
        </motion.div>

        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            {hero.title}
            <span className="mt-4 block bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              {hero.highlight}
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
            {hero.subtitle}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-b from-white/10 to-transparent p-2 shadow-2xl md:p-4">
            <div className="mb-4 rounded-2xl bg-[#FFE5B4] px-6 py-3 text-center text-sm font-bold text-[#7C0B12] shadow-inner md:text-base">
              {hero.warningText}
            </div>

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
                  <span className="mb-4 text-7xl">▶</span>
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
