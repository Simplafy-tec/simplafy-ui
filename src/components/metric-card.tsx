import * as React from "react";
import { cn } from "../lib/utils";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
}

function TrendIndicator({
  value,
  direction,
}: {
  value: string | number;
  direction: "up" | "down" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        direction === "up" && "text-success",
        direction === "down" && "text-destructive",
        direction === "neutral" && "text-muted-foreground",
      )}
    >
      {direction === "up" && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M6 2.5v7M6 2.5L9 5.5M6 2.5L3 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "down" && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M6 9.5v-7M6 9.5L9 6.5M6 9.5L3 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {value}
    </span>
  );
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, trend, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <TrendIndicator value={trend.value} direction={trend.direction} />
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  ),
);
MetricCard.displayName = "MetricCard";

export { MetricCard };
