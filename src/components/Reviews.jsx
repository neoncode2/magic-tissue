'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const fallbackReviews = [
  {
    _id: 1,
    name: 'সাবিহা আক্তার',
    rating: 5,
    comment: 'প্যাকেজিং আর delivery দুটোই premium লেগেছে। order করার পর খুব fast confirmation পেয়েছি।',
    verified: true,
  },
  {
    _id: 2,
    name: 'নওরীন ইসলাম',
    rating: 5,
    comment: 'ব্যবহার করা easy, আর overall experience অনেক clean। offer price-এ value খুব ভালো লেগেছে।',
    verified: true,
  },
  {
    _id: 3,
    name: 'মেহজাবিন রহমান',
    rating: 5,
    comment: 'আগেও similar কিছু ট্রাই করেছি, কিন্তু এইটা presentation আর delivery speed-এ better মনে হয়েছে।',
    verified: true,
  },
  {
    _id: 4,
    name: 'রাকিব হাসান',
    rating: 5,
    comment: 'খুবই ডিসক্রিট ডেলিভারি। প্যাকেটের উপর কোনো আজেবাজে নাম ছিল না। প্রডাক্ট কোয়ালিটি ১০০/১০০!',
    verified: true,
  },
];

export default function Reviews() {
  const reviews = fallbackReviews;
  const enableLoop = reviews.length >= 5;

  return (
    <section id="reviews" className="section-shell overflow-hidden bg-[#080808]">
      <div className="section-frame">
        <div className="mb-4 text-center md:mb-7">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="eyebrow">
            Happy Customers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title mt-4 text-white"
          >
            ব্যবহারকারীদের অভিজ্ঞতা
          </motion.h2>
        </div>

        <div className="px-4">
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
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="review-swiper !pb-20 !pt-10"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="max-w-[350px] md:max-w-[450px]">
                <div className="panel-premium flex h-full flex-col justify-between rounded-[40px] border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-8 shadow-2xl transition-all md:p-10">
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex gap-1 text-xl text-yellow-400">{'★'.repeat(review.rating)}</div>
                      {review.verified ? (
                        <span className="flex items-center gap-1 rounded-full border border-rose-600/20 bg-rose-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-rose-500">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-600" />
                          Verified
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-medium italic leading-relaxed text-gray-300 md:text-xl">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-4 border-t border-white/5 pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-xl font-black text-white shadow-lg transition-transform group-hover:rotate-6">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">সন্তুষ্ট ক্রেতা</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-[10px] italic text-gray-500">verified purchase</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
