'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'দ্রুত কার্যকর',
    desc: 'ব্যবহারের অল্প সময়ের মধ্যেই আপনি পরিবর্তন অনুভব করবেন।',
    icon: '⚡',
  },
  {
    title: '১০০% নিরাপদ',
    desc: 'প্রাকৃতিক উপাদানে তৈরি, তাই কোনো পার্শ্বপ্রতিক্রিয়ার ভয় নেই।',
    icon: '🌿',
  },
  {
    title: 'দীর্ঘস্থায়ী আত্মবিশ্বাস',
    desc: 'এটি আপনাকে অতিরিক্ত কনফিডেন্স দিতে সাহায্য করবে।',
    icon: '🎯',
  },
  {
    title: 'ডিসক্রিট প্যাকেজিং',
    desc: 'প্যাকেটের উপর কোনো নাম থাকবে না, আপনার গোপনীয়তা আমাদের দায়িত্ব।',
    icon: '📦',
  },
  {
    title: 'সহজ ব্যবহার',
    desc: 'যেকোনো স্থানে যেকোনো সময় সহজেই ব্যবহার উপযোগী।',
    icon: '👌',
  },
  {
    title: 'মানি-ব্যাক গ্যারান্টি',
    desc: 'কাজে সন্তুষ্ট না হলে ১০০% টাকা ফেরতের নিশ্চয়তা।',
    icon: '💰',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative section-shell overflow-hidden bg-[#080808]">
      <img
        src="/bg-image/texture.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.03]"
      />

      <div className="section-frame relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8 text-center md:mb-10">
          <span className="eyebrow">Product Benefits</span>
          <h2 className="mt-4 text-white section-title">কেন ম্যাজিক টিস্যু সেরা?</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(225, 29, 72, 0.5)' }}
              className="panel-premium cursor-default rounded-[32px] border-white/5 bg-black/40 p-6 text-center backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600/10 text-4xl"
              >
                {feature.icon}
              </motion.div>
              <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
