import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Globe,
  MailCheck,
  Send,
  Package2,
  Sparkles,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { products } from '@/lib/site-data';

const productIcons: Record<string, typeof Bot> = {
  TELEGRAM_AUTO_ORDER: Bot,
  TELEGRAM_FORWARD: Send,
  DIGITAL_PRODUCT_SITE: Globe,
  PHYSICAL_PRODUCT_SITE: Package2,
  EMAIL_OTP_SITE: MailCheck,
  TELEGRAM_OTP_EMAIL_DOMAIN: Sparkles,
};

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
          Tutorial
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[0.95] text-white md:text-6xl">
          Panduan setup per produk.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/62 md:text-lg">
          Buka langkah input, pahami field penting, lalu arahkan customer dari checkout ke deploy tanpa perlu menyentuh server.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        {products.map((product) => {
          const Icon = productIcons[product.kind] ?? Sparkles;

          return (
            <Card
              key={product.slug}
              className="overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.95),rgba(10,16,31,0.82))] p-0 transition duration-300 hover:border-cyan-400/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            >
              <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/62">
                        {product.shortDescription}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    {product.setupFields.length} langkah
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">Field Setup</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {product.setupFields.map((field, index) => (
                      <span
                        key={field}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/78"
                      >
                        {index + 1}. {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Mulai Harga</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(product.startingPrice)}
                    </p>
                  </div>

                  <Link
                    href={`/services/${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                  >
                    Buka detail produk
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
