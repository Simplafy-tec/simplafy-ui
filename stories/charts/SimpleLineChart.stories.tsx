import type { Meta, StoryObj } from "@storybook/react";
import { SimpleLineChart, type LineChartSeries } from "../../src/components/line-chart";
import { CHART_COLORS } from "../../src/components/bar-chart";

const meta = {
  title: "Charts/SimpleLineChart",
  component: SimpleLineChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SimpleLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const weekData = [
  { dia: "Seg", leads: 12, chats: 28 },
  { dia: "Ter", leads: 18, chats: 35 },
  { dia: "Qua", leads: 15, chats: 41 },
  { dia: "Qui", leads: 24, chats: 30 },
  { dia: "Sex", leads: 31, chats: 52 },
  { dia: "Sab", leads: 8, chats: 18 },
  { dia: "Dom", leads: 5, chats: 10 },
];

export const SingleLine: Story = {
  args: {
    data: weekData,
    xAxisKey: "dia",
    series: [{ dataKey: "leads", name: "Leads", color: CHART_COLORS[0] }] as LineChartSeries[],
    height: 260,
    className: "w-[500px]",
  },
};

export const MultiLines: Story = {
  args: {
    data: weekData,
    xAxisKey: "dia",
    series: [
      { dataKey: "leads", name: "Leads", color: CHART_COLORS[0] },
      { dataKey: "chats", name: "Conversas", color: CHART_COLORS[1] },
    ] as LineChartSeries[],
    height: 260,
    className: "w-[500px]",
  },
};

export const WithDots: Story = {
  args: {
    data: weekData,
    xAxisKey: "dia",
    series: [
      { dataKey: "leads", name: "Leads", color: CHART_COLORS[0], dot: true },
      { dataKey: "chats", name: "Conversas", color: CHART_COLORS[1], dot: true },
    ] as LineChartSeries[],
    height: 260,
    className: "w-[500px]",
  },
};

export const ThickLine: Story = {
  args: {
    data: weekData,
    xAxisKey: "dia",
    series: [
      {
        dataKey: "leads",
        name: "Leads",
        color: "#22c55e",
        strokeWidth: 3,
        dot: true,
      },
    ] as LineChartSeries[],
    height: 220,
    className: "w-[400px]",
  },
};
