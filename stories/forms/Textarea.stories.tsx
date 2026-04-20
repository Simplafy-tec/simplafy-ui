import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../../src/components/textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Digite sua mensagem…", className: "w-72" },
};

export const WithContent: Story = {
  args: {
    defaultValue:
      "Cliente interessado no plano Pro. Ligou ontem às 14h para tirar dúvidas sobre integrações.",
    className: "w-72",
    rows: 4,
  },
};

export const Tall: Story = {
  args: { placeholder: "Notas internas…", className: "w-72", rows: 8 },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Conteúdo bloqueado",
    readOnly: true,
    className: "w-72",
  },
};
