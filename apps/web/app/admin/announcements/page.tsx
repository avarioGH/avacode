import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Announcements</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Broadcast & Pengumuman</h1>
      </div>

      <Card className="space-y-5 border border-white/5 bg-white/5 p-6">
        <div>
          <p className="text-sm font-semibold text-white">Pesan Global</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Gunakan area ini untuk maintenance notice, promo renewal, atau update sistem.
          </p>
        </div>
        <Textarea placeholder="Tulis pengumuman untuk seluruh customer..." />
        <Button className="bg-primary-gradient border-0 text-white">Kirim Pengumuman</Button>
      </Card>
    </div>
  );
}
