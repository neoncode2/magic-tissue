'use client';

import { useEffect, useState } from 'react';
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
    <section id="order-form" className="section-shell bg-[#0a0a0a]">
      <div className="section-frame max-w-6xl">
        <div className="mb-12 text-center">
          <span className="eyebrow">Order Now</span>
          <h2 className="mt-4 text-4xl font-black text-white md:text-6xl">অর্ডার কনফার্ম করুন</h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-bold text-white">১. প্যাকেজ নির্বাচন করুন</h3>
            {config.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelected(pkg)}
                className={`w-full rounded-3xl border-2 p-6 text-left transition-all ${
                  selected.id === pkg.id ? 'border-rose-600 bg-rose-600/5' : 'border-white/10 bg-[#111]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-white">{pkg.label}</p>
                    <p className="text-sm text-rose-400">{pkg.shipping}</p>
                    {pkg.badge ? <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/60">{pkg.badge}</p> : null}
                  </div>
                  <p className="text-3xl font-black text-white">৳{pkg.price}</p>
                </div>
              </button>
            ))}
            <div className="rounded-3xl border border-rose-600/20 bg-rose-600/10 p-6 text-center">
              <p className="text-sm text-rose-200">সারা বাংলাদেশে Cash on Delivery সুবিধা আছে। অর্ডার করতে কোনো অগ্রিম টাকা দিতে হবে না।</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="panel-premium rounded-[40px] border-rose-600/20 p-8 shadow-[0_0_50px_rgba(229,9,20,0.15)] md:p-10">
            <h3 className="mb-8 text-center text-2xl font-bold text-white">২. ডেলিভারি তথ্য দিন</h3>
            <div className="space-y-5">
              <input value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} type="text" placeholder="আপনার নাম *" required className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-white outline-none focus:border-rose-600" />
              <input value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} type="tel" placeholder="মোবাইল নাম্বার *" required className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-white outline-none focus:border-rose-600" />
              <input value={formData.city} onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))} type="text" placeholder="আপনার শহর *" required className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-white outline-none focus:border-rose-600" />
              <textarea value={formData.address} onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))} placeholder="সম্পূর্ণ ঠিকানা *" required rows="3" className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-white outline-none focus:border-rose-600" />
            </div>

            <button type="submit" disabled={status === 'loading'} className="cta-primary mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-black uppercase tracking-widest text-white">
              {status === 'loading' ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার করুন ৳${selected.price}`}
            </button>

            {status === 'success' ? <p className="mt-4 text-center font-bold text-green-400">অভিনন্দন! আপনার অর্ডার সফল হয়েছে।</p> : null}
            {status === 'error' ? <p className="mt-4 text-center font-bold text-red-400">দুঃখিত, অর্ডারটি পাঠানো যায়নি। আবার চেষ্টা করুন।</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}
