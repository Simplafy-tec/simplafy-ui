import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Selecione…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="opcao1">Opção 1</SelectItem>
        <SelectItem value="opcao2">Opção 2</SelectItem>
        <SelectItem value="opcao3">Opção 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Selecione um canal…" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Digital</SelectLabel>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="site">Site / formulário</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Tradicional</SelectLabel>
          <SelectItem value="telefone">Telefone</SelectItem>
          <SelectItem value="indicacao">Indicação</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithPreselected: Story = {
  render: () => (
    <Select defaultValue="whatsapp">
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="whatsapp">WhatsApp</SelectItem>
        <SelectItem value="email">Email</SelectItem>
        <SelectItem value="telefone">Telefone</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Desabilitado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>
  ),
};
