import 'server-only';

import { getOrCreateSiteConfig } from '@/lib/site-config';
import { mergeSiteConfig } from '@/lib/siteDefaults';

const GRAPH_VERSION = 'v18.0';

/**
 * Reads Meta Pixel + CAPI credentials from MongoDB (never from env for production path).
 */
export async function getMetaCredentialsFromDb() {
  const doc = await getOrCreateSiteConfig();
  const merged = mergeSiteConfig(doc.toObject());
  return {
    pixelId: String(merged.metaPixelId || '').trim(),
    accessToken: String(merged.metaAccessToken || '').trim(),
    testEventCode: String(merged.metaTestEventCode || '').trim(),
  };
}

/**
 * Sends a single event to Meta Conversions API.
 * @param {object} params
 * @param {string} params.eventName
 * @param {string} params.eventId
 * @param {number} [params.eventTime] unix seconds
 * @param {{ client_ip_address?: string, client_user_agent?: string, fbp?: string, fbc?: string }} params.userData
 * @param {Record<string, unknown>} [params.customData]
 */
export async function sendMetaConversionEvent({
  eventName,
  eventId,
  eventTime,
  userData = {},
  customData = {},
}) {
  const { pixelId, accessToken, testEventCode } = await getMetaCredentialsFromDb();

  if (!pixelId || !accessToken) {
    return { ok: false, skipped: true, reason: 'missing_pixel_or_token' };
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`);
  url.searchParams.set('access_token', accessToken);

  const ud = {};
  if (userData.client_ip_address) {
    ud.client_ip_address = userData.client_ip_address;
  }
  if (userData.client_user_agent) {
    ud.client_user_agent = userData.client_user_agent;
  }
  if (userData.fbp) {
    ud.fbp = userData.fbp;
  }
  if (userData.fbc) {
    ud.fbc = userData.fbc;
  }

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime ?? Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        user_data: ud,
        custom_data: customData && Object.keys(customData).length ? customData : {},
      },
    ],
  };

  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: json.error || json,
    };
  }

  return { ok: true, events_received: json.events_received, fbtrace_id: json.fbtrace_id };
}
