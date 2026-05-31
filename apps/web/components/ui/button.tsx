import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentStrong disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accentStrong px-5 py-3 text-white shadow-glow hover:-translate-y-0.5 hover:bg-[#0a3d4a]',
        secondary: 'border border-border bg-white/70 px-5 py-3 text-ink hover:bg-white',
        ghost: 'px-4 py-2 text-ink/70 hover:bg-white/70 hover:text-ink',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
