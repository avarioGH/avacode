import type { ReactNode } from 'react';

import { Badge } from './ui/badge';

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        <Badge>{eyebrow}</Badge>
        <h2 className="max-w-xl font-serif text-4xl leading-none text-ink md:text-5xl">{title}</h2>
        <p className="text-base leading-7 text-ink/72">{body}</p>
      </div>
      {action}
    </div>
  );
}
