'use client';

import { useState, use } from 'react';
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  
  // Mocking initial data based on slug to simulate edit mode
  const [productName, setProductName] = useState(
    unwrappedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
  const [imageUrl, setImageUrl] = useState('');
  const [isComingSoon, setIsComingSoon] = useState(false);
  
  const [features, setFeatures] = useState<string[]>([
    'Membalas chat otomatis dalam 0.1 detik',
    'Integrasi Payment Gateway'
  ]);
  const [variants, setVariants] = useState([
    { name: 'Paket 1 Bulan', price: 'Rp 149.000' },
    { name: 'Paket 3 Bulan', price: 'Rp 400.000' }
  ]);
  const [faqs, setFaqs] = useState([
    { question: 'Berapa lama prosesnya?', answer: 'Seketika setelah pembayaran.' }
  ]);

  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const addVariant = () => setVariants([...variants, { name: '', price: '' }]);
  const updateVariant = (index: number, field: 'name'|'price', value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (index: number, field: 'question'|'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
           <Link href="/admin/products">
             <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/10 bg-surface text-white">
               <ArrowLeft className="w-5 h-5" />
             </Button>
           </Link>
           <div>
             <h2 className="text-2xl font-display font-bold text-white">Edit Produk: {productName}</h2>
             <p className="text-foreground-muted text-sm">Ubah detail dan variasi harga produk ini.</p>
           </div>
         </div>
         <Button className="bg-primary-gradient border-0 text-white font-bold h-10 px-6 rounded-xl shadow-glow flex items-center gap-2">
           <Save className="w-4 h-4" /> Simpan Perubahan
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Basic Info */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Informasi Utama</h3>
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-foreground-muted mb-2">Nama Produk</label>
                 <Input 
                   value={productName}
                   onChange={(e) => setProductName(e.target.value)}
                   placeholder="Contoh: Bot Auto Order Tele" 
                   className="bg-surface/50 border-white/10 text-white" 
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-foreground-muted mb-2">URL Gambar / Ikon Produk (Opsional)</label>
                 <div className="flex gap-3">
                   <Input 
                     value={imageUrl}
                     onChange={(e) => setImageUrl(e.target.value)}
                     placeholder="https://... atau biarkan kosong untuk ikon bawaan" 
                     className="bg-surface/50 border-white/10 text-white flex-1" 
                   />
                   {imageUrl && (
                     <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-surface/50 flex-shrink-0">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-foreground-muted mb-2">Slug URL</label>
                 <Input value={unwrappedParams.slug} readOnly className="bg-surface/50 border-white/10 text-white/50 font-mono text-sm cursor-not-allowed" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-foreground-muted mb-2">Deskripsi Produk</label>
                 <Textarea placeholder="Tuliskan penjelasan produk di sini..." className="bg-surface/50 border-white/10 text-white min-h-[120px]" />
               </div>
               <div className="flex items-center gap-3 pt-2">
                 <input 
                   type="checkbox" 
                   id="coming-soon"
                   checked={isComingSoon}
                   onChange={(e) => setIsComingSoon(e.target.checked)}
                   className="w-5 h-5 rounded border-white/20 bg-surface/50 text-primary focus:ring-primary focus:ring-offset-background"
                 />
                 <label htmlFor="coming-soon" className="text-sm font-bold text-white cursor-pointer select-none">
                   Tandai sebagai "Coming Soon" <span className="text-foreground-muted font-normal block text-xs">Produk akan tampil namun pelanggan belum bisa memesannya.</span>
                 </label>
               </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Variasi Langganan</h3>
            <div className="space-y-4">
               {variants.map((variant, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-surface/30 p-3 rounded-xl border border-white/5">
                   <Input 
                     placeholder="Masa Aktif (cth: 1 Bulan)" 
                     value={variant.name} 
                     onChange={(e) => updateVariant(idx, 'name', e.target.value)} 
                     className="bg-surface border-white/10 text-white w-1/2" 
                   />
                   <Input 
                     placeholder="Harga (cth: Rp 450.000)" 
                     value={variant.price} 
                     onChange={(e) => updateVariant(idx, 'price', e.target.value)} 
                     className="bg-surface border-white/10 text-white w-1/2" 
                   />
                   <Button variant="ghost" onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-500/10 px-3">
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
               ))}
               <Button variant="outline" onClick={addVariant} className="w-full border-dashed border-white/20 text-foreground-muted hover:text-white">
                 <Plus className="w-4 h-4 mr-2" /> Tambah Variasi Harga
               </Button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Tanya Jawab (QnA) & Panduan</h3>
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                 <div key={idx} className="bg-surface/30 p-4 rounded-xl border border-white/5 space-y-3 relative">
                   <button onClick={() => removeFaq(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400">
                     <Trash2 className="w-4 h-4" />
                   </button>
                   <Input 
                     placeholder="Pertanyaan (Contoh: Berapa lama proses pembuatan bot?)" 
                     value={faq.question} 
                     onChange={(e) => updateFaq(idx, 'question', e.target.value)} 
                     className="bg-surface border-white/10 text-white pr-10" 
                   />
                   <Textarea 
                     placeholder="Jawaban..." 
                     value={faq.answer} 
                     onChange={(e) => updateFaq(idx, 'answer', e.target.value)} 
                     className="bg-surface border-white/10 text-white min-h-[80px]" 
                   />
                 </div>
               ))}
               <Button variant="outline" onClick={addFaq} className="w-full border-dashed border-white/20 text-foreground-muted hover:text-white">
                 <Plus className="w-4 h-4 mr-2" /> Tambah QnA Baru
               </Button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Form */}
        <div className="space-y-8">
           <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
             <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Keunggulan Produk</h3>
             <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input 
                      placeholder="Keunggulan..." 
                      value={feature} 
                      onChange={(e) => updateFeature(idx, e.target.value)} 
                      className="bg-surface border-white/10 text-white text-sm" 
                    />
                    <Button variant="ghost" onClick={() => removeFeature(idx)} className="text-red-500 hover:bg-red-500/10 p-2 h-auto">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFeature} className="w-full border-dashed border-white/20 text-foreground-muted hover:text-white text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Poin
                </Button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
