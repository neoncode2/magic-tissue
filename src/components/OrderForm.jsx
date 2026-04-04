'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import useSiteConfig from '@/hooks/useSiteConfig';

export default function OrderForm() {
  const { config } = useSiteConfig();
  const initialPackage = config.packages[0];
  const [selected, setSelected] = useState(initialPackage);
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    setSelected(config.packages[0]);
  }, [config.packages]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productLabel: 'Magic Tissue',
          packageLabel: selected.label,
          quantity: 1,
          totalPrice: selected.price,
          paymentMethod: 'COD',
          status: 'pending',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }

      setStatus('success');
      setFormData({ name: '', phone: '', city: '', address: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="order-form" className="relative section-shell overflow-hidden bg-[#0a0a0a] py-20">
      
      {/* --- ব্যাকগ্রাউন্ড ইমেজ (Visual Background) --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg-image/Order Form.jpg" 
          alt="Background" 
          className="h-full w-full object-cover opacity-30" // ছবির ভিজিবিলিটি ৩০% রাখা হয়েছে
        />
        {/* টেক্সট ক্লিয়ার রাখার জন্য ডার্ক ওভারলে */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </div>

      <div className="section-frame relative z-10 max-w-6xl">
        <div className="mb-6 md:mb-12 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="eyebrow"
          >
            Order Now
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-4 text-4xl font-black text-white md:text-6xl"
          >
            অর্ডার কনফার্ম করুন
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* ১. প্যাকেজ নির্বাচন করুন */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm">১</span>
              প্যাকেজ নির্বাচন করুন
            </h3>
            {config.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelected(pkg)}
                className={`group w-full rounded-3xl border-2 p-6 text-left transition-all backdrop-blur-sm ${
                  selected.id === pkg.id ? 'border-rose-600 bg-rose-600/20' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-white">{pkg.label}</p>
                    <p className="text-sm text-rose-400">{pkg.shipping}</p>
                  </div>
                  <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">৳{pkg.price}</p>
                </div>
              </button>
            ))}
            
            <div className="rounded-3xl border border-rose-600/20 bg-rose-600/10 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🔒</span>
                <p className="text-sm leading-relaxed text-rose-200">
                  আপনার তথ্য আমাদের কাছে ১০০% নিরাপদ। প্যাকেটের গায়ে পণ্যের নাম লেখা থাকবে না। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।
                </p>
              </div>
            </div>
          </motion.div>

          {/* ২. ডেলিভারি তথ্য দিন */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="panel-premium relative overflow-hidden rounded-[40px] border-rose-600/20 p-8 shadow-2xl md:p-10 backdrop-blur-xl bg-black/60">
              <h3 className="mb-8 text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm">২</span>
                ডেলিভারি তথ্য দিন
              </h3>
              
              <div className="space-y-5">
                <input value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} type="text" placeholder="আপনার নাম *" required className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none focus:border-rose-600 transition-all placeholder:text-white/40" />
                <input value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} type="tel" placeholder="মোবাইল নাম্বার *" required className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none focus:border-rose-600 transition-all placeholder:text-white/40" />
                <input value={formData.city} onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))} type="text" placeholder="আপনার শহর *" required className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none focus:border-rose-600 transition-all placeholder:text-white/40" />
                <textarea value={formData.address} onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))} placeholder="সম্পূর্ণ ঠিকানা *" required rows="3" className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none focus:border-rose-600 transition-all placeholder:text-white/40" />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={status === 'loading'} 
                className="cta-primary mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-black uppercase tracking-widest text-white shadow-lg"
              >
                {status === 'loading' ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার করুন ৳${selected.price}`}
              </motion.button>

              {status === 'success' && <p className="mt-4 text-center font-bold text-green-400">অর্ডার সফল হয়েছে!</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}