import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { Card } from '@/components/ui/card';

const payments = [
  { invoice: 'INV-20260601-A9K2', gateway: 'Paydisini', amount: 'Rp 399.000', status: 'SETTLED' },
  { invoice: 'INV-20260601-B1R8', gateway: 'Pakasir', amount: 'Rp 249.000', status: 'PENDING' },
  { invoice: 'INV-20260530-C7L1', gateway: 'Paydisini', amount: 'Rp 1.399.000', status: 'SETTLED' },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Payments</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Monitoring Pembayaran</h1>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.invoice} className="border border-white/5 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-white">{payment.invoice}</p>
                <p className="mt-1 text-sm text-foreground-muted">{payment.gateway}</p>
              </div>
              <div className="flex items-center gap-3 text-white">
                {payment.status === 'SETTLED' ? (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-yellow-400" />
                )}
                <span className="font-bold">{payment.amount}</span>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                {payment.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
