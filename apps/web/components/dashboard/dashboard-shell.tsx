'use client';

import { ProtectedShell } from '@/components/auth/protected-shell';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedShell allowedRole="client">
      {children}
    </ProtectedShell>
  );
}
