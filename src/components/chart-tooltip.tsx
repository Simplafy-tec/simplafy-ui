import { cn } from "../lib/utils";

export interface ChartTooltipPayload {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
  formatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string) => string;
  className?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-md",
        className,
      )}
    >
      {label != null && (
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name ?? entry.dataKey}:
            </span>
            <span className="font-medium">
              {formatter && entry.value != null
                ? formatter(entry.value, entry.name ?? "")
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ChartTooltip };
