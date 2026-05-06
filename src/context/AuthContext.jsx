'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function createSpinUserId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `spin-user-${crypto.randomUUID()}`;
  }

  return `spin-user-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function AuthProvider({ children }) {
  // Keep spin identity only in-memory for this page load.
  const [token] = useState(() => createSpinUserId());
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
