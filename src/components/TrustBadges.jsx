'use client';
import { motion } from 'framer-motion';

const badges = [
  { icon: '🔒', title: 'নিরাপদ পেমেন্ট', desc: 'ক্যাশ অন ডেলিভারি এবং সুরক্ষিত অনলাইন পেমেন্ট।' },
  { icon: '🚚', title: 'দ্রুত ডেলিভারি', desc: '২৪-৪৮ ঘণ্টার মধ্যে সারা বাংলাদেশে হোম ডেলিভারি।' },
  { icon: '⭐', title: '১০০% অরিজিনাল', desc: 'সেরা মানের নিশ্চয়তা এবং ভেরিফায়েড রিভিউ।' },
  { icon: '🛡️', title: 'লাইভ সাপোর্ট', desc: 'যেকোনো প্রয়োজনে আমাদের ডেডিকেটেড হেল্পলাইন।' },
];

export default function TrustBadges() {
  return (
    <section className="section-shell">
      <div className="section-frame">
        <div className="text-center mb-16 md:mb-24">
          <span className="eyebrow">Trust Signals</span>
          <h2 className="section-title text-white mt-4">কেন আমাদের ওপর আস্থা রাখবেন?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="panel-premium rounded-[32px] p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600/10 text-3xl">
                {badge.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{badge.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}