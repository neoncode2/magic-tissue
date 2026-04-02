'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

// Swiper CSS Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const fallbackReviews = [
  { _id: 1, name: 'সাবিহা আক্তার', rating: 5, comment: 'প্যাকেজিং আর delivery দুটোই premium লেগেছে। order করার পর খুব fast confirmation পেয়েছি।', verified: true },
  { _id: 2, name: 'নওরীন ইসলাম', rating: 5, comment: 'ব্যবহার করা easy, আর overall experience অনেক clean। offer price-এ value খুব ভালো লেগেছে।', verified: true },
  { _id: 3, name: 'মেহজাবিন রহমান', rating: 5, comment: 'আগেও similar কিছু ট্রাই করেছি, কিন্তু এইটা presentation আর delivery speed-এ better মনে হয়েছে।', verified: true },
  { _id: 4, name: 'রাকিব হাসান', rating: 5, comment: 'খুবই ডিসক্রিট ডেলিভারি। প্যাকেটের ওপর কোনো আজেবাজে নাম ছিল না। প্রডাক্ট কোয়ালিটি ১০০/১০০!', verified: true },
];

export default function Reviews() {
  return (
    <section id="reviews" className="section-shell bg-[#080808] overflow-hidden">
      <div className="section-frame">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="eyebrow"
          >
            Happy Customers
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title text-white mt-4"
          >
            ব্যবহারকারীদের অভিজ্ঞতা
          </motion.h2>
        </div>

        {/* Swiper Container */}
        <div className="px-4">
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={'auto'}
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
            className="!pb-20 !pt-10 review-swiper"
          >
            {fallbackReviews.map((review) => (
              <SwiperSlide key={review._id} className="max-w-[350px] md:max-w-[450px]">
                <div className="panel-premium h-full p-8 md:p-10 rounded-[40px] border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] shadow-2xl flex flex-col justify-between group transition-all">
                  
                  {/* Top Part */}
                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex gap-1 text-yellow-400 text-xl">
                        {'★'.repeat(review.rating)}
                      </div>
                      {review.verified && (
                        <span className="flex items-center gap-1 bg-rose-600/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full border border-rose-600/20 uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" /> Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic font-medium">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Part */}
                  <div className="mt-10 flex items-center gap-4 border-t border-white/5 pt-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center font-black text-xl text-white shadow-lg group-hover:rotate-6 transition-transform">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{review.name}</h4>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-rose-500 font-bold uppercase tracking-widest">সন্তুষ্ট ক্রেতা</span>
                         <span className="text-gray-600">|</span>
                         <span className="text-[10px] text-gray-500 italic">verified purchase</span>
                      </div>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* কাস্টম সিএসএস যা স্লাইডারকে আরও সুন্দর করবে */}
      <style jsx global>{`
        .review-swiper .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.5s ease;
        }
        .review-swiper .swiper-slide-active {
          opacity: 1;
        }
        .review-swiper .swiper-pagination-bullet {
          background: #e50914 !important;
          width: 12px;
          height: 12px;
          opacity: 0.3;
        }
        .review-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
}
