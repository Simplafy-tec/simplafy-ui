import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../../src/components/label";
import { Input } from "../../src/components/input";

const meta = {
  title: "Forms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Nome completo", htmlFor: "name" },
};

export const Required: Story = {
  render: () => (
    <Label htmlFor="req">
      Telefone <span className="text-destructive">*</span>
    </Label>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="demo-input">Email</Label>
      <Input id="demo-input" type="email" placeholder="nome@empresa.com" />
    </div>
  ),
};

export const RequiredWithInput: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="req-input">
        Nome completo <span className="text-destructive">*</span>
      </Label>
      <Input id="req-input" placeholder="Ex: Maria Silva" />
    </div>
  ),
};
