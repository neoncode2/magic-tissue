'use client';

import { useSpin } from '@/context/SpinContext';
import SpinWheelPopup from '@/components/spin/SpinWheelPopup';

export default function SpinWheelMount() {
  const { config } = useSpin();

  if (!config?.popupEnabled) {
    return null;
  }

  return <SpinWheelPopup />;
}
