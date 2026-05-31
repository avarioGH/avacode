import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-32 w-full rounded-3xl border border-border bg-white/80 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accentStrong',
        className,
      )}
      {...props}
    />
  );
}
