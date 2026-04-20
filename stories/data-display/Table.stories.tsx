import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "../../src/components/table";
import { Badge } from "../../src/components/badge";

const meta = {
  title: "Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const leads = [
  { nome: "Maria Silva", telefone: "+55 11 99999-1111", estagio: "Novo", valor: "R$ 1.200" },
  { nome: "João Santos", telefone: "+55 21 98888-2222", estagio: "Em contato", valor: "R$ 3.500" },
  { nome: "Ana Costa", telefone: "+55 31 97777-3333", estagio: "Cotação", valor: "R$ 800" },
];

const stageBadge: Record<string, "blue" | "teal" | "purple" | "success"> = {
  "Novo": "blue",
  "Em contato": "teal",
  "Cotação": "purple",
};

export const Default: Story = {
  render: () => (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Estágio</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.nome}>
              <TableCell className="font-medium">{lead.nome}</TableCell>
              <TableCell>{lead.telefone}</TableCell>
              <TableCell>
                <Badge variant={stageBadge[lead.estagio] ?? "secondary"}>
                  {lead.estagio}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{lead.valor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">R$ 5.500</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

export const Simple: Story = {
  render: () => (
    <div className="w-96 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { produto: "Plano Básico", preco: "R$ 99/mês" },
            { produto: "Plano Pro", preco: "R$ 249/mês" },
            { produto: "Plano Enterprise", preco: "Sob consulta" },
          ].map((row) => (
            <TableRow key={row.produto}>
              <TableCell>{row.produto}</TableCell>
              <TableCell className="text-right">{row.preco}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
