import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CirclePlay, CheckCircle2, Zap, LayoutGrid } from 'lucide-react';

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
    <main className="mx-auto max-w-7xl px-6 py-24 md:px-10 min-h-screen relative selection:bg-primary selection:text-white">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mesh opacity-40 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-glow group mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.thumbnailUrl})` }}
        />
        <div className="relative z-20 p-8 md:p-14 md:pt-32">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" /> Product Detail
          </p>
          <h1 className="max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            {product.name}
          </h1>
          <p className="max-w-2xl text-lg text-white/70 leading-relaxed mb-8">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-glow rounded-full px-8 h-12 hover:scale-105 transition-all">
                Mulai Sekarang
              </Button>
            </Link>
            <a href={product.demoUrl}>
              <Button variant="secondary" className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-full px-8 h-12 transition-all">
                <CirclePlay className="mr-2 h-5 w-5" />
                Lihat Demo
              </Button>
            </a>
          </div>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_400px] relative z-10">
        <div className="space-y-8">
          {/* Fitur Utama */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">Fitur Utama</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Wizard */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h2 className="text-2xl font-bold text-white mb-6">Setup Wizard Flow</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.setupFields.map((field, index) => (
                <div key={field} className="relative rounded-2xl border border-white/10 bg-background/50 p-5 overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Step {index + 1}</p>
                  <p className="text-sm font-semibold text-white relative z-10">{field}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h2 className="text-2xl font-bold text-white mb-6">FAQ Layanan</h2>
            <div className="grid gap-4">
              {product.faq.length ? (
                product.faq.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                    <h3 className="text-base font-bold text-white mb-2">{item.question}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{item.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/50 italic bg-white/5 p-4 rounded-xl">FAQ khusus produk ini bisa ditambahkan dari panel admin.</p>
              )}
            </div>
          </div>
        </div>

        {/* Paket Langganan Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-glow sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Paket Langganan
            </h2>
            <div className="space-y-4 mb-8">
              {product.packages.map((pkg) => (
                <label key={pkg.code} className="block cursor-pointer">
                  <div className={`relative rounded-2xl border p-5 transition-all duration-300 ${pkg.popular ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(138,43,226,0.15)]' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 right-4">
                        <span className="rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                          Paling Laku
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{pkg.durationLabel}</p>
                    </div>
                    <p className="text-2xl font-extrabold text-white">
                      {currency.format(pkg.price)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            
            <Link href="/register" className="w-full block">
              <Button className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02]">
                Lanjut Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
