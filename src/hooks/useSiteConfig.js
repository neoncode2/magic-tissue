'use client';

import { useEffect, useState } from 'react';
import { mergeSiteConfig, siteDefaults } from '@/lib/siteDefaults';

export default function useSiteConfig() {
  const [config, setConfig] = useState(siteDefaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch('/api/site-config', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Failed to fetch site config');
        }

        const data = await response.json();

        if (!cancelled) {
          setConfig(mergeSiteConfig(data));
        }
      } catch {
        if (!cancelled) {
          setConfig(siteDefaults);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading, setConfig };
}
