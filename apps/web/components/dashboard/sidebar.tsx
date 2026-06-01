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
    <aside className="rounded-[32px] border border-white/10 bg-[#0b1220]/92 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(13,72,84,0.95),rgba(9,35,48,0.9))] p-6 text-white shadow-[0_0_30px_rgba(34,211,238,0.08)]">
        <p className="text-xs uppercase tracking-[0.28em] text-white/55">AutomationHub</p>
        <h2 className="mt-4 font-display text-4xl font-bold leading-none">Ops Center</h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Kelola layanan, billing, dan deployment dari satu dashboard.
        </p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-cyan-200/90">
          Managed services live
        </div>
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
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200',
                isActive
                  ? 'border border-cyan-400/20 bg-cyan-400/12 text-white shadow-[0_0_24px_rgba(34,211,238,0.06)]'
                  : 'text-white/62 hover:bg-white/6 hover:text-white',
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-cyan-300' : 'text-white/42')} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
