'use client';
import { useState } from 'react';

const faqs = [
  { q: 'ম্যাজিক টিস্যু ব্যবহারের নিয়ম কী?', a: 'সহজ! ব্যবহারের ১৫-২০ মিনিট আগে প্রয়োজনীয় স্থানে ব্যবহার করুন। বিস্তারিত প্যাকেটের গায়ে লেখা আছে।' },
  { q: 'এটি কি কোনো ক্ষতি করে?', a: 'না, এটি সম্পূর্ণ এক্সটার্নাল ইউজের জন্য এবং প্রাকৃতিক উপাদানে তৈরি।' },
  { q: 'ডেলিভারি চার্জ কত?', a: 'ঢাকার ভেতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা।' },
  { q: 'অর্ডার করতে কতক্ষণ লাগে?', a: 'নিচের ফর্মটি পূরণ করে সাবমিট করুন, ২ মিনিটের মধ্যে আমাদের প্রতিনিধি কল করবে।' },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section-shell bg-[#080808]">
      <div className="section-frame max-w-3xl">
        <h2 className="section-title text-center text-white mb-12">সাধারণ কিছু প্রশ্ন</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="panel-premium rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-white"
              >
                <span>{f.q}</span>
                <span className="text-rose-500">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-gray-400 border-t border-white/5 pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}