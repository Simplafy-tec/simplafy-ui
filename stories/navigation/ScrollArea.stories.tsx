import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "../../src/components/scroll-area";

const meta = {
  title: "Navigation/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
  desc: `Descrição do item ${i + 1}`,
}));

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-64 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Contatos</h4>
        {items.map((item) => (
          <div
            key={item.id}
            className="py-2 text-sm border-b border-border last:border-0"
          >
            {item.label}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-64 whitespace-nowrap rounded-md border">
      <div className="flex gap-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-md border border-border bg-card p-3 text-sm"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const TallContent: Story = {
  render: () => (
    <ScrollArea className="h-48 w-72 rounded-md border">
      <div className="p-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="text-sm">
            <span className="font-medium">{item.label}:</span> {item.desc}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
