'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const links = [
  { href: '#product', label: 'উপকারিতা' },
  { href: '#features', label: 'কেন নেবেন' },
  { href: '#reviews', label: 'রিভিউ' },
  { href: '#faq', label: 'প্রশ্নোত্তর' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090909]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex items-center gap-3">
          <div className="red-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]">
            <span className="font-serif text-lg font-extrabold text-white">MT</span>
          </div>
          <div>
            <div className="font-serif text-lg font-bold text-white">Magic Tissue</div>
            <div className="text-xs uppercase tracking-[0.28em] text-[#ff8d95]">Instant Confidence</div>
          </div>
        </a>

        <nav className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[#d0d0d0] transition hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-[#E50914]/28 bg-[#1b0d10] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffb1b6]">
            স্টক সীমিত
          </div>
          <a href="#order-form" className="cta-primary rounded-2xl px-5 py-3 text-sm font-bold">
            অর্ডার করুন
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#151515] text-white md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{menuOpen ? '×' : '≡'}</span>
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-[#0f0f0f] px-4 pb-5 pt-3 md:hidden"
        >
          <div className="space-y-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="panel-premium block rounded-2xl px-4 py-3 text-sm font-semibold text-[#e0e0e0]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#order-form"
              onClick={() => setMenuOpen(false)}
              className="cta-primary block rounded-2xl px-4 py-3 text-center text-sm font-bold"
            >
              অর্ডার করুন এখনই
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
