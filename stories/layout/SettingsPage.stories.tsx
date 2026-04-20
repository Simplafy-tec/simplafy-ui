import type { Meta, StoryObj } from "@storybook/react";
import {
  SettingsInsetSection,
  SettingsPageHeader,
  SettingsSectionHeading,
} from "../../src/components/settings-page";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/components/tabs";

const meta = {
  title: "Layout/SettingsPage",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Primitivos de hierarquia para telas de Configurações: título de página, secção com borda e título de subsecção. Preferir estes em vez de misturar ALL CAPS, tamanhos arbitrários e pesos diferentes.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const HierarchyExample: Story = {
  render: () => (
    <div className="bg-background mx-auto max-w-[700px] rounded-xl border border-border p-6 shadow-sm">
      <div className="space-y-6">
        <SettingsPageHeader
          title="Coleção"
          description="Ajuste nome, descrição e fontes."
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="identificador" className="font-mono text-sm" />
          </div>
        </div>

        <SettingsInsetSection
          title="Fontes"
          description="PDFs, URL ou texto. O conteúdo é fragmentado e indexado para busca nas conversas."
        >
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">URL</TabsTrigger>
              <TabsTrigger value="b">Arquivo</TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="text-sm text-muted-foreground mt-2">
              Conteúdo do painel…
            </TabsContent>
            <TabsContent value="b" className="text-sm text-muted-foreground mt-2">
              …
            </TabsContent>
          </Tabs>
        </SettingsInsetSection>

        <div className="space-y-2">
          <SettingsSectionHeading>Estado dos envios</SettingsSectionHeading>
          <div className="text-muted-foreground rounded-lg border border-border px-3 py-4 text-center text-sm">
            (lista de jobs)
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar</Button>
        </div>
      </div>
    </div>
  ),
};
