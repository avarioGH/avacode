'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DEMO_CREDENTIALS, findDemoCredential, SESSION_STORAGE_KEY, toSession } from '@/lib/auth';

export function LoginForm({
  mode,
  nextPath,
}: {
  mode: 'admin' | 'client';
  nextPath?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === 'admin' ? 'admin@avacode.id' : 'client@avacode.id');
  const [password, setPassword] = useState(mode === 'admin' ? 'Admin123!' : 'Client123!');
  const [error, setError] = useState('');

  const credentials = useMemo(
    () => DEMO_CREDENTIALS.filter((credential) => credential.role === mode),
    [mode],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const matched = findDemoCredential(email, password);

    if (!matched || matched.role !== mode) {
      setError('Email atau kata sandi tidak cocok untuk portal ini.');
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(toSession(matched)));
    router.push(nextPath || matched.redirectTo);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 md:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
            {mode === 'admin' ? <ShieldCheck className="h-4 w-4 text-primary" /> : <UserRound className="h-4 w-4 text-primary" />}
            {mode === 'admin' ? 'Portal Admin' : 'Portal Klien'}
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            {mode === 'admin' ? 'Masuk ke panel admin.' : 'Masuk ke dasbor operasional.'}
          </h1>
          <p className="max-w-xl text-base leading-8 text-foreground-muted">
            Saya sudah aktifkan login demo berbasis sesi lokal agar Anda bisa langsung menguji alur admin dan klien tanpa backend auth penuh.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {credentials.map((credential) => (
              <Card key={credential.email} className="border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">{credential.label}</p>
                <p className="mt-3 text-sm font-semibold text-white">{credential.email}</p>
                <p className="mt-2 text-sm text-foreground-muted">Password: <span className="font-mono text-white">{credential.password}</span></p>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/login?mode=client" className={mode === 'client' ? 'font-bold text-primary' : 'text-foreground-muted hover:text-white'}>
              Masuk sebagai klien
            </Link>
            <Link href="/login?mode=admin" className={mode === 'admin' ? 'font-bold text-primary' : 'text-foreground-muted hover:text-white'}>
              Masuk sebagai admin
            </Link>
          </div>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Email Akses</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@perusahaan.com"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Kata Sandi</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <Button className="mt-4 h-14 w-full rounded-full border-0 bg-primary-gradient text-lg font-bold text-white shadow-glow">
              {mode === 'admin' ? 'Masuk ke Panel Admin' : 'Masuk ke Dasbor'}
            </Button>
            <Button
              className="h-14 w-full rounded-full border border-white/10 bg-white/5 text-lg font-bold text-white hover:bg-white/10"
              type="button"
              variant="ghost"
              onClick={() => {
                const preset = credentials[0];
                setEmail(preset.email);
                setPassword(preset.password);
                setError('');
              }}
            >
              Isi kredensial demo otomatis
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-foreground-muted">
            Belum menjadi klien?{' '}
            <Link href="/register" className="font-bold text-primary hover:text-purple transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
