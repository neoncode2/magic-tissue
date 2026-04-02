'use client';
import { motion } from 'framer-motion';

const features = [
  { title: 'দ্রুত কার্যকর', desc: 'ব্যবহারের অল্প সময়ের মধ্যেই আপনি পরিবর্তন অনুভব করবেন।', icon: '⚡' },
  { title: '১০০% নিরাপদ', desc: 'প্রাকৃতিক উপাদানে তৈরি, তাই কোনো পার্শ্বপ্রতিক্রিয়ার ভয় নেই।', icon: '🌿' },
  { title: 'দীর্ঘস্থায়ী আত্মবিশ্বাস', desc: 'আপনার পার্টনারকে খুশি করতে এটি আপনাকে দেবে এক্সট্রা কনফিডেন্স।', icon: '🎯' },
  { title: 'ডিসক্রিট প্যাকেজিং', desc: 'প্যাকেটের ওপর কোনো নাম থাকবে না, আপনার গোপনীয়তা আমাদের দায়িত্ব।', icon: '📦' },
  { title: 'সহজ ব্যবহার', desc: 'যেকোনো স্থানে যেকোনো সময় সহজেই ব্যবহার উপযোগী।', icon: '👌' },
  { title: 'মানি-ব্যাক গ্যারান্টি', desc: 'কাজে সন্তুষ্ট না হলে ১০০% টাকা ফেরতের নিশ্চয়তা।', icon: '💰' },
];

export default function Features() {
  return (
    <section id="features" className="section-shell bg-[#080808]">
      <div className="section-frame">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Product Benefits</span>
          <h2 className="section-title text-white mt-4">কেন ম্যাজিক টিস্যু সেরা?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="panel-premium p-8 rounded-[32px] text-center border-white/5 hover:border-rose-600/30"
            >
              <div className="text-4xl mb-4 bg-rose-600/10 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}