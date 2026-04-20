import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../src/components/command";
import { Calculator, Calendar, CreditCard, Settings, User } from "lucide-react";

const meta = {
  title: "Navigation/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-72 rounded-lg border shadow-md">
      <CommandInput placeholder="Pesquisar…" />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendário</span>
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Contatos</span>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Cobranças</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculadora</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Empty: Story = {
  render: () => (
    <Command className="w-72 rounded-lg border shadow-md">
      <CommandInput placeholder="Pesquisar leads…" defaultValue="xyz123" />
      <CommandList>
        <CommandEmpty>Nenhum lead encontrado.</CommandEmpty>
      </CommandList>
    </Command>
  ),
};

export const CrmSearch: Story = {
  render: () => (
    <Command className="w-80 rounded-lg border shadow-md">
      <CommandInput placeholder="Buscar contatos ou leads…" />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Contatos">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            Maria Silva — +55 11 99999-1111
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            João Santos — +55 21 98888-2222
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Leads">
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Lead #42 — Plano Pro
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
