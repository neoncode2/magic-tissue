'use client';

/**
 * Browser-side Meta Pixel helpers.
 * Pixel ID must come from admin site config via initMetaPixel(id) — not from env.
 */

export const PIXEL_EVENT = {
  PAGE_VIEW: 'PageView',
  LEAD: 'Lead',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  PURCHASE: 'Purchase',
};

/** @type {string} */
let runtimePixelId = '';
let pixelBootstrapped = false;

export function getPixelId() {
  return typeof runtimePixelId === 'string' ? runtimePixelId.trim() : '';
}

export function setPixelId(value) {
  runtimePixelId = typeof value === 'string' ? value.trim() : '';
}

/**
 * Safe fbq stub (Facebook snippet pattern) until fbevents.js loads.
 */
function ensureFbqStub() {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.fbq === 'function') {
    return;
  }

  const fbqStub = function fbqStub(...args) {
    if (fbqStub.callMethod) {
      fbqStub.callMethod(...args);
    } else {
      fbqStub.queue.push(args);
    }
  };

  fbqStub.queue = [];
  fbqStub.loaded = true;
  fbqStub.version = '2.0';

  window.fbq = fbqStub;
  window._fbq = fbqStub;
}

function loadPixelScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector('script[data-meta-pixel="true"]');
  if (existing) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.setAttribute('data-meta-pixel', 'true');
  document.head.appendChild(script);
}

/**
 * Initialise pixel once when ID is available. Loads script at most once.
 * @param {string} pixelId
 */
export function initMetaPixel(pixelId) {
  setPixelId(pixelId);

  const currentPixelId = getPixelId();
  if (!currentPixelId || typeof window === 'undefined') {
    return;
  }

  ensureFbqStub();
  loadPixelScript();

  if (!pixelBootstrapped) {
    try {
      window.fbq('init', currentPixelId);
      window.fbq('track', PIXEL_EVENT.PAGE_VIEW);
    } catch {
      // ignore
    }
    pixelBootstrapped = true;
  }
}

/**
 * Call after SPA navigations (App Router) — does not re-init pixel.
 */
export function trackPageView() {
  if (!canTrack()) {
    return;
  }
  try {
    window.fbq('track', PIXEL_EVENT.PAGE_VIEW);
  } catch {
    // ignore
  }
}

function canTrack() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (!getPixelId()) {
    return false;
  }
  return typeof window.fbq === 'function';
}

/**
 * @param {string} eventName
 * @param {Record<string, unknown>} [payload]
 * @param {{ eventID?: string }} [options] eventID enables deduplication with Conversions API
 */
export function trackMetaPixel(eventName, payload = {}, options = {}) {
  if (!canTrack()) {
    return;
  }

  try {
    const eventID = options.eventID;
    if (eventID) {
      window.fbq('track', eventName, payload, { eventID });
    } else {
      window.fbq('track', eventName, payload);
    }
  } catch {
    // Silently ignore tracking failures
  }
}

export function trackLead(payload = {}, options = {}) {
  trackMetaPixel(PIXEL_EVENT.LEAD, payload, options);
}

export function trackInitiateCheckout(payload = {}, options = {}) {
  trackMetaPixel(PIXEL_EVENT.INITIATE_CHECKOUT, payload, options);
}

export function trackPurchase(payload = {}, options = {}) {
  trackMetaPixel(PIXEL_EVENT.PURCHASE, payload, options);
}
