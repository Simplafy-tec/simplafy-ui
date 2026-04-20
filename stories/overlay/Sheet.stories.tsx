import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../src/components/sheet";
import { Button } from "../../src/components/button";

const meta = {
  title: "Overlay/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir (direita)</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes do lead</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações do lead selecionado.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 text-sm text-muted-foreground">
          Conteúdo do painel lateral.
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir (esquerda)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu lateral</SheetTitle>
          <SheetDescription>Navegação do aplicativo.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir (baixo)</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Ações</SheetTitle>
          <SheetDescription>Escolha uma ação para continuar.</SheetDescription>
        </SheetHeader>
        <div className="flex gap-3 pt-4">
          <Button className="flex-1">Confirmar</Button>
          <Button variant="outline" className="flex-1">
            Cancelar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir (cima)</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Aviso</SheetTitle>
          <SheetDescription>
            Uma notificação importante aparece aqui.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
