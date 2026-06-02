"use client";

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import {
  cn,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@simplafy-tec/ui";
import type { Pipeline } from "@/types/crm";

interface PipelineToolbarProps {
  pipelines: Pipeline[];
  activePipelineId: string | null;
  viewMode: "kanban" | "list";
  onPipelineChange: (id: string) => void;
  onViewModeChange: (mode: "kanban" | "list") => void;
}

/** hub-wireframe.css: .crm-pipe-bar__select — altura 34px */
const PIPE_SELECT_H = "h-[34px] min-h-[34px]";

export function PipelineToolbar({
  pipelines,
  activePipelineId,
  viewMode,
  onPipelineChange,
  onViewModeChange,
}: PipelineToolbarProps) {
  return (
    <div
      className={cn(
        "crm-pipeline-toolbar mb-6 flex flex-wrap items-center justify-between gap-3 sm:gap-x-4",
        "[gap:12px_16px]",
      )}
    >
      {/* Wireframe: .crm-pipe-bar — dentro de .crm-pipeline-toolbar usa padding 3px 10px, radius 10px, gap 8px 10px */}
      <div
        className={cn(
          "crm-pipe-bar flex min-w-0 flex-[1_1_min(320px,100%)] items-center rounded-[10px] border border-border bg-muted",
          "px-2.5 py-[3px] [gap:8px_10px] max-[720px]:basis-full max-[720px]:min-w-0",
        )}
        aria-label="Pipeline ativo"
      >
        <div
          className={cn(
            "crm-list-toolbar__field crm-pipe-bar__pipe-field flex min-w-0 flex-row items-center",
            "[gap:6px_8px]",
          )}
        >
          <label
            htmlFor="crm-pipeline-select"
            className="text-muted-foreground shrink-0 text-[10px] font-semibold uppercase leading-none tracking-[0.05em]"
          >
            Pipe ativo
          </label>
          <div className="min-w-0 flex-1 sm:w-80 sm:max-w-[20rem]">
            <Select
              value={activePipelineId ?? ""}
              onValueChange={onPipelineChange}
            >
              <SelectTrigger
                id="crm-pipeline-select"
                className={cn(PIPE_SELECT_H, "w-full min-w-[140px]")}
              >
                <SelectValue placeholder="Selecionar pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="crm-list-toolbar__field crm-pipe-bar__settings-btn flex shrink-0 items-center">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "crm-pipe-bar__edit-btn h-[34px] min-h-[34px] w-[38px] min-w-[38px] rounded-lg px-2.5 text-[15px] leading-none",
            )}
            asChild
          >
            <Link
              href={
                activePipelineId
                  ? `/settings?tab=pipelines&pipeline=${encodeURIComponent(activePipelineId)}`
                  : "/settings?tab=pipelines"
              }
              aria-label="Pipelines — Configuracoes"
              title="Configurar pipelines (CRM)"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Wireframe: .crm-pipeline-toolbar__actions — toggle + CTA */}
      <div
        className={cn(
          "crm-pipeline-toolbar__actions flex shrink-0 flex-wrap items-center gap-3",
          "max-[720px]:ml-0 max-[720px]:w-full max-[720px]:justify-end",
        )}
      >
        <div
          className="crm-view-toggle inline-flex gap-[3px] rounded-lg border border-border bg-muted p-[3px]"
          role="tablist"
          aria-label="Visualização do pipeline"
        >
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "crm-view-toggle__btn h-auto rounded-lg border-0 bg-transparent px-[18px] py-2 text-[13px] font-medium text-muted-foreground transition-colors",
              "hover:text-foreground",
              "aria-selected:bg-card aria-selected:font-semibold aria-selected:text-primary aria-selected:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20",
            )}
            role="tab"
            id="crm-tab-list"
            aria-selected={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
          >
            Lista
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "crm-view-toggle__btn h-auto rounded-lg border-0 bg-transparent px-[18px] py-2 text-[13px] font-medium text-muted-foreground transition-colors",
              "hover:text-foreground",
              "aria-selected:bg-card aria-selected:font-semibold aria-selected:text-primary aria-selected:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20",
            )}
            role="tab"
            id="crm-tab-kanban"
            aria-selected={viewMode === "kanban"}
            onClick={() => onViewModeChange("kanban")}
          >
            Kanban
          </Button>
        </div>

        {/* Wireframe: .hub-panel-primary-row com margin-inline do CRM (inline style mb-0 w-auto shrink-0) */}
        <div className="hub-panel-primary-row mb-0 flex w-auto shrink-0 justify-end">
          <Button className={cn(PIPE_SELECT_H, "px-4")} asChild>
            <Link href="/crm/novo-lead">
              <Plus className="mr-1 h-4 w-4" />
              Lead
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
