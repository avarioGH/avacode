import type { ReactNode } from 'react';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>
      <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute bottom-[5%] right-[-5%] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[140px]" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <DashboardSidebar />
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </DashboardShell>
  );
}
