const baseUrl = (process.env.NEXT_PUBLIC_SPIN_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
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
  return request('/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
