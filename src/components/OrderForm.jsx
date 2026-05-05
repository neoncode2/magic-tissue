'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useSiteConfig from '@/hooks/useSiteConfig';
import { submitSpinOrder } from '@/lib/spin-api';
import { useAuth } from '@/context/AuthContext';
import { useSpin } from '@/context/SpinContext';

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function calculatePreviewDiscount(price, reward) {
  if (!reward || reward.type === 'none') {
    return 0;
  }

  if (reward.type === 'percentage') {
    return Math.min(price, Math.round((price * Number(reward.value || 0)) / 100));
  }

  if (reward.type === 'fixed') {
    return Math.min(price, Math.max(0, Number(reward.value || 0)));
  }

  return 0;
}

export default function OrderForm() {
  const { config } = useSiteConfig();
  const { token, isFirebaseReady } = useAuth();
  const { status: spinStatus, setStatus: setSpinStatus } = useSpin();
  const initialPackage = config.packages[0];
  const [selected, setSelected] = useState(initialPackage);
  const [status, setStatus] = useState('idle');
  const [serverSummary, setServerSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    setSelected(config.packages[0]);
  }, [config.packages]);

  const previewDiscount = calculatePreviewDiscount(Number(selected?.price || 0), spinStatus.reward);
  const previewTotal = Math.max(0, Number(selected?.price || 0) - previewDiscount);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    setServerSummary(null);

    try {
      if (!token || !isFirebaseReady) {
        throw new Error('Firebase authentication is not ready yet');
      }

      const data = await submitSpinOrder(token, {
        ...formData,
        productLabel: 'Magic Tissue',
        packageId: selected.id,
        quantity: 1,
        paymentMethod: 'COD',
      });

      setStatus('success');
      setServerSummary(data);
      setFormData({ name: '', phone: '', city: '', address: '' });

      if (spinStatus.hasSpun && !spinStatus.used) {
        setSpinStatus((prev) => ({
          ...prev,
          used: true,
        }));
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Order failed');
    }
  }

  return (
    <section id="order-form" className="relative section-shell overflow-hidden bg-[#0a0a0a] py-20">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-image/Order Form.jpg"
          alt="Background"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </div>

      <div className="section-frame relative z-10 max-w-6xl">
        <div className="mb-6 text-center md:mb-12">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="eyebrow">
            Order Now
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-4 text-4xl font-black text-white md:text-6xl"
          >
            {'\u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u0995\u09a8\u09ab\u09be\u09b0\u09cd\u09ae \u0995\u09b0\u09c1\u09a8'}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm">{'\u09E7'}</span>
              {'\u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
            </h3>

            {config.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelected(pkg)}
                className={`group w-full rounded-3xl border-2 p-6 text-left transition-all backdrop-blur-sm ${
                  selected?.id === pkg.id ? 'border-rose-600 bg-rose-600/20' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-white">{pkg.label}</p>
                    <p className="text-sm text-rose-400">{pkg.shipping}</p>
                  </div>
                  <p className="text-3xl font-black text-white transition-transform group-hover:scale-110">{formatPrice(pkg.price)}</p>
                </div>
              </button>
            ))}

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-200/70">Spin Discount</div>
                  <div className="mt-2 text-xl font-black text-white">
                    {spinStatus.hasSpun && spinStatus.reward ? spinStatus.reward.label : 'Spin to unlock'}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-amber-100/80">
                    Backend checkout will verify the discount before placing your order.
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">Payable</div>
                  <div className="mt-2 text-2xl font-black text-white">{formatPrice(previewTotal || selected?.price)}</div>
                  {previewDiscount > 0 ? (
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                      Saved {formatPrice(previewDiscount)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-rose-600/20 bg-rose-600/10 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{'\uD83D\uDD12'}</span>
                <p className="text-sm leading-relaxed text-rose-200">
                  {
                    '\u0986\u09AA\u09A8\u09BE\u09B0 \u09A4\u09A5\u09CD\u09AF \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u0995\u09BE\u099B\u09C7 \u09E7\u09E6\u09E6% \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6\u0964 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099F\u09C7\u09B0 \u0997\u09BE\u09AF\u09BC\u09C7 \u09AA\u09A3\u09CD\u09AF\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B2\u09C7\u0996\u09BE \u09A5\u09BE\u0995\u09AC\u09C7 \u09A8\u09BE\u0964 \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u0964'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
            <form
              onSubmit={handleSubmit}
              className="panel-premium relative overflow-hidden rounded-[40px] border-rose-600/20 bg-black/60 p-8 shadow-2xl backdrop-blur-xl md:p-10"
            >
              <h3 className="mb-8 flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm">{'\u09E8'}</span>
                {'\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A4\u09A5\u09CD\u09AF \u09A6\u09BF\u09A8'}
              </h3>

              <div className="space-y-5">
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  type="text"
                  placeholder={'\u0986\u09AA\u09A8\u09BE\u09B0 \u09A8\u09BE\u09AE *'}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none transition-all placeholder:text-white/40 focus:border-rose-600"
                />
                <input
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  type="tel"
                  placeholder={'\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09BE\u09B0 *'}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none transition-all placeholder:text-white/40 focus:border-rose-600"
                />
                <input
                  value={formData.city}
                  onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))}
                  type="text"
                  placeholder={'\u0986\u09AA\u09A8\u09BE\u09B0 \u09B6\u09B9\u09B0 *'}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none transition-all placeholder:text-white/40 focus:border-rose-600"
                />
                <textarea
                  value={formData.address}
                  onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder={'\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE *'}
                  required
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-white outline-none transition-all placeholder:text-white/40 focus:border-rose-600"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'loading'}
                className="cta-primary mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-black uppercase tracking-widest text-white shadow-lg"
              >
                {status === 'loading'
                  ? '\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8 \u09B9\u099A\u09CD\u099B\u09C7...'
                  : `\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 ${formatPrice(previewTotal || selected?.price)}`}
              </motion.button>

              {status === 'success' ? (
                <p className="mt-4 text-center font-bold text-green-400">{'\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09AB\u09B2 \u09B9\u09DF\u09C7\u099B\u09C7!'}</p>
              ) : null}
              {serverSummary?.discount?.amount > 0 ? (
                <p className="mt-2 text-center text-sm font-bold text-amber-200">
                  Discount applied: {serverSummary.discount.label} ({formatPrice(serverSummary.discount.amount)})
                </p>
              ) : null}
              {status === 'error' && errorMessage ? (
                <p className="mt-4 text-center text-sm font-semibold text-rose-300">{errorMessage}</p>
              ) : null}
              {!isFirebaseReady ? (
                <p className="mt-4 text-center text-sm text-amber-200/80">
                  Firebase env missing. Spin discount checkout needs Firebase anonymous auth configuration.
                </p>
              ) : null}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
