import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 md:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground-muted">Pendaftaran</p>
          <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight text-white">Mulai Bangun<br/>Masa Depan Anda.</h1>
          <p className="max-w-xl text-base leading-8 text-foreground-muted">
            Daftarkan diri Anda sekarang untuk mendapatkan akses instan ke seluruh infrastruktur dan layanan AVACODE. Mulai dari VPS, otomatisasi, hingga integrasi AI.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Nama Lengkap</label>
              <Input placeholder="Nama Anda atau Perusahaan" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Email</label>
              <Input type="email" placeholder="email@perusahaan.com" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Password</label>
              <Input type="password" placeholder="Minimal 8 karakter" />
            </div>
            <Button className="w-full h-14 bg-primary-gradient border-0 text-white font-bold text-lg rounded-full shadow-glow">Buat Akun</Button>
          </form>
          <p className="mt-8 text-sm text-foreground-muted text-center">
            Sudah punya akun? <Link href="/login" className="font-bold text-primary hover:text-purple transition-colors">Masuk di sini</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
