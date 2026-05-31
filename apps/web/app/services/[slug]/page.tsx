import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CirclePlay } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getProduct } from '@/lib/api';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <div
        className="rounded-[42px] border border-border bg-cover bg-center p-8 text-white md:p-12"
        style={{ backgroundImage: `linear-gradient(rgba(9, 40, 47, 0.45), rgba(9, 40, 47, 0.58)), url(${product.thumbnailUrl})` }}
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/70">Product Detail</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-none md:text-6xl">{product.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">{product.description}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/register">
            <Button>Mulai Sekarang</Button>
          </Link>
          <a href={product.demoUrl}>
            <Button variant="secondary">
              <CirclePlay className="mr-2 h-4 w-4" />
              Lihat Demo
            </Button>
          </a>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Fitur Utama</p>
            <div className="mt-4 grid gap-3">
              {product.features.map((feature) => (
                <div key={feature} className="rounded-2xl bg-[#f6f0e5] px-4 py-3 text-sm text-ink/76">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Setup Wizard</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {product.setupFields.map((field, index) => (
                <div key={field} className="rounded-3xl border border-border bg-white/75 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{field}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/45">FAQ</p>
            <div className="mt-4 grid gap-4">
              {product.faq.length ? (
                product.faq.map((item) => (
                  <div key={item.question} className="rounded-3xl border border-border bg-white/75 p-5">
                    <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/68">{item.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/62">FAQ khusus produk ini bisa ditambahkan dari panel admin.</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Paket Langganan</p>
          {product.packages.map((pkg) => (
            <div key={pkg.code} className="rounded-[28px] border border-border bg-white/75 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-ink">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-ink/58">{pkg.durationLabel}</p>
                </div>
                {pkg.popular ? (
                  <span className="rounded-full bg-[#0f5560] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Paling Laku
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-3xl font-semibold text-ink">{currency.format(pkg.price)}</p>
            </div>
          ))}
          <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-accentStrong">
            Lanjut checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </main>
  );
}
