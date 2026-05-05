export const defaultSpinOptions = [
  {
    label: '10% OFF',
    type: 'percentage',
    value: 10,
    probability: 30,
    active: true,
    color: '#e11d48',
  },
  {
    label: '50 TK OFF',
    type: 'fixed',
    value: 50,
    probability: 20,
    active: true,
    color: '#f97316',
  },
  {
    label: 'No Discount',
    type: 'none',
    value: 0,
    probability: 50,
    active: true,
    color: '#111827',
  },
];

export const defaultSpinConfig = {
  popupEnabled: true,
  minDelaySeconds: 5,
  maxDelaySeconds: 20,
  showProbability: 0.5,
  exitIntentEnabled: true,
  sideImageUrl: '',
  popupTitle: 'Spin the wheel for a surprise discount',
  popupSubtitle: 'Try your luck once and unlock a verified reward for checkout.',
  popupButtonText: 'Spin Now',
  forceResultOptionId: null,
};
