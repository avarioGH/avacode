import { Activity, CalendarClock, ReceiptText, Server } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { getDashboardSummary, getServices } from '@/lib/api';

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const services = await getServices();

  const cards = [
    { label: 'Total Service Aktif', value: summary.activeServices, icon: Server },
    { label: 'Total Invoice', value: summary.totalInvoices, icon: ReceiptText },
    { label: 'Expired Soon', value: summary.expiringSoon, icon: CalendarClock },
    { label: 'Aktivitas Terbaru', value: summary.recentActivity.length, icon: Activity },
  ];

  return (
    <>
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Dashboard</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Control room untuk seluruh layanan Anda.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-ink/68">
          Pantau subscription, invoice, aktivitas deploy, dan layanan yang akan expired dari satu halaman ringkas.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-6">
              <Icon className="h-5 w-5 text-accentStrong" />
              <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ink/45">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold text-ink">{card.value}</p>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-7">
          <h2 className="text-2xl font-semibold text-ink">My Services</h2>
          <div className="mt-5 grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="rounded-[28px] bg-[#f6f0e5] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{service.name}</p>
                    <p className="mt-1 text-sm text-ink/62">{service.productName}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accentStrong">
                    {service.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-ink/60">Expired: {service.expiresAt}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-7">
          <h2 className="text-2xl font-semibold text-ink">Riwayat Aktivitas</h2>
          <div className="mt-5 space-y-4">
            {summary.recentActivity.map((item) => (
              <div key={`${item.action}-${item.createdAt}`} className="rounded-[24px] border border-border bg-white/70 p-4">
                <p className="text-sm font-medium text-ink">{item.action}</p>
                <p className="mt-2 text-sm text-ink/58">{item.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
