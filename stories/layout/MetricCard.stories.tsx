import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard } from "../../src/components/metric-card";
import { Users, TrendingUp, DollarSign, Target } from "lucide-react";

const meta = {
  title: "Layout/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrendUp: Story = {
  args: {
    label: "Leads este mês",
    value: "247",
    trend: { value: "+12%", direction: "up" },
    icon: <Users className="h-4 w-4" />,
  },
};

export const TrendDown: Story = {
  args: {
    label: "Taxa de churn",
    value: "3,2%",
    trend: { value: "-0.5%", direction: "down" },
    icon: <TrendingUp className="h-4 w-4" />,
  },
};

export const Neutral: Story = {
  args: {
    label: "Conversas ativas",
    value: "58",
    trend: { value: "0%", direction: "neutral" },
  },
};

export const WithRevenue: Story = {
  args: {
    label: "Receita mensal",
    value: "R$ 48.200",
    trend: { value: "+23%", direction: "up" },
    icon: <DollarSign className="h-4 w-4" />,
  },
};

export const WithoutTrend: Story = {
  args: {
    label: "Meta do mês",
    value: "500 leads",
    icon: <Target className="h-4 w-4" />,
  },
};

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricCard
        label="Leads totais"
        value="1.284"
        trend={{ value: "+18%", direction: "up" }}
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        label="Receita MRR"
        value="R$ 62.400"
        trend={{ value: "+8%", direction: "up" }}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        label="Churn rate"
        value="2,1%"
        trend={{ value: "+0.3%", direction: "down" }}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <MetricCard
        label="Conversão"
        value="14,7%"
        trend={{ value: "0%", direction: "neutral" }}
        icon={<Target className="h-4 w-4" />}
      />
    </div>
  ),
};
