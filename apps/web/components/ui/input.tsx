import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border border-border bg-white/80 px-4 text-sm text-ink outline-none ring-0 transition placeholder:text-ink/35 focus:border-accentStrong',
        className,
      )}
      {...props}
    />
  );
}
