'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirebaseClient } from '@/lib/firebase-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { auth, isReady } = getFirebaseClient();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(() => Boolean(isReady && auth));

  useEffect(() => {
    if (!isReady || !auth) {
      return undefined;
    }

    let cancelled = false;

    async function bootstrapAnonymousAuth() {
      try {
        await signInAnonymously(auth);
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        await bootstrapAnonymousAuth();
        if (!cancelled) {
          setUser(null);
          setToken('');
          setLoading(false);
        }
        return;
      }

      const nextToken = await nextUser.getIdToken();

      if (!cancelled) {
        setUser(nextUser);
        setToken(nextToken);
        setLoading(false);
      }
    });

    bootstrapAnonymousAuth();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [auth, isReady]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isFirebaseReady: isReady,
  }), [isReady, loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
