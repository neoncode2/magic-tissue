export function clampSpinValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSpinOptionPayload(input = {}) {
  const type = ['percentage', 'fixed', 'none'].includes(input.type) ? input.type : 'none';
  const value = type === 'none' ? 0 : Math.max(0, Number(input.value || 0));

  return {
    label: String(input.label || '').trim() || 'Reward',
    type,
    value,
    probability: Math.max(0, Number(input.probability || 0)),
    active: input.active !== false,
    color: String(input.color || '').trim(),
  };
}

export function normalizeSpinConfigPayload(input = {}) {
  const minDelaySeconds = clampSpinValue(Number(input.minDelaySeconds ?? 5), 0, 120);
  const maxDelaySeconds = clampSpinValue(Number(input.maxDelaySeconds ?? minDelaySeconds), minDelaySeconds, 120);

  return {
    popupEnabled: input.popupEnabled !== false,
    minDelaySeconds,
    maxDelaySeconds,
    reappearDelaySeconds: clampSpinValue(Number(input.reappearDelaySeconds ?? 30), 5, 600),
    showProbability: clampSpinValue(Number(input.showProbability ?? 0.5), 0, 1),
    exitIntentEnabled: input.exitIntentEnabled !== false,
    sideImageUrl: String(input.sideImageUrl || '').trim(),
    popupTitle: String(input.popupTitle || '').trim() || 'Spin the wheel for a surprise discount',
    popupSubtitle:
      String(input.popupSubtitle || '').trim() || 'Try your luck once and unlock a verified reward for checkout.',
    popupButtonText: String(input.popupButtonText || '').trim() || 'Spin Now',
    forceResultOptionId: input.forceResultOptionId || null,
  };
}

export function pickWeightedReward(options) {
  const weighted = options.filter((option) => option.active !== false && Number(option.probability) > 0);

  if (weighted.length === 0) {
    return null;
  }

  const totalWeight = weighted.reduce((sum, option) => sum + Number(option.probability), 0);
  let cursor = Math.random() * totalWeight;

  for (const option of weighted) {
    cursor -= Number(option.probability);

    if (cursor <= 0) {
      return option;
    }
  }

  return weighted[weighted.length - 1];
}
