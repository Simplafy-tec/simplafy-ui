import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

/**
 * Hub 2.0 wireframe — `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`
 * (gradiente 135° primary → #34D399; hover sólido --primary-hover + brightness 1.05)
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold font-sans text-[13px] leading-tight',
    'cursor-pointer',
    'ring-offset-background transition-[background,background-image,color,border-color,filter,box-shadow] duration-200',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'min-h-10 border-0 px-[18px] py-0 text-white shadow-sm',
          'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-gradient-end))]',
          'hover:[background-image:none] hover:bg-primary-hover hover:brightness-[1.05]',
          'active:brightness-95',
        ].join(' '),
        destructive:
          'min-h-10 border-0 px-[18px] py-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: [
          'min-h-10 border-[1.5px] border-border bg-card px-[18px] py-0 text-foreground',
          'hover:border-primary hover:bg-sidebar-accent hover:text-primary',
        ].join(' '),
        secondary:
          'min-h-10 border-0 px-[18px] py-0 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: [
          'min-h-10 border-[1.5px] border-transparent bg-transparent px-[18px] py-0 text-muted-foreground',
          'hover:bg-primary/10 hover:text-primary',
        ].join(' '),
        link: 'min-h-0 border-0 px-0 py-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: '',
        sm: 'min-h-9 rounded-md px-3 text-sm',
        lg: 'min-h-11 rounded-md px-8 text-[13px]',
        icon: 'size-10 min-h-10 min-w-10 shrink-0 rounded-md px-0',
      },
    },
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
