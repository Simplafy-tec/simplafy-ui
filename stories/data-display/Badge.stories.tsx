import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../src/components/badge";

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "success",
        "warning",
        "teal",
        "blue",
        "purple",
        "orange",
        "outline",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Novo" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secundário" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Cancelado" },
};

export const Success: Story = {
  args: { variant: "success", children: "Convertido" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Atenção" },
};

export const Teal: Story = {
  args: { variant: "teal", children: "Respondeu" },
};

export const Blue: Story = {
  args: { variant: "blue", children: "Em contato" },
};

export const Purple: Story = {
  args: { variant: "purple", children: "Cotação" },
};

export const Orange: Story = {
  args: { variant: "orange", children: "Hot" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Rascunho" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>default</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="destructive">destructive</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="warning">warning</Badge>
      <Badge variant="teal">teal</Badge>
      <Badge variant="blue">blue</Badge>
      <Badge variant="purple">purple</Badge>
      <Badge variant="orange">orange</Badge>
      <Badge variant="outline">outline</Badge>
    </div>
  ),
};
