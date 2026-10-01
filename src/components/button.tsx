import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

/**
 * Protótipo Hub (`kits/hub/hub.css`) — `.btn` 34px / 0 14px / 13px / 600 (:652),
 * `.btn-sm` 28px / 0 10px / 12.5px (:695) e `.btn-primary` SÓLIDO `--color-primary`,
 * hover `--color-primary-hover` (:664). Altura e padding moram em `size`; a variante
 * só decide cor e borda (Platform#2.1.1.10).
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold font-sans text-[13px] leading-tight',
    'cursor-pointer',
    'ring-offset-background transition-[background,color,border-color,box-shadow] duration-200',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-[15px] [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'border-0 py-0 bg-primary text-primary-foreground',
          // Sombra = box-shadow de `.btn-primary` (hub.css:664): inset 12% preto + anel 1px de 35% do primário.
          'shadow-[inset_0_1px_0_0_color-mix(in_oklab,black_12%,transparent),0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]',
          // Light: `--color-primary-hover`. Dark: o hover CLAREIA (protótipo: --green-bright); escurecer
          // com texto quase preto reprovava AA (3,95:1 com #15803d).
          'hover:bg-primary-hover dark:hover:bg-[color-mix(in_oklab,var(--color-primary)_82%,white)]',
        ].join(' '),
        destructive:
          'border-0 py-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: [
          'border-[1.5px] border-border bg-card py-0 text-foreground',
          'hover:border-primary hover:bg-sidebar-accent hover:text-primary',
        ].join(' '),
        secondary:
          'border-0 py-0 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: [
          'border-[1.5px] border-transparent bg-transparent py-0 text-muted-foreground',
          'hover:bg-primary/10 hover:text-primary',
        ].join(' '),
        link: 'border-0 py-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-[34px] px-[14px]',
        sm: 'min-h-7 rounded-xs px-2.5 text-[12.5px] [&_svg]:size-[13px]',
        lg: 'min-h-11 rounded-sm px-8 text-sm',
        icon: 'size-10 min-h-10 min-w-10 shrink-0 rounded-xs px-0',
      },
    },
    compoundVariants: [
      // `link` é texto corrido: sem altura nem padding de botão, em qualquer size.
      { variant: 'link', className: 'h-auto min-h-0 w-auto min-w-0 px-0 text-sm' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
