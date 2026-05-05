'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = process.env.NEXT_PUBLIC_SPIN_USER_STORAGE_KEY || 'magic-tissue-spin-user-id';

function createSpinUserId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `spin-user-${crypto.randomUUID()}`;
  }

  return `spin-user-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getServerSessionSnapshot() {
  return '';
}

function getClientSessionSnapshot() {
  let spinUserId = localStorage.getItem(STORAGE_KEY);

  if (!spinUserId) {
    spinUserId = createSpinUserId();
    localStorage.setItem(STORAGE_KEY, spinUserId);
  }

  return spinUserId;
}

function subscribeToSessionChanges() {
  return () => {};
}

export function AuthProvider({ children }) {
  const token = useSyncExternalStore(subscribeToSessionChanges, getClientSessionSnapshot, getServerSessionSnapshot);
  const loading = token.length === 0;

  const value = useMemo(() => ({
    user: token ? { uid: token } : null,
    token,
    loading,
    isAuthReady: !loading && Boolean(token),
  }), [loading, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
