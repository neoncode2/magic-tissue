'use client';

import { motion } from 'framer-motion';

const trustItems = [
  'Cash on Delivery সারা বাংলাদেশে',
  'প্যাকেটের উপর কোনো নাম থাকবে না',
  '২৪-৪৮ ঘণ্টার মধ্যে দ্রুত ডেলিভারি',
  'গোপনীয়তা বজায় রাখার নিশ্চয়তা',
];

export default function Footer() {
  return (
    <footer className="section-shell relative overflow-hidden border-t border-white/5 bg-[#080808] py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.15),transparent_40%)]" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-rose-600/10 blur-[100px]" />

      <div className="section-frame relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto mb-20 max-w-5xl overflow-hidden rounded-[40px] border border-rose-600/20 bg-gradient-to-b from-[#1a1a1a]/90 to-[#0a0a0a]/90 p-8 text-center shadow-2xl backdrop-blur-md md:p-12"
        >
          <img
            src="/bg-image/benefit (2).jpg"
            alt="footer background"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-10"
          />

          <div className="relative z-10">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="mb-6 inline-flex rounded-full border border-rose-600/20 bg-rose-600/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-rose-500"
            >
              Limited Time Offer
            </motion.div>

            <h2 className="mb-6 text-4xl font-black leading-none text-white md:text-6xl">
              অর্ডার কনফার্ম করুন আজই!
              <motion.span
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mt-4 block text-2xl font-bold italic text-rose-600 md:text-3xl"
              >
                লিমিটেড স্টক শেষ হওয়ার আগেই সংগ্রহ করুন
              </motion.span>
            </h2>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
              {trustItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <span className="text-xl font-bold text-rose-600">✓</span>
                  <p className="text-sm font-semibold text-gray-300">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center">
              <motion.a
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                href="tel:+8801700000000"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-center text-lg font-bold text-white transition-all sm:w-auto"
              >
                কল করুন
              </motion.a>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 border-t border-white/5 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600">© 2026 Magic Tissue Bangladesh. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
