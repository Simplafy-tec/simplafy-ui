'use client';

import * as React from 'react';
import { Link2, Lock } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const accessBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 text-[11px] font-semibold leading-none',
  {
    variants: {
      kind: {
        account:
          'border-primary/30 bg-[var(--color-primary-bg)] text-primary',
        link: 'border-blue/30 bg-[var(--color-blue-bg)] text-blue',
      },
    },
    defaultVariants: {
      kind: 'account',
    },
  },
);

export type AccessKind = NonNullable<VariantProps<typeof accessBadgeVariants>['kind']>;

export interface AccessBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof accessBadgeVariants> {
  label?: string;
}

const DEFAULT_LABELS: Record<AccessKind, string> = {
  account: 'Minha conta',
  link: 'Link de terceiro',
};

function AccessBadge({ kind = 'account', label, className, ...props }: AccessBadgeProps) {
  const Icon = kind === 'account' ? Lock : Link2;
  const text = label ?? DEFAULT_LABELS[kind ?? 'account'];

  return (
    <span className={cn(accessBadgeVariants({ kind }), className)} {...props}>
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {text}
    </span>
  );
}

export { AccessBadge, accessBadgeVariants };
