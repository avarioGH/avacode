import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 md:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground-muted">Portal Klien</p>
          <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight text-white">Masuk ke Dasbor<br/>Operasional.</h1>
          <p className="max-w-xl text-base leading-8 text-foreground-muted">
            Gunakan email terdaftar Anda untuk mengelola seluruh layanan, tagihan, serta memantau status VPS dan otomatisasi AI secara real-time.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Email Akses</label>
              <Input type="email" placeholder="email@perusahaan.com" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Kata Sandi</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full h-14 bg-primary-gradient border-0 text-white font-bold text-lg rounded-full shadow-glow mt-4">Masuk ke Dasbor</Button>
            <Button className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-lg rounded-full" type="button">
              Lanjut dengan Google
            </Button>
          </form>
          <p className="mt-8 text-sm text-foreground-muted text-center">
            Belum menjadi klien? <Link href="/register" className="font-bold text-primary hover:text-purple transition-colors">Daftar sekarang</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
