'use client';

import { useState } from 'react';
import { Bot, Cloud, Globe, MailCheck, Send, Plus, Edit2, Trash2, Shield } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialProducts = [
  { slug: 'bot-auto-order-telegram', name: 'Bot Auto Order Telegram', icon: Bot, price: 'Rp 149.000', status: 'Published' },
  { slug: 'bot-promosi-telegram', name: 'Bot Forward / Promosi Telegram', icon: Send, price: 'Rp 119.000', status: 'Published' },
  { slug: 'website-digital-product', name: 'Website Digital Product', icon: Globe, price: 'Rp 249.000', status: 'Published' },
  { slug: 'website-physical-product', name: 'Website Physical Product', icon: Cloud, price: 'Rp 279.000', status: 'Draft' },
  { slug: 'website-email-otp', name: 'Website Email OTP', icon: MailCheck, price: 'Rp 219.000', status: 'Published' },
  { slug: 'bot-otp-domain', name: 'Bot Tele OTP Email Domain', icon: Shield, price: 'Rp 850.000', status: 'Published', isComingSoon: true },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (slug: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.slug !== slug));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-foreground-muted">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Produk & Layanan</h1>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary-gradient text-white font-bold rounded-xl h-12 px-6 shadow-glow hover:scale-[1.02] transition-transform flex items-center gap-2">
            <Plus className="w-5 h-5" /> Tambah Produk Baru
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <Card key={product.slug} className="border border-white/5 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-foreground-muted">Mulai dari {product.price}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {product.isComingSoon ? (
                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                      COMING SOON
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                      {product.status}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.slug}/edit`}>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDelete(product.slug)}
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
