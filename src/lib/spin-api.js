import { getSpinApiBases } from '@/lib/spin-api-bases';

function shouldRetryWithNextBase(response) {
  if (!response) return true;
  const s = response.status;
  return s === 502 || s === 503 || s === 504 || s === 522 || s === 524;
}

async function request(path, options = {}) {
  const bases = getSpinApiBases();
  const attempts = [];

  for (let i = 0; i < bases.length; i += 1) {
    const baseUrl = bases[i];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    let response;

    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      attempts.push(`${baseUrl}: ${error?.name === 'AbortError' ? 'timeout' : error?.message || 'network error'}`);
      if (i < bases.length - 1) {
        continue;
      }
      throw new Error(
        attempts.length
          ? `Spin server unreachable (${attempts.join(' → ')}).`
          : 'Spin server unreachable.',
      );
    }

    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return data;
    }

    if (shouldRetryWithNextBase(response) && i < bases.length - 1) {
      attempts.push(`${baseUrl}: HTTP ${response.status}`);
      continue;
    }

    throw new Error(data.error || `Request failed (${response.status})`);
  }

  throw new Error(
    attempts.length ? `Spin server unreachable (${attempts.join(' → ')}).` : 'Spin server unreachable.',
  );
}

export function getSpinConfig() {
  return request('/spin/config', { cache: 'no-store' });
}

export function getSpinStatus(token) {
  return request('/spin/me', {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function spinOnce(token) {
  return request('/spin', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
}

export function submitSpinOrder(token, payload) {
  return request('/spin-orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
