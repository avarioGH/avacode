import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-base text-white outline-none ring-0 transition placeholder:text-white/40 focus:border-primary focus:bg-white/10',
        className,
      )}
      {...props}
    />
  );
}
