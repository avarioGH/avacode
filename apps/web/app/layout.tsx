import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'AVACODE | Build Smarter. Scale Faster.',
  description:
    'Automation, AI, and custom software solutions for modern businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
