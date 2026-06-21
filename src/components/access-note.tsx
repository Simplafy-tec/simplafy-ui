'use client';

import * as React from 'react';
import { Link2, Lock } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const accessNoteVariants = cva(
  'flex gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-snug text-foreground [&_strong]:font-bold',
  {
    variants: {
      kind: {
        account:
          'border-primary/35 bg-[color-mix(in_oklab,var(--color-primary)_5%,var(--color-card))] [&>svg]:mt-px [&>svg]:shrink-0 [&>svg]:text-primary',
        link: 'border-blue/30 bg-[color-mix(in_oklab,var(--color-blue)_6%,var(--color-card))] [&>svg]:mt-px [&>svg]:shrink-0 [&>svg]:text-blue',
      },
    },
    defaultVariants: {
      kind: 'account',
    },
  },
);

export interface AccessNoteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accessNoteVariants> {}

function AccessNote({ kind = 'account', className, children, ...props }: AccessNoteProps) {
  const Icon = kind === 'account' ? Lock : Link2;

  return (
    <div className={cn(accessNoteVariants({ kind }), className)} role="note" {...props}>
      <Icon size={14} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export { AccessNote, accessNoteVariants };
