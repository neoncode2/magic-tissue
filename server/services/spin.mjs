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

export function calculateDiscountAmount(basePrice, discount) {
  const safeBasePrice = Math.max(0, Number(basePrice || 0));

  if (!discount || discount.type === 'none') {
    return 0;
  }

  if (discount.type === 'percentage') {
    return Math.min(safeBasePrice, Math.round((safeBasePrice * Number(discount.value || 0)) / 100));
  }

  if (discount.type === 'fixed') {
    return Math.min(safeBasePrice, Math.max(0, Number(discount.value || 0)));
  }

  return 0;
}
