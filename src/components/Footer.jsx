'use client';

import { motion } from 'framer-motion';

const trustItems = [
  'Cash on Delivery সারা বাংলাদেশে',
  'প্যাকেটের ওপর কোনো নাম থাকবে না',
  '২৪-৪৮ ঘণ্টার মধ্যে দ্রুত ডেলিভারি',
  'গোপনীয়তা বজায় রাখার নিশ্চয়তা',
];


const cardClass =
  'rounded-[28px] border border-white/5 bg-white/[0.02] backdrop-blur-md px-6 py-8 text-center transition duration-300 hover:-translate-y-2 hover:border-rose-600/30 hover:bg-white/[0.04]';

export default function Footer() {
  return (
    <footer className="section-shell relative overflow-hidden border-t border-white/5 bg-[#080808] py-20">
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.15),transparent_40%)]" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-rose-600/10 blur-[100px]" />

      <div className="section-frame relative z-10">
        {/* Top Urgency Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-5xl rounded-[40px] border border-rose-600/20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 md:p-12 text-center shadow-2xl"
        >
          <div className="inline-flex rounded-full bg-rose-600/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-rose-500 mb-6 border border-rose-600/20">
            Limited Time Offer
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black leading-none text-white mb-6">
            অর্ডার কনফার্ম করুন আজই!
            <span className="mt-4 block text-rose-600 italic text-2xl md:text-3xl font-bold">
              লিমিটেড স্টক শেষ হওয়ার আগেই সংগ্রহ করুন
            </span>
          </h2>
          
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-rose-600 text-xl font-bold">✓</span>
                <p className="text-sm font-semibold text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#order-form" className="cta-primary rounded-2xl px-10 py-5 text-center text-lg font-black w-full sm:w-auto shadow-[0_10px_40px_rgba(225,29,72,0.4)]">
              অর্ডার করুন এখনই
            </a>
            <a href="tel:+8801700000000" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl px-10 py-5 text-center text-lg font-bold w-full sm:w-auto transition-all">
              কল করুন
            </a>
          </div>
        </motion.div>


    
        {/* Bottom Bar */}
        <div className="mt-20 border-t border-white/5 pt-10 text-center">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            © 2026 Magic Tissue Bangladesh. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}