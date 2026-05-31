import { Card } from '@/components/ui/card';
import { getInvoices } from '@/lib/api';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default async function BillingPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Billing</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Invoice dan renewal.</h1>
      </header>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.invoiceNumber} className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-ink">{invoice.invoiceNumber}</p>
              <p className="mt-1 text-sm text-ink/58">{invoice.createdAt}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-ink/66">
              <span>{currency.format(invoice.amount)}</span>
              <span>{invoice.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
