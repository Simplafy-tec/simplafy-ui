import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../../src/components/skeleton";

const meta = {
  title: "Data Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextLine: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
};

export const Avatar: Story = {
  render: () => <Skeleton className="h-10 w-10 rounded-full" />,
};

export const Card: Story = {
  render: () => (
    <div className="w-72 space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  ),
};

export const TableRow: Story = {
  render: () => (
    <div className="w-full space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
      ))}
    </div>
  ),
};

export const MetricCardSkeleton: Story = {
  render: () => (
    <div className="flex gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-44 space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  ),
};
