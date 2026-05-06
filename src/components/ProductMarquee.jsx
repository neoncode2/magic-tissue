'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const fallbackProductImages = [
  '/tissue.png', 
  '/Tissue-Magic-2.jpg',
  '/tissue-1.jfif',
  '/magic-tissue 3.png',
];

export default function ProductMarquee() {
  const [productImages, setProductImages] = useState(fallbackProductImages);

  useEffect(() => {
    let isMounted = true;

    const fetchProductImages = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });

        if (!response.ok) {
          return;
        }

        const products = await response.json();
        const images = Array.isArray(products)
          ? products
              .map((product) => product?.image)
              .filter((image) => typeof image === 'string' && image.trim().length > 0)
          : [];

        if (isMounted && images.length > 0) {
          setProductImages(images);
        }
      } catch {
        // Keep fallback images if API fails.
      }
    };

    fetchProductImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const marqueeImages = useMemo(() => [...productImages, ...productImages], [productImages]);

  return (
    <section className="bg-[#080808] py-4  overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 mb-5 md:mb-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter"
        >
          আমাদের প্রিমিয়াম কালেকশন
        </motion.h2>
      </div>

      {/* Infinite Scrolling Container */}
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-6 py-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ 
            ease: "linear", 
            duration: 20, 
            repeat: Infinity 
          }}
        >
          {/* আমরা ডাবল লিস্ট ব্যবহার করছি যাতে লুপটি একদম স্মুথ হয় */}
          {marqueeImages.map((img, index) => (
            <div 
              key={index} 
              className="relative group w-[250px] md:w-[350px] aspect-square rounded-[32px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Image 
                src={img}
                alt="Product Image"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              
              {/* Hover Overlay with Order Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-bold mb-4 text-center">ম্যাজিক টিস্যু - প্রিমিয়াম কোয়ালিটি</p>
                <a 
                  href="#order-form" 
                  className="cta-primary rounded-full px-6 py-2 text-sm font-bold text-white"
                >
                  Order Now 🛒
                </a>
              </div>
            </div>
          ))}
        </motion.div>

        {/* সাইডে হালকা শ্যাডো যাতে স্লাইডারটি কেটে যাওয়ার মতো না লাগে */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Bottom CTA for Mobile */}
      <div className="mt-12 text-center md:hidden">
         <a href="#order-form" className="cta-primary px-10 py-4 rounded-2xl text-lg font-black">
            সরাসরি অর্ডার করুন
         </a>
      </div>
    </section>
  );
}
