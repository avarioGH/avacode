import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Settings</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Pengaturan Platform</h1>
      </div>

      <Card className="grid gap-5 border border-white/5 bg-white/5 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Nama Brand</label>
          <Input defaultValue="AVACODE" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Support Email</label>
          <Input defaultValue="halo@avacode.id" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Webhook Paydisini</label>
          <Input defaultValue="https://api.avacode.id/api/v1/billing/webhooks/paydisini" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Webhook Pakasir</label>
          <Input defaultValue="https://api.avacode.id/api/v1/billing/webhooks/pakasir" />
        </div>
        <div className="md:col-span-2">
          <Button className="bg-primary-gradient border-0 text-white">Simpan Pengaturan</Button>
        </div>
      </Card>
    </div>
  );
}
