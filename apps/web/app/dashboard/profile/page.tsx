import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Profile</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Kelola identitas akun.</h1>
      </header>

      <Card className="p-7">
        <form className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Nama</label>
            <Input defaultValue="Automation Owner" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Email</label>
            <Input defaultValue="owner@automationhub.local" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink">Avatar URL</label>
            <Input placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Button>Simpan Profil</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
