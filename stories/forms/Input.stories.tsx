import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Digite algo..." },
};

export const WithValue: Story = {
  args: { defaultValue: "João Silva", placeholder: "Nome" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Não editável", readOnly: true },
};

export const ErrorState: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="error-input">Email</Label>
      <Input
        id="error-input"
        type="email"
        placeholder="nome@empresa.com"
        className="border-destructive"
        defaultValue="emailinvalido"
      />
      <p className="text-xs text-destructive">Email inválido.</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="label-input">Nome completo</Label>
      <Input
        id="label-input"
        placeholder="Ex: Maria Silva"
        autoComplete="name"
      />
    </div>
  ),
};

export const TypeVariants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input type="text" placeholder="Texto" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Senha" />
      <Input type="number" placeholder="Número" />
      <Input type="search" placeholder="Pesquisar…" />
    </div>
  ),
};
