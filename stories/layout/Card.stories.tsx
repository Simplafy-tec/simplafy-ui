import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/card";
import { Button } from "../../src/components/button";
import { Badge } from "../../src/components/badge";

const meta = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="w-72">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Conteúdo simples do card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Lead: Maria Silva</CardTitle>
        <CardDescription>Cadastrado em 10/04/2026</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefone</span>
            <span>+55 11 99999-1111</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estágio</span>
            <Badge variant="teal">Em contato</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor</span>
            <span className="font-medium">R$ 2.400</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm">Abrir lead</Button>
        <Button size="sm" variant="outline">WhatsApp</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-72 cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Campanha Black Friday</CardTitle>
        <CardDescription>Iniciada em 01/11/2026</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Leads gerados</span>
          <span className="font-semibold">847</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const KanbanCard: Story = {
  render: () => (
    <Card className="w-64 cursor-grab border border-border bg-card shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">Maria Silva</p>
          <Badge variant="orange" className="shrink-0 text-[10px]">Hot</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">+55 11 99999-1111</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">R$ 1.200</span>
          <span className="text-xs text-muted-foreground">há 2 dias</span>
        </div>
      </CardContent>
    </Card>
  ),
};
