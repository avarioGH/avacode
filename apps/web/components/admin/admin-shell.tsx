'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  ShieldCheck,
  CreditCard,
  Bell,
} from 'lucide-react';

import { ProtectedShell } from '@/components/auth/protected-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SESSION_STORAGE_KEY } from '@/lib/auth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Klien', icon: Users },
  { href: '/admin/products', label: 'Layanan / Produk', icon: Package },
  { href: '/admin/payments', label: 'Pembayaran', icon: CreditCard },
  { href: '/admin/announcements', label: 'Pengumuman', icon: Bell },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

function AdminShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    router.push('/login?mode=admin');
  };

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="hidden w-72 flex-col border-r border-white/5 bg-surface md:flex">
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-white">AVA Admin</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground-muted hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start rounded-xl px-4 py-3 text-foreground-muted hover:bg-red-500/10 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </Button>
        </div>
      </aside>

      <main className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/5 bg-surface/80 px-6 backdrop-blur-md md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Admin Control</p>
            <h2 className="font-display text-xl font-bold text-white">Panel Operasional AVACODE</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Owner / Admin
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-gradient text-sm font-bold text-white shadow-glow">
              AD
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedShell allowedRole="admin">
      <AdminShellFrame>{children}</AdminShellFrame>
    </ProtectedShell>
  );
}
