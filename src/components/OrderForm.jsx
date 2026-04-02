'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const packages = [
  { id: 1, label: '১ পিস (ট্রায়াল প্যাক)', price: 249, shipping: 'ফ্রি ডেলিভারি' },
  { id: 2, label: '২ পিস (বেস্ট ভ্যালু)', price: 449, shipping: 'অতিরিক্ত ছাড় + ফ্রি ডেলিভারি' }
];

export default function OrderForm() {
  const [selected, setSelected] = useState(packages[0]);
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    // API Call logic here
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <section id="order-form" className="section-shell bg-[#0a0a0a]">
      <div className="section-frame max-w-6xl">
        <div className="text-center mb-12">
          <span className="eyebrow">Order Now</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">অর্ডার কনফার্ম করুন</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Package Selection */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">১. প্যাকেজ নির্বাচন করুন</h3>
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${
                  selected.id === pkg.id ? 'border-rose-600 bg-rose-600/5' : 'border-white/10 bg-[#111]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-white">{pkg.label}</p>
                    <p className="text-rose-400 text-sm">{pkg.shipping}</p>
                  </div>
                  <p className="text-3xl font-black text-white">৳{pkg.price}</p>
                </div>
              </button>
            ))}
            <div className="p-6 bg-rose-600/10 border border-rose-600/20 rounded-3xl text-center">
              <p className="text-rose-200 text-sm">সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা আছে। অর্ডার করতে কোনো অগ্রিম টাকা দিতে হবে না।</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="panel-premium p-8 md:p-10 rounded-[40px] border-rose-600/20 shadow-[0_0_50px_rgba(229,9,20,0.15)]">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">২. ডেলিভারি তথ্য দিন</h3>
            <div className="space-y-5">
              <input type="text" placeholder="আপনার নাম *" required className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-rose-600 outline-none text-white text-center" />
              <input type="tel" placeholder="মোবাইল নাম্বার *" required className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-rose-600 outline-none text-white text-center" />
              <input type="text" placeholder="আপনার শহর *" required className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-rose-600 outline-none text-white text-center" />
              <textarea placeholder="সম্পূর্ণ ঠিকানা (বাসা নং, রোড নং, এলাকা) *" required rows="3" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-rose-600 outline-none text-white text-center resize-none"></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="cta-primary w-full py-5 rounded-2xl text-xl font-black mt-8 uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {status === 'loading' ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার করুন ৳${selected.price}`}
            </button>
            
            {status === 'success' && (
              <p className="mt-4 text-green-400 font-bold text-center">অভিনন্দন! আপনার অর্ডারটি সফল হয়েছে।</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}