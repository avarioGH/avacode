import type { ReactNode } from 'react';

import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}
