import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../../src/components/progress";

const meta = {
  title: "Data Display/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0, className: "w-72" },
};

export const Quarter: Story = {
  args: { value: 25, className: "w-72" },
};

export const Half: Story = {
  args: { value: 50, className: "w-72" },
};

export const ThreeQuarters: Story = {
  args: { value: 75, className: "w-72" },
};

export const Complete: Story = {
  args: { value: 100, className: "w-72" },
};

export const AllSteps: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} className="space-y-1">
          <p className="text-xs text-muted-foreground">{v}%</p>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
};
