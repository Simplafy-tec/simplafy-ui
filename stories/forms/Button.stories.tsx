import type { Meta, StoryObj } from "@storybook/react";
import { Loader2 } from "lucide-react";
import { Button } from "../../src/components/button";

const meta = {
  title: "Forms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Botão principal" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Excluir" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Secundário" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secundário" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Fantasma" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link" },
};

export const Small: Story = {
  args: { size: "sm", children: "Pequeno" },
};

export const Large: Story = {
  args: { size: "lg", children: "Grande" },
};

export const Icon: Story = {
  args: { size: "icon", children: <Loader2 className="h-4 w-4 animate-spin" /> },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Desabilitado" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
