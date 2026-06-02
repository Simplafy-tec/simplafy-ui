"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Badge, Button, cn } from "@simplafy-tec/ui";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ChevronLeft } from "lucide-react";
import { useMoveLead } from "@/hooks/use-crm";
import { useCrmStore } from "@/stores/crm-store";
import type { Lead, PipelineStage } from "@/types/crm";
import {
  CRM_AGENT_BADGE_CLASS,
  CRM_STAGE_COUNT_BADGE_CLASS,
  CRM_TEMP_BADGE,
} from "../crm-badge-tokens";

function TempBadge({ temperature }: { temperature?: "hot" | "warm" | "cold" }) {
  if (!temperature) return null;
  const cfg = CRM_TEMP_BADGE[temperature];
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px]", cfg.className)}
    >
      {cfg.label}
    </Badge>
  );
}

/* ---------- Time Ago ---------- */

/** Uma linha como no wireframe: "Resumo · há 2h · via WhatsApp" */
function formatKanbanMeta(lead: Lead): string {
  const diff = Date.now() - new Date(lead.updatedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  let timePart: string;
  if (minutes < 60) timePart = `há ${minutes}min`;
  else if (minutes < 1440) timePart = `há ${Math.floor(minutes / 60)}h`;
  else timePart = `há ${Math.floor(minutes / 1440)}d`;

  const parts = [
    lead.summary?.trim(),
    timePart,
    lead.channel ? `via ${lead.channel}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

/* ---------- Lead Card (wireframe: .kanban-card) ---------- */

type LeadCardProps = {
  lead: Lead;
  overlay?: boolean;
  /** Para borda esquerda verde no estágio Convertido, como no wireframe */
  stageName?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const LeadCard = forwardRef<HTMLDivElement, LeadCardProps>(function LeadCard(
  { lead, overlay = false, stageName, className, style, ...props },
  ref,
) {
  const hasTags = lead.temperature || lead.agentId;
  const meta = formatKanbanMeta(lead);
  const isConverted = stageName === "Convertido";

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "kanban-card text-[12px] transition-[border-color,box-shadow,transform] duration-150",
        "mb-2 cursor-grab rounded-md border border-border bg-card p-3 last:mb-0",
        isConverted && "border-l-[3px] border-l-primary",
        overlay
          ? "rotate-1 cursor-grabbing shadow-lg ring-2 ring-primary/15"
          : [
              "hover:border-primary hover:shadow-sm motion-safe:hover:-translate-y-px",
              "active:cursor-grabbing",
            ],
        className,
      )}
      {...props}
    >
      <div className="kanban-card-name text-[13px] font-semibold leading-snug text-foreground">
        {lead.contact?.name ?? "Sem nome"}
      </div>
      {meta ? (
        <div className="kanban-card-meta mt-1 text-[11px] leading-snug text-muted-foreground">
          {meta}
        </div>
      ) : null}

      {hasTags && (
        <div className="kanban-card-tags mt-1.5 flex flex-wrap gap-1">
          <TempBadge temperature={lead.temperature} />
          {lead.agentId && (
            <Badge
              variant="outline"
              className={cn("text-[10px]", CRM_AGENT_BADGE_CLASS)}
            >
              LIA
            </Badge>
          )}
        </div>
      )}
    </div>
  );
});
LeadCard.displayName = "LeadCard";

/* ---------- Draggable Card ---------- */

function DraggableLeadCard({
  lead,
  stageName,
  onLeadClick,
  panelOpen,
}: {
  lead: Lead;
  stageName: string;
  onLeadClick?: (leadId: string) => void;
  panelOpen: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <LeadCard
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-state={panelOpen ? "selected" : undefined}
      aria-selected={panelOpen}
      lead={lead}
      stageName={stageName}
      className={cn(
        isDragging && "opacity-40",
        panelOpen && "bg-muted data-[state=selected]:bg-muted",
      )}
      onClick={() => !isDragging && onLeadClick?.(lead.id)}
    />
  );
}

/* ---------- Stage Column ---------- */

/** Mesma ideia do wireframe: uma coluna, transição de min/max-width ~220ms; SVG do chevron com flip ao colapsar. */
const RAIL_TRANSITION =
  "transition-[min-width,max-width,box-shadow] duration-[220ms] ease-out motion-reduce:transition-none";

/** Faixa superior da raia — wireframe: start=teal, mid=warning, fim=success */
function railAccentClass(index: number, total: number): string {
  if (total <= 1) {
    return "shadow-[inset_0_3px_0_0_var(--color-success)]";
  }
  if (index === 0) return "shadow-[inset_0_3px_0_0_var(--color-teal)]";
  if (index === total - 1) return "shadow-[inset_0_3px_0_0_var(--color-success)]";
  return "shadow-[inset_0_3px_0_0_var(--color-warning)]";
}

function railDataType(
  index: number,
  total: number,
): "start" | "mid" | "end" {
  if (total <= 1) return "end";
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "mid";
}

function StageColumn({
  stage,
  stageIndex,
  stageCount,
  leads,
  collapsed,
  onToggleCollapse,
  onLeadClick,
  selectedLeadId,
}: {
  stage: PipelineStage;
  stageIndex: number;
  stageCount: number;
  leads: Lead[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLeadClick?: (leadId: string) => void;
  selectedLeadId?: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const countColor =
    CRM_STAGE_COUNT_BADGE_CLASS[stage.name] ?? "bg-muted text-muted-foreground";

  return (
    <div
      ref={setNodeRef}
      data-rail-type={railDataType(stageIndex, stageCount)}
      data-rail-id={stage.id}
      className={cn(
        "kanban-col flex flex-shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-muted p-0",
        railAccentClass(stageIndex, stageCount),
        RAIL_TRANSITION,
        collapsed
          ? "kanban-col--collapsed min-w-[44px] max-w-[48px] shadow-sm"
          : "min-w-[280px] max-w-[min(280px,100%)]",
        isOver && !collapsed && "bg-muted/80",
        isOver && collapsed && "bg-muted/70",
      )}
    >
      {collapsed ? (
        <div
          className="flex min-h-[min(320px,55vh)] flex-col-reverse items-center justify-start gap-2.5 px-1.5 pb-3.5 pt-2.5"
          style={{ borderRadius: "inherit" }}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleCollapse}
            aria-expanded={false}
            aria-label="Expandir raia"
            title="Expandir raia"
            className="kanban-rail-collapse h-[26px] w-[26px] shrink-0 rounded-md border-border p-0 text-[0] leading-none text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          >
            <ChevronLeft
              className="kanban-rail-collapse-svg block h-3.5 w-3.5 opacity-85 transition-transform duration-200 ease-out motion-reduce:transition-none scale-x-[-1]"
              aria-hidden
            />
          </Button>
          <span className="kanban-col-title max-h-[min(240px,40vh)] flex-1 overflow-hidden text-ellipsis text-[13px] font-semibold leading-tight tracking-wide text-muted-foreground">
            <span
              className="inline-block"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                textOrientation: "mixed",
              }}
            >
              {stage.name}
            </span>
          </span>
        </div>
      ) : (
        <>
          <div className="kanban-col-header flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-border bg-card px-3 py-2.5">
            <div className="kanban-col-header-left flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="kanban-col-title font-display text-sm font-bold leading-tight text-foreground">
                {stage.name}
              </span>
              <Badge
                variant="outline"
                className={cn("kanban-rail-count text-xs", countColor)}
              >
                {leads.length}
              </Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleCollapse}
              aria-expanded={true}
              aria-label="Encolher raia"
              title="Encolher raia lateralmente"
              className="kanban-rail-collapse h-[26px] w-[26px] shrink-0 rounded-md border-border p-0 text-[0] leading-none text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            >
              <ChevronLeft
                className="kanban-rail-collapse-svg block h-3.5 w-3.5 opacity-85 transition-transform duration-200 ease-out motion-reduce:transition-none"
                aria-hidden
              />
            </Button>
          </div>

          <div className="kanban-col-body p-2">
            {leads.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Nenhum lead
              </p>
            )}
            {leads.map((lead) => (
              <DraggableLeadCard
                key={lead.id}
                lead={lead}
                stageName={stage.name}
                onLeadClick={onLeadClick}
                panelOpen={selectedLeadId === lead.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Kanban Board ---------- */

interface KanbanBoardProps {
  stages: PipelineStage[];
  leads: Lead[];
  pipelineId: string;
  onLeadClick?: (leadId: string) => void;
  selectedLeadId?: string | null;
}

export function KanbanBoard({
  stages,
  leads,
  pipelineId,
  onLeadClick,
  selectedLeadId = null,
}: KanbanBoardProps) {
  const { mutate: moveLead } = useMoveLead(pipelineId);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const collapsedStageIds =
    useCrmStore((s) => s.collapsedKanbanStageIdsByPipeline[pipelineId]) ?? [];
  const toggleKanbanStageCollapsed = useCrmStore(
    (s) => s.toggleKanbanStageCollapsed,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeLead = activeLeadId
    ? (leads.find((l) => l.id === activeLeadId) ?? null)
    : null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveLeadId(null);
    if (!over || active.id === over.id) return;
    const leadId = String(active.id);
    const newStageId = String(over.id);
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.stageId === newStageId) return;
    moveLead({ leadId, stageId: newStageId });
  }

  function toggleCollapse(stageId: string) {
    toggleKanbanStageCollapsed(pipelineId, stageId);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveLeadId(String(e.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveLeadId(null)}
    >
      <div className="kanban-scroll w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible pb-0.5 [-webkit-overflow-scrolling:touch]">
        <div
          id="crm-kanban-board"
          className="kanban flex w-max max-w-none gap-4 pb-4"
        >
          {stages.map((stage, index) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              stageIndex={index}
              stageCount={stages.length}
              leads={leads.filter((l) => l.stageId === stage.id)}
              collapsed={collapsedStageIds.includes(stage.id)}
              onToggleCollapse={() => toggleCollapse(stage.id)}
              onLeadClick={onLeadClick}
              selectedLeadId={selectedLeadId}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeLead && (
          <LeadCard
            lead={activeLead}
            overlay
            stageName={activeLead.stage?.name}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
