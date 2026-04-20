import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../src/components/checkbox";
import { Label } from "../../src/components/label";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { id: "unchecked" },
};

export const Checked: Story = {
  args: { id: "checked", defaultChecked: true },
};

export const Disabled: Story = {
  args: { id: "disabled", disabled: true },
};

export const DisabledChecked: Story = {
  args: { id: "disabled-checked", disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Aceito os termos de uso</Label>
    </div>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {["WhatsApp", "Email", "SMS", "Ligação"].map((channel) => (
        <div key={channel} className="flex items-center gap-2">
          <Checkbox id={`ch-${channel}`} />
          <Label htmlFor={`ch-${channel}`}>{channel}</Label>
        </div>
      ))}
    </div>
  ),
};
