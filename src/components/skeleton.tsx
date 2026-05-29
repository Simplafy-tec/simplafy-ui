import * as React from "react";
import { cn } from "../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/** Cartão placeholder para listas em carregamento (layout tipo Card). */
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border bg-card space-y-3 rounded-xl border p-4 shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full max-w-[85%]" />
      <Skeleton className="h-3 w-full max-w-[60%]" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    </div>
  );
}

type SkeletonComponent = typeof Skeleton & {
  Card: typeof SkeletonCard;
};

(Skeleton as SkeletonComponent).Card = SkeletonCard;

export { Skeleton };
export type { SkeletonComponent };
