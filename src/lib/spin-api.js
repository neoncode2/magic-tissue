const baseUrl = (process.env.NEXT_PUBLIC_SPIN_API_BASE_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Spin server timeout. Please try again.');
    }

    throw new Error('Spin server unreachable. Please ensure backend is running on port 4000.');
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
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
