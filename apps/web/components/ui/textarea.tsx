import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-36 w-full rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-primary focus:bg-white/10',
        className,
      )}
      {...props}
    />
  );
}
