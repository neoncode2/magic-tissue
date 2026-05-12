/**
 * Spin wheel calls the Next.js Route Handlers on the same host as the page.
 * (Previously non–tissuepower.com hosts fell back to `tissuepower.com`, which
 * broke Vercel previews, VPS domains, and any deploy where that URL was down or
 * blocked cross-origin.)
 *
 * Optional `NEXT_PUBLIC_SPIN_API_BASE_URL` (no trailing slash) for SSR/tests
 * when `window` is unavailable.
 */
export function getSpinApiBases() {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin.replace(/\/$/, '');
    return [`${origin}/api`];
  }

  const envBase = process.env.NEXT_PUBLIC_SPIN_API_BASE_URL?.replace(/\/$/, '');
  if (envBase) {
    return [envBase];
  }

  if (process.env.NODE_ENV !== 'production') {
    return ['http://localhost:3000/api'];
  }

  return ['http://localhost:3000/api'];
}
