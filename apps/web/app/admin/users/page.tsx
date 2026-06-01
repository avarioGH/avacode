import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const users = [
  { name: 'PT. Teknologi Maju', email: 'ops@teknologimaju.id', plan: 'Dedicated VPS', status: 'Aktif' },
  { name: 'Budi Santoso', email: 'budi@gmail.com', plan: 'AI Automation Bot', status: 'Perlu Renewal' },
  { name: 'Kreatif Studio', email: 'it@kreatifstudio.com', plan: 'Custom Web Dev', status: 'Aktif' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Users</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Manajemen Klien</h1>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.email} className="flex flex-wrap items-center justify-between gap-4 border border-white/5 bg-white/5 p-6">
            <div>
              <p className="text-lg font-semibold text-white">{user.name}</p>
              <p className="mt-1 text-sm text-foreground-muted">{user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary/10 text-primary">{user.plan}</Badge>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                {user.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
