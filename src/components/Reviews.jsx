'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const fallbackReviews = [
  { _id: 1, name: '\u09b8\u09be\u09ac\u09bf\u09b9\u09be \u0986\u0995\u09cd\u09a4\u09be\u09b0', rating: 5, comment: '\u09aa\u09cd\u09af\u09be\u0995\u09c7\u099c\u09bf\u0982 \u0986\u09b0 delivery \u09a6\u09c1\u099f\u09cb\u0987 premium \u09b2\u09c7\u0997\u09c7\u099b\u09c7\u0964 order \u0995\u09b0\u09be\u09b0 \u09aa\u09b0 \u0996\u09c1\u09ac fast confirmation \u09aa\u09c7\u09af\u09bc\u09c7\u099b\u09bf\u0964', verified: true },
  { _id: 2, name: '\u09a8\u0993\u09b0\u09c0\u09a8 \u0987\u09b8\u09b2\u09be\u09ae', rating: 5, comment: '\u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be easy, \u0986\u09b0 overall experience \u0985\u09a8\u09c7\u0995 clean\u0964 offer price-\u098f value \u0996\u09c1\u09ac \u09ad\u09be\u09b2\u09cb \u09b2\u09c7\u0997\u09c7\u099b\u09c7\u0964', verified: true },
  { _id: 3, name: '\u09ae\u09c7\u09b9\u099c\u09be\u09ac\u09bf\u09a8 \u09b0\u09b9\u09ae\u09be\u09a8', rating: 5, comment: '\u0986\u0997\u09c7\u0993 similar \u0995\u09bf\u099b\u09c1 \u099f\u09cd\u09b0\u09be\u0987 \u0995\u09b0\u09c7\u099b\u09bf, \u0995\u09bf\u09a8\u09cd\u09a4\u09c1 \u098f\u0987\u099f\u09be presentation \u0986\u09b0 delivery speed-\u098f better \u09ae\u09a8\u09c7 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964', verified: true },
  { _id: 4, name: '\u09b0\u09be\u0995\u09bf\u09ac \u09b9\u09be\u09b8\u09be\u09a8', rating: 5, comment: '\u0996\u09c1\u09ac\u0987 \u09a1\u09bf\u09b8\u0995\u09cd\u09b0\u09bf\u099f \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf\u0964 \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f\u09c7\u09b0 \u0989\u09aa\u09b0 \u0995\u09cb\u09a8\u09cb \u0986\u099c\u09c7\u09ac\u09be\u099c\u09c7 \u09a8\u09be\u09ae \u099b\u09bf\u09b2 \u09a8\u09be\u0964 \u09aa\u09cd\u09b0\u09a1\u09be\u0995\u09cd\u099f \u0995\u09cb\u09af\u09bc\u09be\u09b2\u09bf\u099f\u09bf \u09e7\u09e6\u09e6/\u09e7\u09e6\u09e6!', verified: true },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const enableLoop = reviews.length >= 3;

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch('/api/reviews', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      } catch {
        if (!cancelled) {
          setReviews(fallbackReviews);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

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
            {'\u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0\u09a6\u09c7\u09b0 \u0985\u09ad\u09bf\u099c\u09cd\u099e\u09a4\u09be'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-gray-400"
          >
            {'\u09b9\u09be\u099c\u09be\u09b0\u09cb \u09b8\u09c1\u0996\u09c0 \u09a6\u09ae\u09cd\u09aa\u09a4\u09bf\u09b0 \u09ac\u09bf\u09b6\u09cd\u09ac\u09be\u09b8\u09c7\u09b0 \u09a8\u09be\u09ae \u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u098f\u0987 \u09b8\u09c7\u09ac\u09be'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-4"
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={enableLoop}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="review-swiper !pb-16 !pt-4"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="max-w-[350px] md:max-w-[500px]">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="panel-premium flex h-full flex-col justify-between rounded-[40px] border border-rose-600/10 border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-xl transition-all md:p-12"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-1 text-xl text-yellow-500">{'\u2605'.repeat(Number(review.rating || 5))}</div>
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
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">{'\u09b8\u09a8\u09cd\u09a4\u09c1\u09b7\u09cd\u099f \u0995\u09cd\u09b0\u09c7\u09a4\u09be'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
