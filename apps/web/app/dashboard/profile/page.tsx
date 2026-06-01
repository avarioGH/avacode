import { BadgeCheck, Camera, Shield, UserRound } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
          Profile
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[0.95] text-white md:text-6xl">
          Kelola identitas akun.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/62 md:text-lg">
          Perbarui identitas owner, alamat email utama, dan tampilan avatar yang dipakai di dashboard operasional Anda.
        </p>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
              <UserRound className="h-10 w-10 text-cyan-200" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">Automation Owner</h2>
            <p className="mt-2 text-sm text-white/52">owner@automationhub.local</p>

            <div className="mt-6 grid w-full gap-3">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  Email verified
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  Session role: client
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Camera className="h-4 w-4 text-violet-300" />
                  Avatar source: custom URL
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <form className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white">Nama</label>
              <Input defaultValue="Automation Owner" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white">Email</label>
              <Input defaultValue="owner@automationhub.local" />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-semibold text-white">Avatar URL</label>
              <Input placeholder="https://..." />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-semibold text-white">Company / Workspace</label>
              <Input defaultValue="AutomationHub Workspace" />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4">
              <p className="text-sm text-white/45">
                Simpan perubahan untuk memperbarui identitas yang tampil di dashboard dan panel support.
              </p>
              <Button className="rounded-full border-0 bg-primary-gradient px-6 text-white shadow-glow">
                Simpan Profil
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
