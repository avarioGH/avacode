'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Rocket, Shield, Key, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SetupServicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [botToken, setBotToken] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [gateway, setGateway] = useState('paydisini');
  const [paydisiniKey, setPaydisiniKey] = useState('');
  const [pakasirKey, setPakasirKey] = useState('');
  const [pakasirSecret, setPakasirSecret] = useState('');

  const handleDeploy = async () => {
    if (!botToken || !ownerId) {
      setErrorMsg('Token Bot dan ID Telegram wajib diisi.');
      return;
    }
    if (gateway === 'paydisini' && !paydisiniKey) {
      setErrorMsg('API Key Paydisini wajib diisi.');
      return;
    }
    if (gateway === 'pakasir' && (!pakasirKey || !pakasirSecret)) {
      setErrorMsg('API Key dan Callback Secret Pakasir wajib diisi.');
      return;
    }

    setErrorMsg('');
    setIsDeploying(true);

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: unwrappedParams.id,
          botToken,
          ownerId,
          gateway,
          paydisiniKey,
          pakasirKey,
          pakasirSecret
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsDeployed(true);
      } else {
        setErrorMsg(data.error || 'Terjadi kesalahan saat deployment.');
      }
    } catch (e) {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <Link href="/dashboard/services">
          <Button variant="secondary" className="w-10 h-10 p-0 rounded-xl border-white/10 bg-surface text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <p className="text-xs font-mono text-primary mb-1">ID: {unwrappedParams.id}</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-3">
            Setup Konfigurasi Bot
          </h2>
        </div>
      </div>

      {isDeployed ? (
        <div className="glass-panel p-10 rounded-3xl border border-success/30 text-center space-y-6 relative overflow-hidden">
           <div className="absolute inset-0 bg-success/5 blur-3xl" />
           <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto border border-success/30">
             <Rocket className="w-10 h-10 text-success" />
           </div>
           <div>
             <h3 className="text-3xl font-bold text-white mb-2">Bot Berhasil Di-Deploy!</h3>
             <p className="text-foreground-muted max-w-lg mx-auto">Instalasi bot telah selesai dan sistem sedang berjalan di background server. Anda bisa langsung mencoba chat bot Anda di Telegram.</p>
           </div>
           <Link href="/dashboard/services">
             <Button className="mt-4 bg-white/10 text-white hover:bg-white/20">Kembali ke Dasbor</Button>
           </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                <Bot className="w-5 h-5 text-primary" /> Identitas Telegram
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Bot Token (Dari BotFather)</label>
                  <Input 
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" 
                    value={botToken} onChange={(e) => setBotToken(e.target.value)}
                    className="bg-surface/80 border-white/10 text-white font-mono" 
                  />
                  <p className="text-xs text-white/40 mt-2">Dapatkan token dengan membuat bot baru di <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-primary hover:underline">@BotFather</a></p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Telegram Owner ID</label>
                  <Input 
                    placeholder="Contoh: 12345678" 
                    value={ownerId} onChange={(e) => setOwnerId(e.target.value)}
                    className="bg-surface/80 border-white/10 text-white font-mono" 
                  />
                  <p className="text-xs text-white/40 mt-2">Dapatkan ID Anda melalui <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-primary hover:underline">@userinfobot</a></p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                <Key className="w-5 h-5 text-purple" /> Gateway Pembayaran
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Pilih Gateway</label>
                  <div className="relative">
                    <select 
                      value={gateway} 
                      onChange={(e) => setGateway(e.target.value)}
                      className="w-full bg-surface/80 border border-white/10 text-white h-12 px-4 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="paydisini" className="bg-surface text-white">Paydisini (Rekomendasi)</option>
                      <option value="pakasir" className="bg-surface text-white">Pakasir</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-foreground-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {gateway === 'paydisini' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Paydisini API Key</label>
                      <Input 
                        placeholder="Masukkan API Key Paydisini" 
                        value={paydisiniKey} onChange={(e) => setPaydisiniKey(e.target.value)}
                        className="bg-surface/80 border-white/10 text-white font-mono" 
                      />
                    </div>
                  </motion.div>
                )}

                {gateway === 'pakasir' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Pakasir API Key</label>
                      <Input 
                        placeholder="Masukkan API Key Pakasir" 
                        value={pakasirKey} onChange={(e) => setPakasirKey(e.target.value)}
                        className="bg-surface/80 border-white/10 text-white font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2">Pakasir Callback Secret</label>
                      <Input 
                        placeholder="Masukkan Callback Secret Pakasir" 
                        value={pakasirSecret} onChange={(e) => setPakasirSecret(e.target.value)}
                        className="bg-surface/80 border-white/10 text-white font-mono" 
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full h-16 bg-primary-gradient border-0 text-white font-bold text-lg rounded-2xl shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              {isDeploying ? (
                <>Menyiapkan & Menjalankan Bot...</>
              ) : (
                <><Rocket className="w-5 h-5" /> Deploy & Jalankan Bot Sekarang</>
              )}
            </Button>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-primary/5">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Info Keamanan</h4>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Kunci API dan token Anda dienkripsi dan disimpan dengan aman. Sistem AVACODE akan menjalankan *instance* terisolasi untuk bot Anda sehingga tidak akan terganggu oleh pengguna lain.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Persiapan</h4>
              <ul className="text-sm text-foreground-muted space-y-3">
                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Pastikan bot Telegram belum dijalankan di tempat lain (Token conflict).</li>
                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/> Salin URL Webhook jika gateway Anda memintanya setelah deploy.</li>
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
