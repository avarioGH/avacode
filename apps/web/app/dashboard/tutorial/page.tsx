import { Card } from '@/components/ui/card';
import { products } from '@/lib/site-data';

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[34px] border border-border bg-white/80 p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Tutorial</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-ink">Panduan setup per produk.</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <Card key={product.slug} className="p-6">
            <h2 className="text-xl font-semibold text-ink">{product.name}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">{product.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.setupFields.map((field) => (
                <span key={field} className="rounded-full bg-[#f6f0e5] px-3 py-1 text-xs text-ink/70">
                  {field}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
