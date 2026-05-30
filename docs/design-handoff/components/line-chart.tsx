import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../lib/utils";
import { ChartTooltip, type ChartTooltipProps } from "./chart-tooltip";
import { CHART_COLORS } from "./bar-chart";

export interface LineChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
  dot?: boolean;
}

export interface SimpleLineChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  series: LineChartSeries[];
  xAxisKey: string;
  height?: number;
  tooltipFormatter?: ChartTooltipProps["formatter"];
  showGrid?: boolean;
  showYAxis?: boolean;
}

const SimpleLineChart = React.forwardRef<HTMLDivElement, SimpleLineChartProps>(
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
        <RechartsLineChart
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
          />
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={s.strokeWidth ?? 2}
              dot={s.dot ?? false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  ),
);
SimpleLineChart.displayName = "SimpleLineChart";

export { SimpleLineChart };
