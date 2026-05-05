'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-500 focus:bg-black/50';

function safeNextPath(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/admin';
  }
  return raw;
}

export default function AdminLogin({ needsSetup = false, dbError = '' }) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(needsSetup ? 'create' : 'login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const next = safeNextPath(searchParams.get('next') || '');
      window.location.href = next;
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterKey: formData.get('masterKey'),
          displayName: formData.get('displayName'),
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Admin create failed');
      }

      setMessage('Admin created successfully. You can now log in with the new username and password.');
      setTab('login');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <div className="inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-rose-400">
        EVER GLOW FACE  PACK Admin
        </div>
        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-black leading-none text-white md:text-6xl">
            Master Admin Panel
            <span className="mt-3 block bg-gradient-to-r from-rose-500 to-orange-300 bg-clip-text text-transparent">
              content, orders, reviews, analytics
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Use this panel to manage content, orders, reviews, and admin access. The first admin must be created with the
            master key, then normal username/password login can be used.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Overview', 'Daily, weekly, monthly revenue cards + analytics'],
            ['Orders', 'Client info, status update, direct call access'],
            ['Content', 'Hero video, benefits, offer, packages, FAQ edit'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-rose-400">{title}</div>
              <p className="text-sm leading-6 text-gray-400">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[36px] border border-white/10 bg-[#111111]/95 p-6 shadow-[0_30px_80px_rgba(229,9,20,0.15)] backdrop-blur xl:p-8">
        <div className="mb-6 flex rounded-2xl border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === 'login' ? 'bg-rose-600 text-white' : 'text-gray-400'}`}
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === 'create' ? 'bg-rose-600 text-white' : 'text-gray-400'}`}
          >
            Create Admin
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Username</label>
              <input name="username" className={inputClass} placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Password</label>
              <input name="password" type="password" className={inputClass} placeholder="••••••••" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-700 to-rose-500 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_15px_40px_rgba(229,9,20,0.35)] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Login To Dashboard'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Master Key</label>
              <input name="masterKey" type="password" className={inputClass} placeholder="Enter master key" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Display Name</label>
              <input name="displayName" className={inputClass} placeholder="Master Admin" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Username</label>
              <input name="username" className={inputClass} placeholder="master-admin" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Password</label>
              <input name="password" type="password" className={inputClass} placeholder="Create a strong password" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_15px_40px_rgba(249,115,22,0.25)] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        )}

        {message ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">{message}</div>
        ) : null}

        {dbError ? (
          <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Database is not ready: {dbError}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-gray-400">
          {dbError
            ? 'Admin status could not be checked because MongoDB connection failed. Fix Atlas username, password, and network access first.'
            : needsSetup
              ? 'No admin exists in this project yet. Create the first admin using the master key.'
              : 'Use username and password to log in. Creating another admin requires the master key.'}
        </div>
      </div>
    </div>
  );
}
