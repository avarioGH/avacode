import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';

import './globals.css';

export const metadata: Metadata = {
  title: 'AVACODE | Build Smarter. Scale Faster.',
  description:
    'Automation, AI, and custom software solutions for modern businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="strip-extension-hydration-attrs" strategy="beforeInteractive">
        {`
          (() => {
            const blockedPrefixes = ['bis_', '__processed_'];
            const stripExtensionAttrs = (node) => {
              if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
              for (const attr of Array.from(node.attributes)) {
                if (blockedPrefixes.some((prefix) => attr.name.startsWith(prefix))) {
                  node.removeAttribute(attr.name);
                }
              }
            };

            const scan = () => {
              document.querySelectorAll('*').forEach(stripExtensionAttrs);
            };

            scan();
            const observer = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                  stripExtensionAttrs(mutation.target);
                }

                for (const node of Array.from(mutation.addedNodes)) {
                  stripExtensionAttrs(node);
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('*').forEach(stripExtensionAttrs);
                  }
                }
              }
            });

            observer.observe(document.documentElement, {
              attributes: true,
              childList: true,
              subtree: true,
            });

            window.addEventListener('load', () => observer.disconnect(), { once: true });
          })();
        `}
        </Script>
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
