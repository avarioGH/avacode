import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border bg-white/80 p-6 shadow-[0_18px_50px_rgba(12,36,42,0.08)] backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}
