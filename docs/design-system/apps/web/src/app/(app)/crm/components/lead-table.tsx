"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  cn,
} from "@simplafy-tec/ui";
import { Search } from "lucide-react";
import type { Lead } from "@/types/crm";
import { CRM_STAGE_BADGE_CLASS, CRM_TEMP_BADGE } from "../crm-badge-tokens";
import {
  LEAD_COLUMN_DEFAULTS,
  ResizableTh,
  usePersistedColumnWidths,
} from "./crm-resizable-columns";

/** v2: reset de larguras antigas (ex.: coluna # esticada demais no localStorage) */
const LEAD_COL_STORAGE_KEY = "crm:lead-list-column-widths:v2";

/** Chaves do select "Ordenar por" — uma opção por coluna (A–Z / Z–A ou critério equivalente). */
type LeadListSort =
  | "rank"
  | "nome_asc"
  | "nome_desc"
  | "estagio"
  | "estagio_desc"
  | "resumo_asc"
  | "resumo_desc"
  | "temp"
  | "temp_desc"
  | "canal_asc"
  | "canal_desc"
  | "atualizado_desc"
  | "atualizado_asc";

const TEMP_ORDER: Record<NonNullable<Lead["temperature"]>, number> = {
  hot: 0,
  warm: 1,
  cold: 2,
};

function sortLeads(rows: Lead[], sort: LeadListSort): Lead[] {
  const arr = [...rows];
  const tempRank = (t: Lead["temperature"]) =>
    t != null ? (TEMP_ORDER[t] ?? 3) : 4;

  switch (sort) {
    case "rank":
      return arr;
    case "nome_asc":
      return arr.sort((a, b) =>
        (a.contact?.name ?? "").localeCompare(b.contact?.name ?? "", "pt-BR"),
      );
    case "nome_desc":
      return arr.sort((a, b) =>
        (b.contact?.name ?? "").localeCompare(a.contact?.name ?? "", "pt-BR"),
      );
    case "estagio":
      return arr.sort(
        (a, b) => (a.stage?.position ?? 0) - (b.stage?.position ?? 0),
      );
    case "estagio_desc":
      return arr.sort(
        (a, b) => (b.stage?.position ?? 0) - (a.stage?.position ?? 0),
      );
    case "resumo_asc":
      return arr.sort((a, b) =>
        (a.summary ?? "").localeCompare(b.summary ?? "", "pt-BR"),
      );
    case "resumo_desc":
      return arr.sort((a, b) =>
        (b.summary ?? "").localeCompare(a.summary ?? "", "pt-BR"),
      );
    case "temp":
      return arr.sort((a, b) => tempRank(a.temperature) - tempRank(b.temperature));
    case "temp_desc":
      return arr.sort((a, b) => tempRank(b.temperature) - tempRank(a.temperature));
    case "canal_asc":
      return arr.sort((a, b) =>
        (a.channel ?? "").localeCompare(b.channel ?? "", "pt-BR"),
      );
    case "canal_desc":
      return arr.sort((a, b) =>
        (b.channel ?? "").localeCompare(a.channel ?? "", "pt-BR"),
      );
    case "atualizado_desc":
      return arr.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case "atualizado_asc":
      return arr.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
  }
}

/* ---------- Time Ago ---------- */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

/* ---------- Lead Table ---------- */

interface LeadTableProps {
  leads: Lead[];
  onLeadClick?: (leadId: string) => void;
  /** Lead com painel lateral aberto — wireframe: linha em destaque (`data-state=selected`). */
  selectedLeadId?: string | null;
}

export function LeadTable({
  leads,
  onLeadClick,
  selectedLeadId = null,
}: LeadTableProps) {
  const { widths: colW, setColumnWidth } = usePersistedColumnWidths(
    LEAD_COL_STORAGE_KEY,
    LEAD_COLUMN_DEFAULTS,
  );

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [tempFilter, setTempFilter] = useState("all");
  const [canalFilter, setCanalFilter] = useState("all");
  const [sort, setSort] = useState<LeadListSort>("rank");

  const channels = useMemo(
    () => [
      ...new Set(
        leads.map((l) => l.channel).filter(Boolean) as string[],
      ),
    ],
    [leads],
  );

  const filtered = useMemo(() => {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.contact?.name ?? "").toLowerCase().includes(q) ||
          (l.summary ?? "").toLowerCase().includes(q),
      );
    }

    if (stageFilter !== "all") {
      result = result.filter((l) => l.stage?.name === stageFilter);
    }

    if (tempFilter === "none") {
      result = result.filter((l) => !l.temperature);
    } else if (tempFilter !== "all") {
      result = result.filter((l) => l.temperature === tempFilter);
    }

    if (canalFilter !== "all") {
      result = result.filter((l) => l.channel === canalFilter);
    }

    return sortLeads(result, sort);
  }, [leads, search, stageFilter, tempFilter, canalFilter, sort]);

  function handleClear() {
    setSearch("");
    setStageFilter("all");
    setTempFilter("all");
    setCanalFilter("all");
    setSort("rank");
  }

  const toolbarLabel =
    "text-[11px] font-semibold uppercase tracking-[0.03em] text-muted-foreground";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Wireframe: .crm-list-toolbar + .crm-list-toolbar__row */}
      <div className="crm-list-toolbar border-b border-border bg-muted px-4 py-4">
        <div className="crm-list-toolbar__row flex flex-wrap items-end gap-2.5">
          {/* Buscar — flex:1; min-width: min(100%,280px) */}
          <div className="crm-list-toolbar__field flex min-w-[min(100%,280px)] flex-1 flex-col gap-1">
            <label
              htmlFor="crm-list-search"
              className={toolbarLabel}
            >
              Buscar
            </label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
              <Input
                id="crm-list-search"
                type="search"
                autoComplete="off"
                placeholder="Nome, resumo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                className="crm-list-search w-full min-w-[200px] max-w-[min(420px,100%)] pl-9"
              />
            </div>
          </div>

          {/* Estágio */}
          <div className="crm-list-toolbar__field flex min-w-0 flex-col gap-1">
            <label className={toolbarLabel}>Estágio</label>
            <Select
              value={stageFilter}
              onValueChange={setStageFilter}
            >
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Em contato">Em contato</SelectItem>
                <SelectItem value="Respondeu">Respondeu</SelectItem>
                <SelectItem value="Cotação">Cotação</SelectItem>
                <SelectItem value="Convertido">Convertido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperatura */}
          <div className="crm-list-toolbar__field flex min-w-0 flex-col gap-1">
            <label className={toolbarLabel}>Temperatura</label>
            <Select
              value={tempFilter}
              onValueChange={setTempFilter}
            >
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="none">Sem tag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Canal */}
          <div className="crm-list-toolbar__field flex min-w-0 flex-col gap-1">
            <label className={toolbarLabel}>Canal</label>
            <Select
              value={canalFilter}
              onValueChange={setCanalFilter}
            >
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {channels.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenar por — mais largo (texto longo no wireframe) */}
          <div className="crm-list-toolbar__field flex min-w-0 flex-col gap-1">
            <label className={toolbarLabel}>Ordenar por</label>
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as LeadListSort)}
            >
              <SelectTrigger className="w-[min(100%,320px)] min-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[min(24rem,70vh)]">
                <SelectItem value="rank"># — Posição na lista (padrão)</SelectItem>
                <SelectItem value="nome_asc">Nome (A–Z)</SelectItem>
                <SelectItem value="nome_desc">Nome (Z–A)</SelectItem>
                <SelectItem value="estagio">Estágio (funil)</SelectItem>
                <SelectItem value="estagio_desc">Estágio (invertido)</SelectItem>
                <SelectItem value="resumo_asc">Resumo (A–Z)</SelectItem>
                <SelectItem value="resumo_desc">Resumo (Z–A)</SelectItem>
                <SelectItem value="temp">Temperatura (quente → frio)</SelectItem>
                <SelectItem value="temp_desc">Temperatura (frio → quente)</SelectItem>
                <SelectItem value="canal_asc">Canal (A–Z)</SelectItem>
                <SelectItem value="canal_desc">Canal (Z–A)</SelectItem>
                <SelectItem value="atualizado_desc">
                  Atualizado (recente primeiro)
                </SelectItem>
                <SelectItem value="atualizado_asc">
                  Atualizado (antigo primeiro)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aplicar / Limpar — wireframe: flex-end + gap 8px */}
          <div className="crm-list-toolbar__field flex flex-row items-end gap-2 pb-px">
            <Button
              type="button"
              className="h-10 min-h-[40px] px-4 text-sm font-semibold shadow-sm"
            >
              Aplicar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 min-h-[40px] border-border bg-card px-4 text-sm font-semibold shadow-sm"
              onClick={handleClear}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela — wireframe #crm-view-list thead + colunas redimensionáveis */}
      <Table id="crm-list-table" className="table-fixed w-full text-[13px]">
        <colgroup>
          <col style={{ width: colW.rank }} />
          <col style={{ width: colW.lead }} />
          <col style={{ width: colW.stage }} />
          <col style={{ width: colW.resumo }} />
          <col style={{ width: colW.temp }} />
          <col style={{ width: colW.canal }} />
          <col style={{ width: colW.atualizado }} />
        </colgroup>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <ResizableTh
              columnId="rank"
              colWidth={colW.rank}
              onWidthChange={setColumnWidth}
              minWidth={36}
              maxWidth={56}
              className="crm-col-rank h-auto bg-muted py-2.5 pl-2 pr-1.5 text-right text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              #
            </ResizableTh>
            <ResizableTh
              columnId="lead"
              colWidth={colW.lead}
              onWidthChange={setColumnWidth}
              minWidth={120}
              className="h-auto bg-muted px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Contato{" "}
              <span
                className="crm-sort-hint ml-1 text-[11px] font-normal opacity-50"
                title="Ordenação: use Ordenar por"
              >
                ↕
              </span>
            </ResizableTh>
            <ResizableTh
              columnId="stage"
              colWidth={colW.stage}
              onWidthChange={setColumnWidth}
              minWidth={96}
              className="h-auto bg-muted px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Estágio
            </ResizableTh>
            <ResizableTh
              columnId="resumo"
              colWidth={colW.resumo}
              onWidthChange={setColumnWidth}
              minWidth={120}
              className="hidden h-auto bg-muted px-3 py-2.5 md:table-cell text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Resumo
            </ResizableTh>
            <ResizableTh
              columnId="temp"
              colWidth={colW.temp}
              onWidthChange={setColumnWidth}
              minWidth={72}
              className="h-auto bg-muted px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Temp
            </ResizableTh>
            <ResizableTh
              columnId="canal"
              colWidth={colW.canal}
              onWidthChange={setColumnWidth}
              minWidth={80}
              className="hidden h-auto bg-muted px-3 py-2.5 sm:table-cell text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Canal
            </ResizableTh>
            <ResizableTh
              columnId="atualizado"
              colWidth={colW.atualizado}
              onWidthChange={setColumnWidth}
              minWidth={88}
              className="hidden h-auto bg-muted px-3 py-2.5 lg:table-cell text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Atualizado
            </ResizableTh>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                Nenhum lead encontrado
              </TableCell>
            </TableRow>
          )}
          {filtered.map((lead, idx) => {
            const rowSelected = selectedLeadId === lead.id;
            return (
            <TableRow
              key={lead.id}
              data-state={rowSelected ? "selected" : undefined}
              aria-selected={rowSelected}
              className={cn(
                "cursor-pointer border-b border-border transition-colors hover:bg-primary/10",
                "data-[state=selected]:bg-muted",
              )}
              onClick={() => onLeadClick?.(lead.id)}
            >
              <TableCell className="crm-col-rank max-w-0 truncate p-0 px-2 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                {idx + 1}
              </TableCell>
              <TableCell className="max-w-0 truncate px-3 py-2.5 font-semibold text-foreground">
                {lead.contact?.name ?? "Sem nome"}
              </TableCell>
              <TableCell className="max-w-0 px-3 py-2.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    CRM_STAGE_BADGE_CLASS[lead.stage?.name ?? ""] ??
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {lead.stage?.name ?? "—"}
                </Badge>
              </TableCell>
              <TableCell className="hidden max-w-0 truncate px-3 py-2.5 text-[13px] text-muted-foreground md:table-cell">
                {lead.summary ?? "—"}
              </TableCell>
              <TableCell className="max-w-0 px-3 py-2.5">
                {lead.temperature ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      CRM_TEMP_BADGE[lead.temperature].className,
                    )}
                  >
                    {CRM_TEMP_BADGE[lead.temperature].label}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden max-w-0 truncate px-3 py-2.5 text-[13px] sm:table-cell">
                {lead.channel ?? "—"}
              </TableCell>
              <TableCell className="hidden max-w-0 truncate px-3 py-2.5 text-xs text-muted-foreground lg:table-cell">
                {timeAgo(lead.updatedAt)}
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
