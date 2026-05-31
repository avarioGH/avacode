'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Server, Database, Cloud, Zap, CheckCircle2, Bot, Shield, Layers, Code, HardDrive, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="relative overflow-hidden min-h-screen bg-background text-foreground font-sans">
      
      {/* PREMIUM LAYERED BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple/20 rounded-[100%] blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-[100%] blur-[150px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-nav h-20 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between md:px-10">
          <Link href="/" className="flex items-center gap-3 group z-50">
            <img src="/logo.png" alt="AVACODE Logo" className="h-10 w-auto drop-shadow-glow transition-transform duration-300 group-hover:scale-105" />
          </Link>
          
          <div className="hidden md:flex gap-10 items-center">
            {['Produk', 'Infrastruktur', 'Sistem AI', 'Harga'].map(item => (
              <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-foreground-muted hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium text-foreground-muted hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register">
              <Button className="h-10 px-6 rounded-full bg-primary-gradient border-0 text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-glow">
                Mulai Sekarang
              </Button>
            </Link>
          </div>

          <button className="md:hidden z-50 text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              {['Produk', 'Infrastruktur', 'Sistem AI', 'Harga'].map(item => (
                <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary transition-colors border-b border-white/5 pb-4">
                  {item}
                </Link>
              ))}
              <Link href="/login" className="text-white hover:text-primary transition-colors border-b border-white/5 pb-4" onClick={() => setMobileMenuOpen(false)}>Masuk (Login)</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-14 mt-4 rounded-xl bg-primary-gradient text-white text-lg">Mulai Sekarang</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-32 pb-16">
        
        {/* 1. HERO SECTION (2-COLUMN) */}
        <section className="mx-auto max-w-7xl px-6 pt-12 md:pt-24 pb-16 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTA */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Infrastruktur AI Enterprise</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-[42px] leading-[1.1] md:text-6xl lg:text-[84px] font-display font-bold tracking-tighter text-white mb-6 relative">
                Bangun Pintar.<br />
                <span className="gradient-text drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  Skala Cepat.
                </span>
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 opacity-30 animate-pulse-slow" />
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="max-w-xl text-lg md:text-xl text-foreground-muted font-medium mb-10 leading-relaxed">
                Otomatisasi, kecerdasan buatan (AI), dan solusi perangkat lunak khusus untuk bisnis modern. Kami merancang, menerapkan, dan mengelola infrastruktur kritis Anda dengan SLA 99.99%.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="#produk" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 text-base bg-primary-gradient rounded-full shadow-glow text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-strong">
                    Jelajahi Produk
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-white/15 bg-white/5 hover:bg-white/10 font-bold backdrop-blur-md text-white transition-all duration-300">
                    Daftar Klien Baru
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Mockup / AI Automation Workflow Visualization */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block h-[500px] w-full"
            >
              {/* Abstract Dashboard Visual */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 via-purple/5 to-transparent blur-3xl -z-10" />
              
              <div className="relative w-full h-full perspective-1000">
                <div className="w-full h-full glass-panel rounded-2xl border border-white/10 shadow-glass overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-0 flex flex-col p-4 animate-float">
                  
                  {/* Mockup Header */}
                  <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>

                  {/* Mockup Body: Flow visual */}
                  <div className="flex-1 flex gap-4">
                    <div className="w-1/3 bg-surface rounded-xl p-4 border border-white/5 space-y-4">
                      <div className="h-2 w-1/2 bg-white/10 rounded" />
                      <div className="h-10 w-full bg-primary/10 rounded flex items-center px-3 border border-primary/20"><Bot className="w-4 h-4 text-primary mr-2"/> Agen AI / LLM</div>
                      <div className="h-10 w-full bg-white/5 rounded flex items-center px-3"><Database className="w-4 h-4 text-white/50 mr-2"/> Vector Database</div>
                      <div className="h-10 w-full bg-white/5 rounded flex items-center px-3"><Terminal className="w-4 h-4 text-white/50 mr-2"/> Edge Function</div>
                    </div>
                    <div className="flex-1 bg-surface rounded-xl p-4 border border-white/5 flex flex-col relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-32 h-32 bg-purple/20 blur-2xl" />
                       <div className="flex items-center justify-between mb-8">
                         <div className="h-4 w-1/3 bg-white/10 rounded" />
                         <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"/>Live</span>
                       </div>
                       
                       <div className="flex-1 border border-white/5 rounded-lg flex items-center justify-center relative">
                          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 20 50 C 60 50, 40 120, 150 100" stroke="rgba(22, 119, 255, 0.5)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                          </svg>
                          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 z-10 shadow-glow">
                             <Zap className="w-8 h-8 text-primary" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. TRUST SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-6 py-12 md:px-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Uptime SLA', value: '99.9%', icon: Globe, color: 'text-success' },
              { label: 'Deployments', value: '500+', icon: Cloud, color: 'text-primary' },
              { label: 'Pemantauan', value: '24/7', icon: Server, color: 'text-purple' },
              { label: 'Keamanan', value: 'Enterprise', icon: Shield, color: 'text-accent' },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center justify-center border border-white/5 hover:border-white/10 transition-colors">
                <stat.icon className={`w-6 h-6 mb-3 ${stat.color} opacity-80`} />
                <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-xs md:text-sm text-foreground-muted uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 3. PRODUCT SALES GRID (6 PRODUCTS) */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="produk">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Layanan & Produk Kami</h2>
            <p className="text-foreground-muted text-lg">Solusi teknologi komprehensif yang dirancang untuk mempercepat pertumbuhan bisnis Anda melalui *engineering* superior.</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { title: 'Dedicated VPS Hosting', icon: Server, desc: 'Server super cepat dengan sumber daya terdedikasi untuk aplikasi skala besar.', price: 'Rp 499.000', glow: 'shadow-[0_0_30px_rgba(22,119,255,0.15)]' },
              { title: 'Custom Web Dev', icon: Code, desc: 'Pembuatan website dan aplikasi web yang disesuaikan persis dengan alur bisnis Anda.', price: 'Rp 2.500.000', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' },
              { title: 'AI Automation Bot', icon: Bot, desc: 'Bot cerdas untuk mengotomatiskan balasan pelanggan dan tugas repetitif harian.', price: 'Rp 899.000', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]' },
              { title: 'Backend API System', icon: Terminal, desc: 'Pengembangan API tangguh untuk menghubungkan berbagai platform digital Anda.', price: 'Rp 1.200.000', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
              { title: 'Database Management', icon: Database, desc: 'Pengelolaan dan optimasi database dengan backup harian & keamanan tingkat tinggi.', price: 'Rp 650.000', glow: 'shadow-[0_0_30px_rgba(22,119,255,0.15)]' },
              { title: 'SaaS Infrastructure', icon: Cloud, desc: 'Infrastruktur cloud lengkap untuk menjalankan software-as-a-service (SaaS) Anda.', price: 'Rp 1.500.000', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' },
            ].map((product, idx) => (
              <motion.div 
                key={product.title} 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className={`glass-panel rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full ${product.glow}`}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <product.icon className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3 leading-tight">{product.title}</h3>
                  <p className="text-sm md:text-base text-foreground-muted leading-relaxed flex-1">{product.desc}</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-col">
                    <span className="text-xs text-foreground-muted mb-1 uppercase tracking-wider">Mulai dari</span>
                    <span className="text-lg md:text-2xl font-display font-bold text-primary">{product.price} <span className="text-sm text-foreground-muted font-normal">/ bln</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. INFRASTRUCTURE SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="infrastruktur">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                Enterprise VPS & <br />
                <span className="gradient-text">Infrastruktur Cloud</span>
              </h2>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Rilis (Deploy) aplikasi Anda dengan penuh percaya diri di arsitektur cloud AVACODE yang selalu tersedia (Highly Available). Kami menyediakan sistem VPS terdedikasi dan pemantauan real-time yang disesuaikan persis dengan kebutuhan Anda.
              </p>
              <ul className="space-y-4">
                {['Penyimpanan NVMe Berkinerja Tinggi', 'Proteksi DDoS & Firewall', 'Pencadangan Otomatis Harian'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/90 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
              <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-glow relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full" />
                
                <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-primary" />
                    <h4 className="font-display font-bold text-white">Klaster NODE-A1</h4>
                  </div>
                  <span className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> ONLINE
                  </span>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="bg-surface p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-sm mb-3"><span className="text-foreground-muted">Penggunaan CPU</span><span className="text-white font-mono font-bold">24%</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[24%]" /></div>
                  </div>
                  <div className="bg-surface p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-sm mb-3"><span className="text-foreground-muted">RAM (32GB)</span><span className="text-white font-mono font-bold">18.4GB</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple w-[58%]" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-surface p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-foreground-muted mb-1">Masuk (IN)</p>
                      <p className="text-lg font-mono text-white font-bold">1.2 Gbps</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-foreground-muted mb-1">Uptime</p>
                      <p className="text-lg font-mono text-white font-bold">99.99%</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-foreground-muted mb-1">Ping</p>
                      <p className="text-lg font-mono text-white font-bold">4ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5 & 6. AI INTEGRATION & AUTOMATION */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="sistem-ai">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex justify-center items-center order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple/40 blur-[120px] rounded-full" />
              <img 
                src="/av_01_mascot.png" 
                alt="Maskot Engineer AI AV-01" 
                className="w-full max-w-lg relative z-10 drop-shadow-glow-purple animate-float object-contain"
              />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 px-4 py-2 text-xs font-bold tracking-widest text-purple uppercase">
                Perkenalkan AV-01
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                Asisten AI & <br /> Sistem Kognitif
              </h2>
              <p className="text-lg text-foreground-muted leading-relaxed">
                AV-01 mewakili komitmen kami terhadap sistem yang cerdas. Dari agen AI pelayanan pelanggan hingga analisis *backend* prediktif, kami mengintegrasikan *Machine Learning* dan *LLM* (seperti ChatGPT) langsung ke dalam bisnis Anda.
              </p>
              
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-purple shadow-glow-purple relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple/10 blur-2xl" />
                <div className="flex gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-purple/20 flex flex-shrink-0 items-center justify-center">
                    <Bot className="text-purple w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Catatan Sistem AV-01</h4>
                    <p className="text-sm text-white/80 font-mono leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-success">{">"}</span> Anomali sistem terdeteksi & terselesaikan pada 02:41 UTC.<br/>
                      <span className="text-success">{">"}</span> Alur kerja #4092 tereksekusi dengan sukses.<br/>
                      <span className="text-primary">{">"}</span> Infrastruktur berjalan dengan efisiensi 100%.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 10. CONTACT */}
        <section className="mx-auto max-w-5xl px-6 py-24 md:px-10" id="kontak">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-glow text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-gradient opacity-10 blur-3xl -z-10" />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Siap Melakukan Ekspansi?</h2>
            <p className="text-foreground-muted text-lg mb-10 max-w-2xl mx-auto">
              Diskusikan kebutuhan proyek Anda dengan teknisi utama (Lead Engineer) kami. Kami akan merancang arsitektur kustom dan rencana penerapan (deployment) dalam 24 jam.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Email Kerja Anda" className="flex-1 bg-surface border border-white/10 rounded-full px-6 py-4 text-white placeholder-foreground-muted focus:outline-none focus:border-primary transition-colors shadow-inner" />
              <Button className="h-[58px] px-8 rounded-full bg-primary-gradient border-0 text-white font-bold text-base shadow-glow hover:scale-105 transition-transform">
                Minta Konsultasi
              </Button>
            </form>
          </motion.div>
        </section>

      </div>

      {/* 11. FOOTER */}
      <footer className="bg-surface relative z-10 border-t border-white/5">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <img src="/logo.png" alt="AVACODE Logo" className="h-8 w-auto grayscale brightness-200" />
              </div>
              <p className="text-foreground-muted max-w-sm">Otomatisasi premium, infrastruktur web, dan *engineering* kecerdasan buatan (AI) untuk perusahaan modern.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Solusi Kami</h4>
              <ul className="space-y-3 text-sm text-foreground-muted">
                <li><Link href="#produk" className="hover:text-primary transition-colors">Managed VPS</Link></li>
                <li><Link href="#produk" className="hover:text-primary transition-colors">Backend Engineering</Link></li>
                <li><Link href="#sistem-ai" className="hover:text-primary transition-colors">Asisten AI Cerdas</Link></li>
                <li><Link href="#produk" className="hover:text-primary transition-colors">Custom Automation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm text-foreground-muted">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> halo@avacode.id</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground-muted">
            <p>© {new Date().getFullYear()} AVACODE. Hak cipta dilindungi.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
