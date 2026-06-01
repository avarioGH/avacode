'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Bot, ShieldCheck, Zap, Mail, HelpCircle, AlertCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OrderPage({ params }: { params: { slug: string } }) {
  // Static dummy data for UI preview purposes
  const productData = {
    title: 'Bot Auto Order Telegram',
    basePrice: 'Rp 450.000',
    icon: Bot,
    desc: 'Sistem otomatisasi penuh untuk melayani dan merekap pesanan pelanggan via Telegram 24/7. Menggunakan Natural Language Processing agar bot membalas seperti manusia.',
    features: [
      'Membalas chat otomatis dalam 0.1 detik',
      'Integrasi Payment Gateway',
      'Rekap transaksi langsung ke Google Sheets',
      'Broadcast promosi ke seluruh pengguna',
      'Dashboard admin terpisah'
    ],
    variants: [
      { id: 'v1', name: 'Paket 1 Bulan', price: 'Rp 450.000', stock: 99 },
      { id: 'v2', name: 'Paket 3 Bulan', price: 'Rp 1.200.000', stock: 50, promo: 'Hemat 10%' },
      { id: 'v3', name: 'Paket 1 Tahun', price: 'Rp 4.500.000', stock: 15, promo: 'Hemat 25%' },
    ],
    faqs: [
      { q: 'Berapa lama proses pembuatannya?', a: 'Sistem kami terotomatisasi secara instan. Bot akan langsung aktif 5 detik setelah pembayaran Anda terverifikasi.' },
      { q: 'Apakah butuh keahlian coding?', a: 'Sama sekali tidak. Anda hanya perlu menyiapkan token bot Telegram dari BotFather dan sistem kami akan mengurus sisanya.' },
    ]
  };

  const [selectedVariant, setSelectedVariant] = useState(productData.variants[0].id);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans pt-24 pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] opacity-50 rounded-[100%] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Main Product Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-8 border border-white/10 shadow-glow relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> LAYANAN OTOMATIS
                 </span>
               </div>
               
               <div className="w-24 h-24 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-8 shadow-glow mt-4">
                 <productData.icon className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
               </div>
               
               <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{productData.title}</h1>
               <div className="text-3xl font-bold text-primary mb-6">{productData.basePrice}</div>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2 border-l-2 border-primary pl-2"><AlertCircle className="w-4 h-4 text-primary" /> DESKRIPSI</h4>
                   <p className="text-foreground-muted text-sm leading-relaxed bg-surface/50 p-4 rounded-xl border border-white/5">{productData.desc}</p>
                 </div>
                 
                 <div>
                   <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 border-l-2 border-success pl-2"><ShieldCheck className="w-4 h-4 text-success" /> KEUNGGULAN PRODUK</h4>
                   <ul className="space-y-3">
                     {productData.features.map((feature, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                         <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                         <span className="pt-0.5">{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </motion.div>

            {/* QnA Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-3xl p-8 border border-white/10">
               <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-purple" /> PANDUAN & QNA</h4>
               <div className="space-y-6">
                 {productData.faqs.map((faq, i) => (
                   <div key={i} className="bg-surface/50 p-5 rounded-2xl border border-white/5">
                     <p className="font-bold text-white mb-2 flex items-start gap-2">
                       <span className="text-purple">Q:</span> {faq.q}
                     </p>
                     <p className="text-sm text-foreground-muted leading-relaxed pl-6">{faq.a}</p>
                   </div>
                 ))}
               </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Checkout Form */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-3xl p-8 border border-white/10 sticky top-24">
              
              <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">PROSES ORDER</h2>
              </div>

              {/* Countdown / Promo Banner */}
              <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
                 <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                   <Zap className="w-4 h-4" /> PROMO TERBATAS
                 </p>
                 <div className="flex justify-center gap-4">
                    <div className="bg-surface border border-white/10 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-bold text-white">02</span>
                      <span className="text-[10px] text-foreground-muted">JAM</span>
                    </div>
                    <div className="bg-surface border border-white/10 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-bold text-white">14</span>
                      <span className="text-[10px] text-foreground-muted">MNT</span>
                    </div>
                    <div className="bg-surface border border-white/10 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-bold text-white">59</span>
                      <span className="text-[10px] text-foreground-muted">DET</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 
                 {/* Identity Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">NAMA LENGKAP *</label>
                      <Input placeholder="Nama Kamu" className="bg-surface/80 border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">WHATSAPP *</label>
                      <Input placeholder="08123456789" className="bg-surface/80 border-white/10 h-14 text-white" />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">EMAIL PENGIRIMAN *</label>
                    <div className="relative">
                      <Input placeholder="nama@gmail.com" className="bg-surface/80 border-white/10 h-14 text-white pl-12" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                    </div>
                 </div>

                 {/* Subscription Variants */}
                 <div className="pt-4">
                   <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Layers className="w-4 h-4" /> PILIH VARIASI PRODUK *
                   </label>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productData.variants.map((variant) => (
                        <div 
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.id)}
                          className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${
                            selectedVariant === variant.id 
                              ? 'border-primary bg-primary/5 shadow-glow-strong' 
                              : 'border-white/5 bg-surface hover:border-white/20'
                          }`}
                        >
                          {/* Active Checkmark Indicator */}
                          {selectedVariant === variant.id && (
                            <div className="absolute top-0 right-0 bg-primary w-8 h-8 rounded-bl-xl rounded-tr-[14px] flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-white pr-6">{variant.name}</h5>
                            {variant.promo && (
                              <span className="bg-purple/20 text-purple text-[10px] font-bold px-2 py-1 rounded-full">{variant.promo}</span>
                            )}
                          </div>
                          
                          <p className="text-xl font-display font-bold text-primary mb-3">{variant.price}</p>
                          <div className="inline-flex items-center gap-1.5 bg-success/10 border border-success/20 px-2 py-1 rounded text-[10px] font-bold text-success">
                            <CheckCircle2 className="w-3 h-3" /> STOK TERSEDIA
                          </div>
                        </div>
                      ))}
                   </div>
                 </div>

                 {/* Submit Button */}
                 <div className="pt-8">
                   <Button className="w-full h-16 rounded-2xl bg-primary-gradient border-0 text-white font-bold text-lg shadow-glow hover:scale-[1.02] transition-transform">
                     Selesaikan Pesanan & Buat Bot
                   </Button>
                   <p className="text-center text-xs text-foreground-muted mt-4">
                     Pesanan akan diproses seketika (*instant deployment*) setelah pembayaran berhasil.
                   </p>
                 </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
