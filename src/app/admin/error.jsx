'use client';

import { useEffect } from 'react';

export default function AdminError({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.16),transparent_35%),#070707] px-6 py-10">
      <div className="w-full max-w-xl rounded-[36px] border border-white/10 bg-[#111111]/95 p-8 text-white shadow-[0_30px_80px_rgba(229,9,20,0.15)]">
        <div className="text-xs font-black uppercase tracking-[0.28em] text-rose-400">Magic Tissue Admin</div>
        <h1 className="mt-4 text-3xl font-black">Dashboard temporarily unavailable</h1>
        <p className="mt-4 text-sm leading-7 text-gray-400">
          The admin area hit a backend problem. Check database access and environment variables, then retry.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Try Again
          </button>
          <a
            href="/api/health/db"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white"
          >
            Check DB Health
          </a>
        </div>
      </div>
    </main>
  );
}
