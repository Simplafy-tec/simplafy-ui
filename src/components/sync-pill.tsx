'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle, Pause, RefreshCw } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const syncPillVariants = cva(
  'inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 text-[11px] font-semibold leading-none',
  {
    variants: {
      status: {
        active:
          'border-primary/30 bg-[var(--color-primary-bg)] text-primary',
        syncing:
          'border-blue/30 bg-[var(--color-blue-bg)] text-blue',
        error:
          'border-destructive/30 bg-[var(--color-red-bg)] text-destructive',
        disabled: 'border-border bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      status: 'active',
    },
  },
);

export type SyncPillStatus = NonNullable<VariantProps<typeof syncPillVariants>['status']>;

const SYNC_META: Record<
  SyncPillStatus,
  { label: string; Icon: React.ComponentType<{ className?: string; size?: number }> }
> = {
  active: { label: 'Ativo', Icon: CheckCircle },
  syncing: { label: 'Sincronizando', Icon: RefreshCw },
  error: { label: 'Erro', Icon: AlertTriangle },
  disabled: { label: 'Desativado', Icon: Pause },
};

export interface SyncPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof syncPillVariants> {
  label?: string;
}

function SyncPill({ status = 'active', label, className, ...props }: SyncPillProps) {
  const meta = SYNC_META[status ?? 'active'];
  const Icon = meta.Icon;
  const spin = status === 'syncing';

  return (
    <span className={cn(syncPillVariants({ status }), className)} {...props}>
      <Icon size={11} className={cn('shrink-0', spin && 'spin')} aria-hidden="true" />
      {label ?? meta.label}
    </span>
  );
}

export { SyncPill, syncPillVariants };
