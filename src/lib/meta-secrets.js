/**
 * Strips Meta Conversion API secrets from objects sent to browsers.
 * @param {Record<string, unknown>} config
 * @returns {Record<string, unknown>}
 */
export function omitMetaSecrets(config) {
  if (!config || typeof config !== 'object') {
    return {};
  }
  const { metaAccessToken: _a, metaTestEventCode: _t, ...rest } = config;
  return rest;
}

/**
 * Removes empty metaAccessToken from admin PATCH bodies so DB token is preserved.
 * @param {Record<string, unknown>} updates
 */
export function sanitizeMetaFieldsForPatch(updates) {
  if (!updates || typeof updates !== 'object') {
    return;
  }
  if (!String(updates.metaAccessToken || '').trim()) {
    delete updates.metaAccessToken;
  }
  // Allow clearing test code: only strip if key missing; empty string clears
  if (updates.metaTestEventCode === undefined) {
    delete updates.metaTestEventCode;
  }
}
