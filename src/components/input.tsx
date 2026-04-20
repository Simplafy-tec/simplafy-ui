import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Hub 2.0 wireframe `.form-input` — borda `--border`, fundo card, 14px, altura ~40px,
 * foco: borda primary + anel 3px tipo `--primary-bg` (igual Select).
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[40px] min-h-[40px] w-full items-center rounded-lg border border-border bg-card px-3 py-0 text-sm text-foreground shadow-sm',
          'transition-[border-color,box-shadow,background-color] duration-200',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
