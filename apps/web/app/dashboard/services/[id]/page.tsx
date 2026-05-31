import { notFound } from 'next/navigation';

import { SetupWizard } from '@/components/dashboard/setup-wizard';
import { Card } from '@/components/ui/card';
import { getService } from '@/lib/api';

export default async function DashboardServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Service Detail</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">{service.name}</h1>
        <p className="mt-4 text-base leading-8 text-ink/68">
          Status {service.status}, expiring {service.expiresAt}. Kelola konfigurasi, deploy, restart, dan renewal dari halaman ini.
        </p>
      </header>

      <SetupWizard service={service} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-7">
          <h2 className="text-2xl font-semibold text-ink">Runtime Snapshot</h2>
          <div className="mt-5 space-y-3 text-sm text-ink/68">
            <p>Service slug: {service.slug}</p>
            <p>Product: {service.productName}</p>
            <p>Domain: {service.domain ?? 'Belum diisi'}</p>
            <p>Current status: {service.status}</p>
          </div>
        </Card>
        <Card className="p-7">
          <h2 className="text-2xl font-semibold text-ink">Support & Tutorial</h2>
          <p className="mt-4 text-sm leading-7 text-ink/68">
            Dari endpoint backend, halaman ini dapat diperluas untuk menampilkan tutorial produk, riwayat deployment, dan support ticket per layanan.
          </p>
        </Card>
      </div>
    </div>
  );
}
