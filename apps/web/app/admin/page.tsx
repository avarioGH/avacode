import { ArrowUpRight, ArrowDownRight, Server, Users, Wallet } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Pendapatan', value: 'Rp 45.200.000', change: '+12.5%', isUp: true, icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
    { name: 'Klien Aktif', value: '124', change: '+5.2%', isUp: true, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Layanan Berjalan', value: '312', change: '-1.4%', isUp: false, icon: Server, color: 'text-purple', bg: 'bg-purple/10' },
  ];

  const recentTransactions = [
    { id: 'TRX-9823', client: 'PT. Teknologi Maju', product: 'Web Digital/Physical Product', amount: 'Rp 2.500.000', status: 'Lunas', date: 'Hari Ini, 14:20' },
    { id: 'TRX-9822', client: 'Budi Santoso', product: 'Bot Auto Order Tele', amount: 'Rp 450.000', status: 'Pending', date: 'Hari Ini, 11:05' },
    { id: 'TRX-9821', client: 'Kreatif Studio', product: 'Bot Tele OTP Email Domain', amount: 'Rp 850.000', status: 'Lunas', date: 'Kemarin' },
    { id: 'TRX-9820', client: 'CV. Abadi Jaya', product: 'Bot Auto Order WA', amount: 'Rp 650.000', status: 'Lunas', date: 'Kemarin' },
  ];

  const productsList = [
    { name: 'Bot Auto Order Tele', sales: '84', revenue: 'Rp 37.800.000', status: 'Aktif' },
    { name: 'Bot Auto Order WA', sales: '42', revenue: 'Rp 27.300.000', status: 'Aktif' },
    { name: 'Bot Forward/Promosi Tele', sales: '112', revenue: 'Rp 39.200.000', status: 'Aktif' },
    { name: 'Web Digital/Physical Product', sales: '18', revenue: 'Rp 45.000.000', status: 'Aktif' },
    { name: 'Website Email / OTP', sales: '25', revenue: 'Rp 30.000.000', status: 'Aktif' },
    { name: 'Bot Tele OTP Email Domain', sales: '56', revenue: 'Rp 47.600.000', status: 'Aktif' },
  ];

  return (
    <div className="space-y-8">
      
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm text-foreground-muted mb-1">{stat.name}</p>
                 <h3 className="text-3xl font-display font-bold text-white">{stat.value}</h3>
               </div>
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
             </div>
             <div className="flex items-center gap-2 text-sm mt-4">
                <span className={`flex items-center font-medium ${stat.isUp ? 'text-success' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-4 h-4 mr-1"/> : <ArrowDownRight className="w-4 h-4 mr-1"/>}
                  {stat.change}
                </span>
                <span className="text-foreground-muted">dari bulan lalu</span>
             </div>
          </div>
        ))}
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5">
            <h3 className="text-xl font-display font-bold text-white">Transaksi Terbaru</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-surface/50 border-b border-white/5">
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">ID Transaksi</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Klien</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Produk</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Nominal</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Status</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Tanggal</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {recentTransactions.map((trx) => (
                   <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-mono">{trx.id}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{trx.client}</td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{trx.product}</td>
                      <td className="px-6 py-4 text-sm text-white font-bold">{trx.amount}</td>
                      <td className="px-6 py-4 text-sm">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${trx.status === 'Lunas' ? 'bg-success/10 text-success border border-success/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                           {trx.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{trx.date}</td>
                   </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>

      {/* PRODUCTS CATALOG TABLE */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5">
            <h3 className="text-xl font-display font-bold text-white">Katalog Produk Aktif</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-surface/50 border-b border-white/5">
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Nama Produk/Layanan</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Total Penjualan</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Estimasi Pendapatan</th>
                    <th className="px-6 py-4 text-sm font-medium text-foreground-muted">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {productsList.map((prod) => (
                   <tr key={prod.name} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium">{prod.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{prod.sales} trx</td>
                      <td className="px-6 py-4 text-sm text-white font-bold">{prod.revenue}</td>
                      <td className="px-6 py-4 text-sm">
                         <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
                           {prod.status}
                         </span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>
      
    </div>
  );
}
