import Link from 'next/link';
import { ArrowRight, CirclePlay, ShieldCheck, Sparkles, Workflow, Zap, Lock, Code } from 'lucide-react';

import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getProducts } from '@/lib/api';
import { faqItems, testimonials } from '@/lib/site-data';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="noise-overlay overflow-hidden min-h-screen bg-background selection:bg-primary selection:text-white relative">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[800px] bg-mesh opacity-60 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between md:px-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Code className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
              avacode.id
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-40 pb-16 md:px-10 md:pt-48 md:pb-24 flex flex-col items-center text-center">
        <div className="animate-fade-in space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase shadow-[0_0_15px_rgba(138,43,226,0.15)] backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>Setup otomatis tanpa akses VPS</span>
          </div>
          
          <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 animate-slide-up leading-[1.1]">
            Jual layanan otomatis. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Bukan jual source code.
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-white/60 font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Avacode.id membantu seller Telegram, OTP, produk digital, dan commerce menjual layanan berbasis langganan dengan setup instan.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register">
              <Button className="h-14 px-8 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-full shadow-glow text-white font-semibold transition-all duration-300 hover:scale-105">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" className="h-14 px-8 text-base rounded-full border-white/20 hover:bg-white/5 font-semibold backdrop-blur-md text-white transition-all duration-300 hover:border-white/40">
                <CirclePlay className="mr-2 h-5 w-5" />
                Lihat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 relative z-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Produk Aktif', value: '6+ Layanan Premium' },
            { label: 'Model Bisnis', value: 'Subscription SaaS' },
            { label: 'Runtime Infrastructure', value: 'Docker Engine' },
          ].map((metric, i) => (
            <div key={metric.label} className="glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 group">
              <p className="text-sm font-medium tracking-wider text-primary/80 uppercase mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-white group-hover:text-accent transition-colors">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow & Features */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="glass-panel rounded-[40px] p-8 md:p-12 overflow-hidden relative border border-white/10 shadow-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
          <div className="relative grid lg:grid-cols-[1fr_1.5fr] gap-12">
            <div className="space-y-6">
              <div className="inline-block rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Deploy Flow
                </p>
                <ul className="space-y-4 text-sm text-white/80 font-medium">
                  <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">1</span> Customer pilih produk & paket</li>
                  <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">2</span> Webhook bayar aktifkan subscription</li>
                  <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">3</span> Setup wizard generate config otomatis</li>
                  <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">4</span> Docker container langsung aktif</li>
                </ul>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="glass-panel rounded-3xl p-8 hover:bg-white/[0.05] transition-colors border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Tanpa Coding</h3>
                <p className="text-sm text-white/60 leading-relaxed">Wizard input simpel untuk token, domain, SMTP, API key, dan branding. Langsung jalan.</p>
              </div>
              <div className="glass-panel rounded-3xl p-8 hover:bg-white/[0.05] transition-colors border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6">
                  <Workflow className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Auto Renewal</h3>
                <p className="text-sm text-white/60 leading-relaxed">Layanan otomatis suspended jika expired, dan langsung aktif lagi setelah renewal dibayar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Services</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Layanan Siap Jual.</h2>
          <p className="text-white/60 text-lg">Setiap produk punya halaman detail elegan, paket langganan, setup wizard, dan lifecycle deploy otomatis.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.slug} className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-glow flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${product.thumbnailUrl})` }}
                />
              </div>
              <div className="relative z-20 p-8 -mt-10 flex-1 flex flex-col bg-background/50 backdrop-blur-md rounded-t-3xl border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.startingPrice)}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-6 flex-1 leading-relaxed">{product.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70 font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
                <Link href={`/services/${product.slug}`} className="w-full">
                  <Button className="w-full bg-white/5 hover:bg-primary text-white border border-white/10 transition-all group-hover:border-primary">
                    Lihat Detail
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" id="demo">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-[40px] p-10 md:p-14 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform">
                <CirclePlay className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">Dashboard-first<br/>setup experience.</h3>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Platform telah dilengkapi dengan demo interaktif. Uji coba flow pendaftaran hingga simulasi deployment secara real-time.
              </p>
              <a href="https://demo.avacode.id" className="inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                Buka Demo Sandbox
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="grid gap-6">
            {[
              { icon: Zap, title: 'Setup Otomatis', body: 'Generate config, env, runtime folder, container metadata, dan deployment log dalam hitungan detik.' },
              { icon: Code, title: 'Dashboard Lengkap', body: 'Ringkasan layanan aktif, billing, tutorial, support, dan status deploy terpusat.' },
              { icon: Lock, title: 'Support & Audit', body: 'Admin punya kendali penuh ke deployments, log error, dan analitik revenue.' },
            ].map((feature) => (
              <div key={feature.title} className="glass-panel rounded-3xl p-8 flex gap-6 items-start border border-white/5 hover:border-white/20 transition-colors">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Dipercaya Seller Pro.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.name} className="glass-panel rounded-3xl p-10 border border-white/10 relative">
              <div className="absolute top-10 right-10 text-6xl text-white/5 font-serif">"</div>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 mb-8 font-medium">“{item.quote}”</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                <div>
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Verified Seller</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Pertanyaan Umum</h2>
          <p className="text-white/60">Jawaban cepat untuk hal-hal yang sering ditanyakan.</p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 hover:border-white/20 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3">{item.question}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg mt-20 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-6 px-6 py-12 md:px-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Code className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">avacode.id</span>
          </div>
          <p className="text-sm text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} avacode.id. Premium managed automation subscriptions.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/register" className="text-white/60 hover:text-white transition-colors">Mulai</Link>
            <Link href="/login" className="text-white/60 hover:text-white transition-colors">Login</Link>
            <Link href="#demo" className="text-white/60 hover:text-white transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
