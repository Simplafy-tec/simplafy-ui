import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="pipeline" className="w-96">
      <TabsList>
        <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        <TabsTrigger value="contatos">Contatos</TabsTrigger>
        <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
      </TabsList>
      <TabsContent value="pipeline" className="p-4">
        <p className="text-sm text-muted-foreground">Visualização do pipeline Kanban.</p>
      </TabsContent>
      <TabsContent value="contatos" className="p-4">
        <p className="text-sm text-muted-foreground">Lista de contatos cadastrados.</p>
      </TabsContent>
      <TabsContent value="relatorios" className="p-4">
        <p className="text-sm text-muted-foreground">Relatórios e métricas.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="ativo" className="w-72">
      <TabsList>
        <TabsTrigger value="ativo">Ativo</TabsTrigger>
        <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
        <TabsTrigger value="arquivado" disabled>Arquivado</TabsTrigger>
      </TabsList>
      <TabsContent value="ativo" className="p-3">
        <p className="text-sm">Campanhas ativas</p>
      </TabsContent>
      <TabsContent value="rascunho" className="p-3">
        <p className="text-sm">Rascunhos</p>
      </TabsContent>
    </Tabs>
  ),
};

export const CrmStyleTabs: Story = {
  render: () => (
    <Tabs defaultValue="pipeline" className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        <TabsTrigger value="contatos">Contatos</TabsTrigger>
      </TabsList>
      <TabsContent value="pipeline" className="mt-4">
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          Kanban board aqui
        </div>
      </TabsContent>
      <TabsContent value="contatos" className="mt-4">
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          Tabela de contatos aqui
        </div>
      </TabsContent>
    </Tabs>
  ),
};
