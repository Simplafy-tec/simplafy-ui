import type { Meta, StoryObj } from "@storybook/react";
import { SimpleBarChart, CHART_COLORS } from "../../src/components/bar-chart";

const meta = {
  title: "Charts/SimpleBarChart",
  component: SimpleBarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SimpleBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyData = [
  { mes: "Jan", leads: 42, convertidos: 8 },
  { mes: "Fev", leads: 67, convertidos: 14 },
  { mes: "Mar", leads: 85, convertidos: 22 },
  { mes: "Abr", leads: 73, convertidos: 18 },
  { mes: "Mai", leads: 91, convertidos: 27 },
  { mes: "Jun", leads: 110, convertidos: 35 },
];

export const SingleSeries: Story = {
  args: {
    data: monthlyData,
    xAxisKey: "mes",
    series: [{ dataKey: "leads", name: "Leads", color: CHART_COLORS[0] }],
    height: 260,
    className: "w-[500px]",
  },
};

export const MultiSeries: Story = {
  args: {
    data: monthlyData,
    xAxisKey: "mes",
    series: [
      { dataKey: "leads", name: "Leads", color: CHART_COLORS[0] },
      { dataKey: "convertidos", name: "Convertidos", color: CHART_COLORS[1] },
    ],
    height: 260,
    className: "w-[500px]",
  },
};

export const CustomColors: Story = {
  args: {
    data: monthlyData,
    xAxisKey: "mes",
    series: [
      { dataKey: "leads", name: "Leads", color: "#22c55e" },
      { dataKey: "convertidos", name: "Convertidos", color: "#3b82f6" },
    ],
    height: 260,
    className: "w-[500px]",
  },
};

export const WithTooltipFormatter: Story = {
  args: {
    data: [
      { mes: "Jan", receita: 12400 },
      { mes: "Fev", receita: 18700 },
      { mes: "Mar", receita: 22100 },
      { mes: "Abr", receita: 19500 },
      { mes: "Mai", receita: 28900 },
      { mes: "Jun", receita: 34200 },
    ],
    xAxisKey: "mes",
    series: [{ dataKey: "receita", name: "Receita", color: CHART_COLORS[2] }],
    height: 260,
    className: "w-[500px]",
    tooltipFormatter: (value) =>
      `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  },
};

export const NoGrid: Story = {
  args: {
    data: monthlyData,
    xAxisKey: "mes",
    series: [{ dataKey: "leads", name: "Leads", color: CHART_COLORS[0] }],
    height: 220,
    showGrid: false,
    showYAxis: false,
    className: "w-[400px]",
  },
};
