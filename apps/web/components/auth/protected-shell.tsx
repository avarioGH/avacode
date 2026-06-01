'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import type { DemoSession } from '@/lib/auth';
import { SESSION_STORAGE_KEY } from '@/lib/auth';

export function ProtectedShell({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: 'admin' | 'client';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [ready, setReady] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  useEffect(() => {
    const loginTarget = `/login?mode=${allowedRole}&next=${encodeURIComponent(pathname)}`;
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      setRedirectTarget(loginTarget);
      return;
    }

    try {
      const parsed = JSON.parse(rawSession) as DemoSession;

      if (parsed.role !== allowedRole) {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        setRedirectTarget(loginTarget);
        return;
      }

      setSession(parsed);
      setReady(true);
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setRedirectTarget(loginTarget);
    }
  }, [allowedRole, pathname, router]);

  useEffect(() => {
    if (!redirectTarget) {
      return;
    }

    router.replace(redirectTarget);

    const timeoutId = window.setTimeout(() => {
      window.location.replace(redirectTarget);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [redirectTarget, router]);

  const loadingCopy = useMemo(
    () =>
      allowedRole === 'admin'
        ? 'Memuat panel admin...'
        : 'Memuat dashboard klien...',
    [allowedRole],
  );

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
          <p className="text-sm text-foreground-muted">
            {redirectTarget ? 'Mengarahkan ke halaman yang sesuai...' : loadingCopy}
          </p>
          <Link
            href={redirectTarget ?? '/login'}
            className="text-sm font-semibold text-primary"
          >
            {redirectTarget ? 'Buka halaman tujuan' : 'Kembali ke login'}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
