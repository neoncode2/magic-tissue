'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const fallbackReviews = [
  { _id: 1, name: 'সাবিহা আক্তার', rating: 5, comment: 'প্যাকেজিং আর delivery দুটোই premium লেগেছে। order করার পর খুব fast confirmation পেয়েছি।', verified: true },
  { _id: 2, name: 'নওরীন ইসলাম', rating: 5, comment: 'ব্যবহার করা easy, আর overall experience অনেক clean। offer price-এ value খুব ভালো লেগেছে।', verified: true },
  { _id: 3, name: 'মেহজাবিন রহমান', rating: 5, comment: 'আগেও similar কিছু ট্রাই করেছি, কিন্তু এইটা presentation আর delivery speed-এ better মনে হয়েছে।', verified: true },
  { _id: 4, name: 'রাকিব হাসান', rating: 5, comment: 'খুবই ডিসক্রিট ডেলিভারি। প্যাকেটের উপর কোনো আজেবাজে নাম ছিল না। প্রোডাক্ট কোয়ালিটি ১০০/১০০!', verified: true },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(fallbackReviews);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch('/api/reviews', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      } catch {
        if (!cancelled) setReviews(fallbackReviews);
      }
    }

    loadReviews();
    return () => { cancelled = true; };
  }, []);

  // স্লাইডার যাতে কখনোই না থামে, তাই রিভিউগুলোকে ৩ বার ডুপ্লিকেট করে লিস্ট বড় করে দিচ্ছি
  const infiniteReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section id="reviews" className="relative section-shell overflow-hidden bg-[#080808] py-24">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5 }}
          src="/bg-image/trust.jpg"
          alt="Trust and Connection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </div>

      <div className="section-frame relative z-10">
        <div className="mb-6 text-center md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            Happy Customers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-title mt-4 text-white !text-4xl md:!text-6xl"
          >
            {'ব্যবহারকারীদের অভিজ্ঞতা'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-gray-400"
          >
            {'হাজারো সুখী দম্পতির বিশ্বাসের নাম আমাদের এই সেবা'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-4"
        >
          <Swiper
            modules={[Autoplay]}
            grabCursor={true}
            centeredSlides={true}
            loop={true}               /* লুপ ট্রু করা হয়েছে */
            slidesPerView="auto"
            speed={4000}              /* স্পিড ৪ সেকেন্ড */
            autoplay={{
              delay: 0,               /* কোনো ব্রেক ছাড়াই চলবে */
              disableOnInteraction: false, /* ক্লিক বা টাচ করলেও থামবে না */
            }}
            className="review-swiper continuous-marquee !pb-16 !pt-4"
          >
            {infiniteReviews.map((review, index) => (
              <SwiperSlide key={`${review._id}-${index}`} className="max-w-[350px] md:max-w-[500px]">
                <div className="panel-premium flex h-full flex-col justify-between rounded-[40px] border border-rose-600/10 border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-xl transition-all md:p-12">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-1 text-xl text-yellow-500">{'★'.repeat(Number(review.rating || 5))}</div>
                      {review.verified && (
                        <span className="flex items-center gap-1 rounded-full border border-rose-600/20 bg-rose-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                          Verified
                        </span>
                      )}
                    </div>

                    {review.image ? (
                      <div className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={review.image}
                          alt={review.name || 'Customer review'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}

                    {review.comment ? (
                      <p className="text-xl font-medium italic leading-relaxed text-gray-200 md:text-2xl">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-base font-medium leading-relaxed text-gray-400 md:text-lg">
                        Customer shared a verified review.
                      </p>
                    )}
                  </div>

                  <div className="mt-12 flex items-center gap-4 border-t border-white/5 pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-xl font-black text-white shadow-lg">
                      {String(review.name || 'C')[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">{'সন্তুষ্ট ক্রেতা'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}