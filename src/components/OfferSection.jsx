'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function OfferSection() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 29, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 29, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] py-24 md:py-32">
      <div className="absolute inset-0 z-0">
        <Image
          src="/Tissue-Magic-2.jpg"
          alt="Product Background"
          fill
          className="object-cover opacity-50 md:opacity-65 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-rose-950/45 to-[#050505]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.10),transparent_72%)]" />
      </div>

      <div className="section-frame relative z-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 shadow-2xl backdrop-blur-xl">
              <span className="flex h-3 w-3">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-600" />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 md:text-sm">
                Exclusive Flash Sale
              </span>
            </div>

            <h2 className="mb-6 text-6xl font-black leading-[0.9] tracking-tighter text-white uppercase md:text-9xl">
              মেগা অফার <br />
              <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                ৫০% ডিসকাউন্ট
              </span>
            </h2>
          </motion.div>

          <div className="grid items-center gap-8 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8 lg:col-span-7"
            >
              <div className="panel-premium rounded-[40px] border-white/5 bg-white/5 p-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:p-12">
                <p className="mb-4 font-bold uppercase tracking-widest text-rose-500">Time Remaining</p>

                <div className="mb-10 flex gap-4 md:gap-8">
                  {[
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Sec', value: timeLeft.seconds },
                  ].map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-6xl font-black tracking-tighter text-white md:text-8xl">
                        {String(v.value).padStart(2, '0')}
                      </div>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-600 md:text-xs">
                        {v.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-8 h-px w-full bg-white/10" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-xl text-rose-500">✓</div>
                    <p className="font-bold text-white">৩০ মিনিট গ্যারান্টি</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-xl text-rose-500">✓</div>
                    <p className="font-bold text-white">ফ্রি হোম ডেলিভারি</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-5"
            >
              <div className="group relative rounded-[45px] bg-gradient-to-b from-rose-600 to-transparent p-1">
                <div className="rounded-[44px] bg-[#0a0a0a] p-10 text-center md:p-14">
                  <p className="mb-2 text-2xl font-bold text-gray-500 line-through">৳ ৪৯৯</p>
                  <h3 className="mb-8 text-7xl font-black tracking-tighter text-white md:text-8xl">৳ ২৪৯</h3>

                  <div className="space-y-4">
                    <a
                      href="#order-form"
                      className="block w-full rounded-3xl bg-rose-600 py-6 text-2xl font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(229,9,20,0.4)] transition-all active:scale-95 hover:bg-white hover:text-black"
                    >
                      অর্ডার করুন
                    </a>
                    <p className="pt-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                      স্টক সীমিত, দেরি করবেন না
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute top-1/2 -right-20 hidden -translate-y-1/2 opacity-70 xl:block"
          >
            <div className="relative h-96 w-96">
              <Image
                src="/Tissue-Magic-2.jpg"
                alt="Tissue Pack"
                fill
                className="object-contain rotate-12 drop-shadow-[0_0_50px_rgba(229,9,20,0.5)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
