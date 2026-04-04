'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const fallbackReviews = [
  { _id: 1, name: 'সাবিহা আক্তার', rating: 5, comment: 'প্যাকেজিং আর delivery দুটোই premium লেগেছে। order করার পর খুব fast confirmation পেয়েছি।', verified: true },
  { _id: 2, name: 'নওরীন ইসলাম', rating: 5, comment: 'ব্যবহার করা easy, আর overall experience অনেক clean। offer price-এ value খুব ভালো লেগেছে।', verified: true },
  { _id: 3, name: 'মেহজাবিন রহমান', rating: 5, comment: 'আগেও similar কিছু ট্রাই করেছি, কিন্তু এইটা presentation আর delivery speed-এ better মনে হয়েছে।', verified: true },
  { _id: 4, name: 'রাকিব হাসান', rating: 5, comment: 'খুবই ডিসক্রিট ডেলিভারি। প্যাকেটের উপর কোনো আজেবাজে নাম ছিল না। প্রডাক্ট কোয়ালিটি ১০০/১০০!', verified: true },
];

export default function Reviews() {
  const reviews = fallbackReviews;
  const enableLoop = reviews.length >= 1;

  return (
    <section id="reviews" className="relative section-shell overflow-hidden bg-[#080808] py-24">
      
      {/* --- আপলোড করা ছবির ব্যাকগ্রাউন্ড সেটআপ --- */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 0.15, scale: 1 }} // অপাসিটি ১৫% রাখা হয়েছে যাতে লেখা পরিষ্কার থাকে
          transition={{ duration: 1.5 }}
          src="/bg-image/trust.jpg" 
          alt="Trust and Connection" 
          className="h-full w-full object-cover"
        />
        {/* ছবির ওপর ডার্ক গ্রাডিয়েন্ট যাতে টেক্সট হাইলাইট হয় */}
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
            ব্যবহারকারীদের অভিজ্ঞতা
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            className="mt-4 text-gray-400 max-w-xl mx-auto"
          >
            হাজারো সুখী দম্পতির বিশ্বাসের নাম আমাদের এই সেবা
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
                  className="panel-premium flex h-full flex-col justify-between rounded-[40px] border-white/5 bg-black/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl transition-all border border-rose-600/10"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-1 text-xl text-yellow-500">{'★'.repeat(review.rating)}</div>
                      {review.verified && (
                        <span className="flex items-center gap-1 rounded-full border border-rose-600/20 bg-rose-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-xl font-medium italic leading-relaxed text-gray-200 md:text-2xl">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-4 border-t border-white/5 pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-xl font-black text-white shadow-lg">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">সন্তুষ্ট ক্রেতা</span>
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