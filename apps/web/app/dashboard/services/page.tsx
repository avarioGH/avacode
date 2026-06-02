import Link from 'next/link';
import { Bot, Settings, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServices } from '@/lib/api';

export default async function DashboardServicesPage() {
  // Using static mock if api fails
  let services = [];
  try {
    services = await getServices();
  } catch (e) {
    services = [
      { id: 'srv-123456', name: 'Bot Otomatis Toko', productName: 'Bot Auto Order Telegram', status: 'Pending Setup', expiresAt: '2027-01-01' }
    ];
  }

  return (
    <div className="space-y-8">
      <header className="glass-panel border border-white/5 bg-surface/50 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted mb-2">My Services</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">Layanan & Bot Anda.</h1>
      </header>

      <div className="grid gap-4">
        {services.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
            <p className="text-foreground-muted">Belum ada layanan yang aktif.</p>
          </div>
        )}
        
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-6 p-6 border-white/10 bg-surface/80 hover:bg-surface transition-colors shadow-none rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{service.name}</p>
                <p className="mt-1 text-sm text-foreground-muted flex items-center gap-2">
                  <span>{service.productName}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-mono text-xs">ID: {service.id}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-foreground-muted w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider mb-1 opacity-60">Status</span>
                {service.status === 'Pending Setup' ? (
                  <span className="text-orange-400 font-bold flex items-center gap-1.5 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20 text-xs">
                    <Zap className="w-3 h-3" /> PENDING SETUP
                  </span>
                ) : (
                  <span className="text-success font-bold flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded border border-success/20 text-xs">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> ONLINE
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider mb-1 opacity-60">Kedaluwarsa</span>
                <span className="font-mono">{service.expiresAt || '-'}</span>
              </div>
              
              <Link href={`/dashboard/services/${service.id}`} className="ml-auto sm:ml-4">
                <Button variant="secondary" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-10 px-4 rounded-xl flex items-center gap-2 transition-all">
                  <Settings className="w-4 h-4" /> Setup / Manage
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
