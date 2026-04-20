import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../../src/components/separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <div>
        <h4 className="text-sm font-medium">Seção A</h4>
        <p className="text-sm text-muted-foreground">Conteúdo da seção A.</p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium">Seção B</h4>
        <p className="text-sm text-muted-foreground">Conteúdo da seção B.</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Pipeline</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Contatos</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Relatórios</span>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <div>
        <h4 className="text-sm font-medium">Dados pessoais</h4>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Nome: Maria Silva</p>
          <p>Email: maria@empresa.com</p>
        </div>
      </div>
      <div className="relative flex items-center">
        <Separator className="flex-1" />
        <span className="mx-3 text-xs text-muted-foreground">Dados comerciais</span>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>Empresa: Simplafy LTDA</p>
        <p>Cargo: CEO</p>
      </div>
    </div>
  ),
};
