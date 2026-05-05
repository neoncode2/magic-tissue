'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSpinConfig, getSpinStatus } from '@/lib/spin-api';
import { useAuth } from '@/context/AuthContext';
import { defaultSpinConfig, defaultSpinOptions } from '@/lib/spin-defaults';

const SpinContext = createContext(null);
const fallbackConfig = {
  ...defaultSpinConfig,
  options: defaultSpinOptions.map((option, index) => ({
    id: `fallback-${index}`,
    ...option,
  })),
};

export function SpinProvider({ children }) {
  const { token, loading: authLoading, isAuthReady } = useAuth();
  const [config, setConfig] = useState(fallbackConfig);
  const [status, setStatus] = useState({
    hasSpun: false,
    used: false,
    reward: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const spinConfig = await getSpinConfig();
        if (!cancelled) {
          setConfig(spinConfig);
        }
      } catch {
        if (!cancelled) {
          setConfig(fallbackConfig);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (authLoading) {
        return;
      }

      if (!token || !isAuthReady) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const nextStatus = await getSpinStatus(token);

        if (!cancelled) {
          setStatus(nextStatus);
        }
      } catch {
        if (!cancelled) {
          setStatus({
            hasSpun: false,
            used: false,
            reward: null,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthReady, token]);

  const value = useMemo(() => ({
    config,
    status,
    loading,
    setStatus,
  }), [config, loading, status]);

  return <SpinContext.Provider value={value}>{children}</SpinContext.Provider>;
}

export function useSpin() {
  const context = useContext(SpinContext);

  if (!context) {
    throw new Error('useSpin must be used within SpinProvider');
  }

  return context;
}
