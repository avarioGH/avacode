'use client';

import { useState } from 'react';
import { Rocket, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ServiceEntry } from '@/lib/site-data';

function labelToKey(label: string) {
  const explicit: Record<string, string> = {
    'Bot Token': 'botToken',
    'Telegram Admin ID': 'telegramAdminId',
    'Channel Testimoni': 'testimonialChannel',
    'API Pakasir': 'pakasirApiKey',
    'Nama Toko': 'storeName',
    'Logo URL': 'logoUrl',
    'API ID': 'apiId',
    'API HASH': 'apiHash',
    'Session String': 'sessionString',
    'Source Channel': 'sourceChannel',
    'Target Channel': 'targetChannel',
    'Nama Website': 'siteName',
    Domain: 'domain',
    'Payment Gateway': 'paymentGateway',
    'Brand Name': 'brandName',
    'SMTP Host': 'smtpHost',
    'SMTP User': 'smtpUser',
    'SMTP Pass': 'smtpPass',
  };

  if (explicit[label]) {
    return explicit[label];
  }

  return label
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .trim()
    .split(/\s+/)
    .map((word, index) =>
      index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

export function SetupWizard({ service }: { service: ServiceEntry }) {
  const [values, setValues] = useState<Record<string, string>>(service.config);

  return (
    <Card className="space-y-6 p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-ink/45">Setup Wizard</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{service.productName}</h3>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" type="button">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button type="button">
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Service
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {service.setupFields.map((field, index) => {
          const key = labelToKey(field);

          return (
            <label key={field} className="space-y-2 rounded-[24px] bg-[#f6f2e8] p-4">
              <span className="text-xs uppercase tracking-[0.2em] text-ink/45">Step {index + 1}</span>
              <p className="text-sm font-medium text-ink">{field}</p>
              <Input
                value={values[key] ?? ''}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                placeholder={`Masukkan ${field.toLowerCase()}`}
              />
            </label>
          );
        })}
      </div>
    </Card>
  );
}
