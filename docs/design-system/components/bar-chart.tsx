import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type BarProps,
} from "recharts";
import { cn } from "../lib/utils";
import { ChartTooltip, type ChartTooltipProps } from "./chart-tooltip";

const CHART_COLORS = [
  "var(--color-primary)",
  "var(--color-blue)",
  "var(--color-purple)",
  "var(--color-teal)",
  "var(--color-orange)",
  "var(--color-warning)",
] as const;

export interface BarChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  radius?: BarProps["radius"];
}

export interface SimpleBarChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  series: BarChartSeries[];
  xAxisKey: string;
  height?: number;
  tooltipFormatter?: ChartTooltipProps["formatter"];
  showGrid?: boolean;
  showYAxis?: boolean;
}

const SimpleBarChart = React.forwardRef<HTMLDivElement, SimpleBarChartProps>(
  (
    {
      className,
      data,
      series,
      xAxisKey,
      height = 300,
      tooltipFormatter,
      showGrid = true,
      showYAxis = true,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
          />
          {showYAxis && (
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
          )}
          <Tooltip
            content={<ChartTooltip formatter={tooltipFormatter} />}
            cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
          />
          {series.map((s, i) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              fill={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              radius={s.radius ?? [4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  ),
);
SimpleBarChart.displayName = "SimpleBarChart";

export { SimpleBarChart, CHART_COLORS };
