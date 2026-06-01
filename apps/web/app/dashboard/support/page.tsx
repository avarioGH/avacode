import { LifeBuoy, MessagesSquare, ShieldCheck, Wrench } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const supportModes = [
  {
    title: 'Deployment Error',
    description: 'Cocok untuk gagal deploy, restart loop, atau config yang tidak terbaca.',
    icon: Wrench,
  },
  {
    title: 'Billing & Renewal',
    description: 'Gunakan ini untuk invoice pending, renewal, atau layanan yang suspended.',
    icon: ShieldCheck,
  },
  {
    title: 'General Support',
    description: 'Untuk request setup, onboarding, dan pertanyaan operasional lainnya.',
    icon: MessagesSquare,
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
          Support
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[0.95] text-white md:text-6xl">
          Buat ticket dan minta bantuan.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/62 md:text-lg">
          Tulis konteks masalah Anda dengan jelas agar tim support bisa langsung menuju langkah diagnosis yang tepat.
        </p>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
              <LifeBuoy className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Kategori Ticket</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Pilih alur bantuan</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {supportModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-4 w-4 text-cyan-200" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{mode.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/55">{mode.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <form className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white">Subject</label>
              <Input placeholder="Deployment error, renewal issue, atau request setup" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white">Message</label>
              <Textarea placeholder="Jelaskan masalah atau permintaan Anda. Sertakan service name, status terakhir, dan apa yang sudah Anda coba." />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4">
              <p className="text-sm text-white/45">
                Tip: semakin spesifik detail masalahnya, semakin cepat ticket bisa diproses.
              </p>
              <Button className="rounded-full border-0 bg-primary-gradient px-6 text-white shadow-glow">
                Kirim Ticket
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
