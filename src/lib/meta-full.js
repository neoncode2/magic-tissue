'use client';

/**
 * Unified client-side tracking: browser pixel + server CAPI with shared event_id (deduplication).
 */

import { trackInitiateCheckout, trackLead, trackPurchase } from '@/lib/meta-pixel';

/**
 * Browser Pixel + CAPI InitiateCheckout with shared event_id (optional deduplication).
 */
export async function trackInitiateCheckoutDeduped(payload = {}) {
  const event_id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const value = payload.value != null ? Number(payload.value) : undefined;
  const currency = typeof payload.currency === 'string' ? payload.currency : 'BDT';
  const ids = Array.isArray(payload.content_ids) ? payload.content_ids : [];
  const primaryId = ids[0] || 'checkout';

  trackInitiateCheckout(
    {
      ...payload,
      currency,
      ...(value != null && !Number.isNaN(value) ? { value } : {}),
    },
    { eventID: event_id }
  );

  const { fbp, fbc } = getMetaBrowserIds();

  try {
    await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'InitiateCheckout',
        event_id,
        ...(value != null && !Number.isNaN(value) ? { value } : {}),
        currency,
        contents: [{ id: String(primaryId), quantity: Number(payload.num_items) || 1 }],
        fbp: fbp || undefined,
        fbc: fbc || undefined,
      }),
    });
  } catch {
    // ignore
  }
}

function readCookie(name) {
  if (typeof document === 'undefined') {
    return '';
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * @returns {{ fbp: string, fbc: string }}
 */
export function getMetaBrowserIds() {
  return {
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  };
}

/**
 * @typedef {object} CheckoutContentItem
 * @property {string} id
 * @property {number} [quantity]
 * @property {number} [item_price]
 */

/**
 * @typedef {object} TrackCheckoutCompleteInput
 * @property {string} orderId
 * @property {number} value
 * @property {string} [currency]
 * @property {CheckoutContentItem[]} contents
 * @property {string} [contentName]
 */

/**
 * Fires Purchase in-browser and POSTs the same event_id to /api/meta-conversion (server CAPI).
 * Call once per completed order (guard with ref in UI).
 *
 * @param {TrackCheckoutCompleteInput} orderData
 */
export async function trackCheckoutComplete(orderData) {
  const event_id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const currency = orderData.currency || 'BDT';
  const value = Number(orderData.value) || 0;
  const contents = Array.isArray(orderData.contents) ? orderData.contents : [];
  const { fbp, fbc } = getMetaBrowserIds();

  const pixelPayload = {
    value,
    currency,
    content_type: 'product',
    content_ids: contents.map((c) => c.id).filter(Boolean),
    contents: contents.map((c) => ({
      id: c.id,
      quantity: Number(c.quantity) || 1,
      ...(c.item_price != null ? { item_price: Number(c.item_price) } : {}),
    })),
    num_items: contents.reduce((sum, c) => sum + (Number(c.quantity) || 1), 0) || 1,
    ...(orderData.contentName ? { content_name: orderData.contentName } : {}),
  };

  trackPurchase(pixelPayload, { eventID: event_id });

  try {
    await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'Purchase',
        event_id,
        value,
        currency,
        order_id: orderData.orderId,
        contents: contents.map((c) => ({
          id: String(c.id),
          quantity: Number(c.quantity) || 1,
          ...(c.item_price != null ? { item_price: Number(c.item_price) } : {}),
        })),
        fbp: fbp || undefined,
        fbc: fbc || undefined,
      }),
    });
  } catch {
    // CAPI failure must not break UX
  }
}

export { trackLead, trackInitiateCheckout, trackPurchase };
