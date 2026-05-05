'use client';

import { AuthProvider } from '@/context/AuthContext';
import { SpinProvider } from '@/context/SpinContext';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpinProvider>{children}</SpinProvider>
    </AuthProvider>
  );
}
