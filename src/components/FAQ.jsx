'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'ম্যাজিক টিস্যু ব্যবহারের নিয়ম কী?',
    a: 'সহজ। ব্যবহারের ১৫-২০ মিনিট আগে প্রয়োজনীয় স্থানে ব্যবহার করুন। বিস্তারিত প্যাকেটের গায়ে লেখা আছে।',
  },
  {
    q: 'এটি কি কোনো ক্ষতি করে?',
    a: 'না। এটি সম্পূর্ণ external use-এর জন্য এবং প্রাকৃতিক উপাদানে তৈরি।',
  },
  {
    q: 'ডেলিভারি চার্জ কত?',
    a: 'ঢাকার ভেতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা।',
  },
  {
    q: 'অর্ডার করতে কতক্ষণ লাগে?',
    a: 'নিচের ফর্মটি পূরণ করে সাবমিট করুন, দ্রুতই আমাদের প্রতিনিধি কল করবে।',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section-shell bg-[#080808]">
      <div className="section-frame max-w-3xl">
        <h2 className="section-title mb-3 text-center text-white md:mb-4">সাধারণ কিছু প্রশ্ন</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="panel-premium overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between p-4 text-left font-bold text-white md:p-5"
              >
                <span>{faq.q}</span>
                <span className="text-rose-500">{open === index ? '−' : '+'}</span>
              </button>
              {open === index ? (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 text-gray-400 md:px-5 md:pb-5">{faq.a}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
