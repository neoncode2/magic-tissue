'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = process.env.NEXT_PUBLIC_SPIN_USER_STORAGE_KEY || 'magic-tissue-spin-user-id';
let cachedClientSession = null;
const serverSessionSnapshot = { user: null, token: '', loading: true };

function createSpinUserId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `spin-user-${crypto.randomUUID()}`;
  }

  return `spin-user-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getServerSessionSnapshot() {
  return serverSessionSnapshot;
}

function getClientSessionSnapshot() {
  if (cachedClientSession) {
    return cachedClientSession;
  }

  let spinUserId = localStorage.getItem(STORAGE_KEY);

  if (!spinUserId) {
    spinUserId = createSpinUserId();
    localStorage.setItem(STORAGE_KEY, spinUserId);
  }

  cachedClientSession = {
    user: { uid: spinUserId },
    token: spinUserId,
    loading: false,
  };

  return cachedClientSession;
}

function subscribeToSessionChanges() {
  return () => {};
}

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeToSessionChanges, getClientSessionSnapshot, getServerSessionSnapshot);
  const { user, token, loading } = session;

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthReady: !loading && Boolean(token),
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
