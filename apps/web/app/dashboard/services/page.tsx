import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { getServices } from '@/lib/api';

export default async function DashboardServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">My Services</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Semua layanan customer Anda.</h1>
      </header>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-wrap items-center justify-between gap-6 p-6">
            <div>
              <p className="text-xl font-semibold text-ink">{service.name}</p>
              <p className="mt-1 text-sm text-ink/60">{service.productName}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-ink/62">
              <span>Status: {service.status}</span>
              <span>Expired: {service.expiresAt}</span>
              <Link href={`/dashboard/services/${service.id}`} className="font-semibold text-accentStrong">
                Setup / Manage
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
