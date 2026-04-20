import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../src/components/switch";
import { Label } from "../../src/components/label";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { id: "sw-off" },
};

export const On: Story = {
  args: { id: "sw-on", defaultChecked: true },
};

export const Disabled: Story = {
  args: { id: "sw-disabled", disabled: true },
};

export const DisabledOn: Story = {
  args: { id: "sw-disabled-on", disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notif" />
      <Label htmlFor="notif">Receber notificações por email</Label>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      {[
        { id: "sw-1", label: "Notificações push", checked: true },
        { id: "sw-2", label: "Resumo semanal", checked: false },
        { id: "sw-3", label: "Alertas de leads", checked: true },
      ].map(({ id, label, checked }) => (
        <div key={id} className="flex items-center justify-between">
          <Label htmlFor={id} className="cursor-pointer">
            {label}
          </Label>
          <Switch id={id} defaultChecked={checked} />
        </div>
      ))}
    </div>
  ),
};
