import { products, serviceEntries } from './site-data';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function safeJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts() {
  return (await safeJson<typeof products>('/products')) ?? products;
}

export async function getProduct(slug: string) {
  const apiProduct = await safeJson<(typeof products)[number]>(`/products/${slug}`);
  return apiProduct ?? products.find((product) => product.slug === slug) ?? null;
}

export async function getDashboardSummary() {
  return (
    (await safeJson<{
      activeServices: number;
      totalInvoices: number;
      expiringSoon: number;
      recentActivity: Array<{ action: string; createdAt: string }>;
    }>('/dashboard/summary')) ?? {
      activeServices: 2,
      totalInvoices: 8,
      expiringSoon: 1,
      recentActivity: [
        { action: 'billing.payment.settled', createdAt: 'Baru saja' },
        { action: 'deployment.started', createdAt: '15 menit lalu' },
        { action: 'service.config.updated', createdAt: 'Kemarin' },
      ],
    }
  );
}

export async function getServices() {
  return (await safeJson<typeof serviceEntries>('/services')) ?? serviceEntries;
}

export async function getService(id: string) {
  const apiService = await safeJson<(typeof serviceEntries)[number]>(`/services/${id}`);
  return apiService ?? serviceEntries.find((service) => service.id === id) ?? null;
}

export async function getInvoices() {
  return (
    (await safeJson<
      Array<{ invoiceNumber: string; amount: number; status: string; createdAt: string }>
    >('/billing/invoices')) ?? [
      {
        invoiceNumber: 'INV-20260531-A12BC3',
        amount: 399000,
        status: 'PAID',
        createdAt: '31 Mei 2026',
      },
      {
        invoiceNumber: 'INV-20260515-D45EF6',
        amount: 249000,
        status: 'PENDING',
        createdAt: '15 Mei 2026',
      },
    ]
  );
}
