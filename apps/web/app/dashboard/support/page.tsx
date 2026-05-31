import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Support</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Buat ticket dan minta bantuan.</h1>
      </header>

      <Card className="p-7">
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Subject</label>
            <Input placeholder="Deployment error, renewal issue, atau request setup" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Message</label>
            <Textarea placeholder="Jelaskan masalah atau permintaan Anda." />
          </div>
          <Button>Kirim Ticket</Button>
        </form>
      </Card>
    </div>
  );
}
