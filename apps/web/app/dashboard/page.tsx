import { Activity, CalendarClock, ReceiptText, Server } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { getDashboardSummary, getServices } from '@/lib/api';

function getStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case 'running':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200';
    case 'deploying':
      return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200';
    case 'stopped':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-200';
    case 'suspended':
      return 'border-orange-400/20 bg-orange-400/10 text-orange-200';
    default:
      return 'border-red-400/20 bg-red-400/10 text-red-200';
  }
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const services = await getServices();

  const cards = [
    {
      label: 'Total Service Aktif',
      value: summary.activeServices,
      icon: Server,
      accent: 'from-cyan-500/20 to-cyan-500/5',
      iconColor: 'text-cyan-300',
    },
    {
      label: 'Total Invoice',
      value: summary.totalInvoices,
      icon: ReceiptText,
      accent: 'from-violet-500/20 to-violet-500/5',
      iconColor: 'text-violet-300',
    },
    {
      label: 'Expired Soon',
      value: summary.expiringSoon,
      icon: CalendarClock,
      accent: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-300',
    },
    {
      label: 'Aktivitas Terbaru',
      value: summary.recentActivity.length,
      icon: Activity,
      accent: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-300',
    },
  ];

  return (
    <>
      <header className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
          Dashboard
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[0.95] text-white md:text-6xl">
          Control room untuk seluruh layanan Anda.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/62 md:text-lg">
          Pantau subscription, invoice, aktivitas deploy, dan layanan yang akan expired dari satu halaman ringkas.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className={`relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-6`}
            >
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${card.accent} blur-2xl`} />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.24em] text-white/52">{card.label}</p>
                <p className="mt-3 text-5xl font-bold text-white">{card.value}</p>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-white">My Services</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              {services.length} service
            </span>
          </div>
          <div className="mt-5 grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.08]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">{service.name}</p>
                    <p className="mt-1 text-sm text-white/52">{service.productName}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusTone(service.status)}`}
                  >
                    {service.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-white/45">Expired: {service.expiresAt}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                    {service.domain ?? service.slug}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-7">
          <h2 className="text-3xl font-bold text-white">Riwayat Aktivitas</h2>
          <div className="mt-5 space-y-4">
            {summary.recentActivity.map((item) => (
              <div
                key={`${item.action}-${item.createdAt}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.08]"
              >
                <p className="text-sm font-semibold text-white">{item.action}</p>
                <p className="mt-2 text-sm text-white/52">{item.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
