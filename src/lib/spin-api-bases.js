/** Production spin API (Next `/api` on this host only). */
const TISSUEPOWER_SPIN_API = 'https://tissuepower.com/api';

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function isTissuepowerHostname(hostname) {
  return hostname === 'tissuepower.com' || hostname === 'www.tissuepower.com';
}

/**
 * Spin client may call only:
 * - Local Next: same tab origin + `/api` (dev on localhost, any port)
 * - Live site: `https://tissuepower.com/api`
 *
 * No other hosts (env `NEXT_PUBLIC_SPIN_API_BASE_URL` is ignored).
 */
export function getSpinApiBases() {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    if (isLocalHostname(hostname)) {
      return [`${origin.replace(/\/$/, '')}/api`];
    }

    if (isTissuepowerHostname(hostname)) {
      return [TISSUEPOWER_SPIN_API];
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return ['http://localhost:3000/api'];
  }

  return [TISSUEPOWER_SPIN_API];
}
