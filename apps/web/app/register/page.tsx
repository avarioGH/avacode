import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 md:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-ink/48">Create Account</p>
          <h1 className="font-serif text-6xl leading-none text-ink">Bangun workspace pertama Anda.</h1>
          <p className="max-w-xl text-base leading-8 text-ink/68">
            Registrasi akan membuat tenant default agar customer bisa langsung checkout, setup layanan, dan deploy dari dashboard.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nama Lengkap</label>
              <Input placeholder="Nama owner atau brand" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Email</label>
              <Input type="email" placeholder="owner@brand.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Password</label>
              <Input type="password" placeholder="Minimal 8 karakter" />
            </div>
            <Button className="w-full">Buat Akun</Button>
          </form>
          <p className="mt-6 text-sm text-ink/62">
            Sudah punya akun? <Link href="/login" className="font-semibold text-accentStrong">Masuk</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
