'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CreditCard, Grid2x2, LifeBuoy, Package2, User2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: Grid2x2 },
  { href: '/dashboard/services', label: 'My Services', icon: Package2 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/tutorial', label: 'Tutorial', icon: BookOpen },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
  { href: '/dashboard/profile', label: 'Profile', icon: User2 },
];

export function DashboardSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="rounded-[32px] border border-border bg-white/80 p-5 shadow-glow">
      <div className="mb-8 rounded-[28px] bg-[#0c3943] p-5 text-white">
        <p className="text-xs uppercase tracking-[0.28em] text-white/60">AutomationHub</p>
        <h2 className="mt-3 font-serif text-3xl leading-none">Ops Center</h2>
        <p className="mt-3 text-sm text-white/70">Kelola layanan, billing, dan deployment dari satu dashboard.</p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-[#0f4f5b] text-white'
                  : 'text-ink/70 hover:bg-[#edf3f1] hover:text-ink',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
