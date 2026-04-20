import type { Meta, StoryObj } from "@storybook/react";
import { ChartTooltip } from "../../src/components/chart-tooltip";

const meta = {
  title: "Charts/ChartTooltip",
  component: ChartTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChartTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePayload = [
  { name: "Leads", value: 42, color: "#22c55e" },
  { name: "Convertidos", value: 8, color: "#3b82f6" },
];

export const Basic: Story = {
  args: {
    active: true,
    payload: samplePayload,
    label: "Janeiro",
  },
};

export const SingleValue: Story = {
  args: {
    active: true,
    payload: [{ name: "Receita", value: 28400, color: "#22c55e" }],
    label: "Março",
  },
};

export const WithCustomFormatter: Story = {
  args: {
    active: true,
    payload: [{ name: "Receita MRR", value: 48200, color: "#22c55e" }],
    label: "Junho",
    formatter: (value, name) =>
      `${name}: R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  },
};

export const WithLabelFormatter: Story = {
  args: {
    active: true,
    payload: samplePayload,
    label: "2026-04-15",
    labelFormatter: (label) =>
      new Date(label).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    payload: samplePayload,
    label: "Janeiro",
  },
};
