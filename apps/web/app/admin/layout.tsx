import Link from 'next/link';
import { LayoutDashboard, Users, Package, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-primary" />
             <span className="font-display font-bold text-white text-lg">AVA Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground-muted hover:bg-white/5 hover:text-white transition-colors">
            <Users className="w-5 h-5" /> Klien
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground-muted hover:bg-white/5 hover:text-white transition-colors">
            <Package className="w-5 h-5" /> Layanan / Produk
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground-muted hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="w-5 h-5" /> Pengaturan
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />
        <header className="h-20 bg-surface/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="text-xl font-display font-bold text-white">Ikhtisar (Overview)</h2>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shadow-glow">AD</div>
           </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
