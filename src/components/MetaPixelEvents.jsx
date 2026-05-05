'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import useSiteConfig from '@/hooks/useSiteConfig';
import { initMetaPixel, trackLead, trackPageView } from '@/lib/meta-pixel';

export default function MetaPixelEvents() {
  const { config } = useSiteConfig();
  const pathname = usePathname();
  const skipPathEffect = useRef(true);

  useEffect(() => {
    initMetaPixel(config.metaPixelId || '');
  }, [config.metaPixelId]);

  useEffect(() => {
    if (skipPathEffect.current) {
      skipPathEffect.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  useEffect(() => {
    function onClick(event) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const ctaButton = target.closest('.cta-primary');
      if (!ctaButton) {
        return;
      }

      trackLead({ content_name: 'cta_primary', source: 'cta_button' });
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
