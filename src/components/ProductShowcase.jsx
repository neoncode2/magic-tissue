'use client';
import { motion } from 'framer-motion';

const benefits = [
  'মাত্র ৩০ মিনিটে Active Feel পাওয়া যায়।',
  'প্রিমিয়াম Sealed Pack ও Discreet Delivery।',
  'সহজ ব্যবহার, কোনো ঝামেলা নেই।',
  'দ্রুত অর্ডার কনফার্মেশন ও হোম ডেলিভারি।',
  'সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।',
  'সীমিত সময়ের স্পেশাল ক্যাম্পেইন অফার।'
];

export default function ProductShowcase() {
  return (
    <section id="product" className="section-shell bg-[#080808]">
      <div className="section-frame">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="panel-premium rounded-[40px] overflow-hidden border-[#E50914]/20"
        >
          <div className="bg-gradient-to-r from-[#b20710] to-[#E50914] py-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Magic Tissue-এর উপকারিতা</h2>
          </div>
          
          <div className="bg-[#f9f9f9] p-6 md:p-12">
            <div className="space-y-2">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-center gap-6 py-5 border-b border-gray-200 last:border-0">
                  <div className="h-10 w-10 shrink-0 bg-rose-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="#order-form" className="inline-block bg-[#ffeb00] text-black px-12 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform uppercase tracking-tighter border-b-4 border-yellow-600">
                এখনই অর্ডার করুন
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}