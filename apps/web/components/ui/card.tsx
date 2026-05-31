import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-[#0B1220]/80 p-8 shadow-glass backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}
