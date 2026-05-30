"use client";

import { useState, useRef } from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckSquare,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  cn,
} from "@simplafy-tec/ui";
import type { Lead, ActivityType } from "@/types/crm";
import {
  useLeadActivities,
  useMoveLead,
  useUpdateContact,
  useUpdateLead,
  useAddLeadActivity,
  usePipelines,
} from "@/hooks/use-crm";
import { useToastStore } from "@/stores/toast-store";
import { CRM_STAGE_BADGE_CLASS, CRM_TEMP_BADGE } from "../crm-badge-tokens";
import {
  CRM_DRAWER_CONTENT_MOTION_CLASS,
  CRM_DRAWER_OVERLAY_CLASS,
} from "./crm-drawer-sheet-classes";

/* ---------- Utils ---------- */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

/* ---------- Sub-components ---------- */

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="crm-lead-section-label mb-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
      {title}
    </h3>
  );
}

function Block({
  variant,
  title,
  description,
  children,
}: {
  variant: "contact" | "pipeline";
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "crm-lead-block mb-5 rounded-[12px] border border-border px-[14px] pt-[14px] pb-6 last:mb-0",
        "bg-muted",
        variant === "contact" && "border-l-[3px] border-l-teal",
        variant === "pipeline" && "border-l-[3px] border-l-primary",
      )}
    >
      <div className="crm-lead-block-head mb-3">
        <h3 className="crm-lead-block-title mb-1 font-display text-[13px] font-bold leading-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="crm-lead-block-desc m-0 text-[12px] leading-[1.4] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Read-only field */
function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  const empty = value == null || value === "";
  return (
    <div className="form-group mb-2.5 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium leading-none text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "min-h-[42px] rounded-md border border-border px-3 py-2.5 text-sm leading-normal transition-colors",
          mono && "bg-muted font-mono text-xs text-muted-foreground",
          !mono && "bg-card",
          empty && "text-muted-foreground",
          !empty && !mono && "text-foreground",
        )}
      >
        {empty ? "—" : value}
      </div>
    </div>
  );
}

/** Click-to-edit inline field — blur/Enter commits, Escape cancels */
function InlineField({
  label,
  value,
  onSave,
  type = "text",
  multiline = false,
}: {
  label: string;
  value?: string | number | null;
  onSave: (val: string) => void;
  type?: "text" | "email" | "tel" | "number";
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const empty = value == null || value === "";

  function startEdit() {
    setDraft(String(value ?? ""));
    setEditing(true);
  }

  function commitEdit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== String(value ?? "").trim()) {
      onSave(trimmed);
    }
  }

  const sharedInputClass =
    "w-full rounded-md border border-primary bg-card px-3 py-2.5 text-sm leading-normal text-foreground outline-none ring-2 ring-primary/20 focus:ring-primary/30";

  if (editing) {
    return (
      <div className="form-group mb-2.5 last:mb-0">
        <label className="mb-1.5 block text-[13px] font-medium leading-none text-foreground">
          {label}
        </label>
        {multiline ? (
          <textarea
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
            }}
            className={cn(sharedInputClass, "resize-none")}
          />
        ) : (
          <input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            className={cn(sharedInputClass, "min-h-[42px]")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="form-group mb-2.5 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium leading-none text-foreground">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={startEdit}
        onKeyDown={(e) => e.key === "Enter" && startEdit()}
        title="Clique para editar"
        className={cn(
          "min-h-[42px] cursor-text rounded-md border border-border bg-card px-3 py-2.5 text-sm leading-normal",
          "transition-colors hover:border-primary/50",
          empty ? "text-muted-foreground" : "text-foreground",
          multiline && "whitespace-pre-wrap",
        )}
      >
        {empty ? "—" : value}
      </div>
    </div>
  );
}

/* ---------- Activity Icon ---------- */

function ActivityIcon({ type }: { type: ActivityType }) {
  const cls = "h-3.5 w-3.5";
  const map: Record<ActivityType, React.ReactNode> = {
    NOTE: <FileText className={cls} />,
    STAGE_CHANGE: <ArrowUpRight className={cls} />,
    STATUS_CHANGE: <RefreshCw className={cls} />,
    CALL: <Phone className={cls} />,
    EMAIL: <Mail className={cls} />,
    MEETING: <Calendar className={cls} />,
    TASK: <CheckSquare className={cls} />,
  };
  return <>{map[type] ?? <FileText className={cls} />}</>;
}

/* ---------- Activity Timeline ---------- */

function ActivityTimeline({ leadId }: { leadId: string }) {
  const { data: activities, isLoading } = useLeadActivities(leadId);
  const addActivity = useAddLeadActivity(leadId);
  const { add: addToast } = useToastStore();
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleAddNote() {
    const content = noteContent.trim();
    if (!content) return;
    addActivity.mutate(
      { type: "NOTE", content },
      {
        onSuccess: () => {
          setNoteContent("");
          setShowNoteForm(false);
          addToast({ variant: "success", title: "Nota adicionada" });
        },
      },
    );
  }

  const sorted = [...(activities ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="crm-lead-block mb-0 rounded-[12px] border border-border bg-muted px-[14px] pt-[14px] pb-5">
      <div className="crm-lead-block-head mb-3 flex items-center justify-between">
        <h3 className="crm-lead-block-title font-display text-[13px] font-bold leading-tight text-foreground">
          Histórico de atividades
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setShowNoteForm(true);
            setTimeout(() => textareaRef.current?.focus(), 50);
          }}
          className="h-auto gap-1 px-2.5 py-1 text-[12px] font-medium"
        >
          + Nota
        </Button>
      </div>

      {/* Inline note form */}
      {showNoteForm && (
        <div className="mb-3 rounded-md border border-border bg-card p-3">
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder="Escreva uma nota..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full resize-none rounded-md border border-border bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNoteForm(false);
                setNoteContent("");
              }}
              className="h-auto px-2.5 py-1 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAddNote}
              disabled={!noteContent.trim() || addActivity.isPending}
              className="h-auto px-3 py-1 text-xs"
            >
              {addActivity.isPending ? "Salvando…" : "Salvar nota"}
            </Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="py-4 text-center text-[12px] text-muted-foreground">
          Carregando atividades...
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-4 text-center text-[12px] text-muted-foreground">
          Nenhuma atividade registrada
        </div>
      ) : (
        <ol className="relative ml-[7px] space-y-0 border-l border-border/60">
          {sorted.map((act) => (
            <li key={act.id} className="pb-4 pl-4 last:pb-0">
              <span className="absolute -left-[7px] flex h-[14px] w-[14px] items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <ActivityIcon type={act.type} />
              </span>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] leading-snug text-foreground">
                  {act.content}
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {timeAgo(act.createdAt)}
                </span>
              </div>
              {act.user?.name && (
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <User className="h-3 w-3" />
                  {act.user.name}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ---------- Lead Drawer ---------- */

interface LeadDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onOpenContact?: (contactId: string) => void;
}

export function LeadDrawer({
  lead,
  open,
  onClose,
  onOpenContact,
}: LeadDrawerProps) {
  const { data: pipelines } = usePipelines();
  const updateContact = useUpdateContact();
  const updateLead = useUpdateLead();
  const moveLead = useMoveLead(lead?.pipelineId ?? null);
  const { add: addToast } = useToastStore();

  const contact = lead?.contact;
  const stageName = lead?.stage?.name;
  const stageColor =
    CRM_STAGE_BADGE_CLASS[stageName ?? ""] ??
    "bg-muted text-muted-foreground border-transparent";

  const activePipelineStages =
    pipelines?.find((p) => p.id === lead?.pipelineId)?.stages ?? [];

  const panelTitle =
    contact?.name?.trim() ? `Lead · ${contact.name.trim()}` : "Lead";

  function saveContact(field: string, value: string) {
    if (!contact?.id) return;
    updateContact.mutate(
      { contactId: contact.id, [field]: value },
      {
        onSuccess: () =>
          addToast({ variant: "success", title: "Contato atualizado" }),
      },
    );
  }

  function saveLead(field: string, value: string | number) {
    if (!lead?.id) return;
    updateLead.mutate({ leadId: lead.id, [field]: value });
  }

  function handleStageChange(stageId: string) {
    if (!lead?.id || stageId === lead.stageId) return;
    moveLead.mutate({ leadId: lead.id, stageId });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        overlayClassName={CRM_DRAWER_OVERLAY_CLASS}
        className={cn(
          CRM_DRAWER_CONTENT_MOTION_CLASS,
          "crm-lead-panel flex h-full min-h-0 max-h-dvh w-full max-w-[min(440px,100vw)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(440px,100vw)]",
          "border-l border-border bg-card shadow-[-12px_0_40px_rgba(0,0,0,0.1)]",
          "[&>button.absolute]:hidden",
        )}
      >
        {/* Header */}
        <div className="crm-lead-panel-head flex shrink-0 items-start justify-between gap-3 border-b border-border bg-card px-5 py-[18px]">
          <div className="min-w-0 flex-1 pr-2">
            <SheetTitle
              id="crm-lead-panel-title"
              className="font-display text-[17px] font-bold leading-tight text-foreground"
            >
              {panelTitle}
            </SheetTitle>
            <p className="crm-lead-panel-head-sub mt-1 text-[12px] leading-[1.35] text-muted-foreground">
              <strong className="font-semibold text-foreground">Contato</strong>{" "}
              é o cadastro reutilizável;{" "}
              <strong className="font-semibold text-foreground">card</strong> é
              a posição deste lead no funil. Clique num campo para editar.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar painel"
            className="hub-ibtn mt-0.5 h-9 w-9 shrink-0 text-muted-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </div>

        {/* Body */}
        <div className="crm-lead-panel-body flex-1 space-y-0 overflow-y-auto px-5 pb-6 pt-4">

          {/* ---- Block 1: Dados do contato (teal) ---- */}
          <Block
            variant="contact"
            title="Dados do contato"
            description="Dados do cadastro de contatos. Um mesmo contato pode ter vários cards em pipelines diferentes."
          >
            <div className="crm-lead-section mb-0 space-y-0">
              <SectionHeader title="Identificação" />
              <InlineField
                label="Nome completo"
                value={contact?.name}
                onSave={(v) => saveContact("name", v)}
              />
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <InlineField
                  label="Telefone"
                  value={contact?.phone}
                  type="tel"
                  onSave={(v) => saveContact("phone", v)}
                />
                <InlineField
                  label="Email"
                  value={contact?.email}
                  type="email"
                  onSave={(v) => saveContact("email", v)}
                />
              </div>
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <Field label="CPF / CNPJ" value={contact?.document} />
                <InlineField
                  label="Empresa"
                  value={contact?.company}
                  onSave={(v) => saveContact("company", v)}
                />
              </div>
              <InlineField
                label="Cargo"
                value={contact?.role}
                onSave={(v) => saveContact("role", v)}
              />
            </div>

            {contact?.id && onOpenContact && (
              <Button
                type="button"
                variant="link"
                onClick={() => onOpenContact(contact.id)}
                className="mt-3 h-auto p-0 text-[12px] font-medium text-primary"
              >
                Ver perfil completo →
              </Button>
            )}
          </Block>

          {/* ---- Block 2: Dados do lead (primary) ---- */}
          <Block
            variant="pipeline"
            title="Dados deste card no pipeline"
            description="Estágio, prioridade e vínculo com o funil neste pipeline."
          >
            <div className="crm-lead-section mb-5 space-y-0 last:mb-0">
              <SectionHeader title="Funil e prioridade" />
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                {/* Stage dropdown */}
                <div className="form-group mb-2.5 last:mb-0">
                  <label className="mb-1.5 block text-[13px] font-medium leading-none text-foreground">
                    Estágio
                  </label>
                  {activePipelineStages.length > 0 ? (
                    <select
                      value={lead?.stageId ?? ""}
                      onChange={(e) => handleStageChange(e.target.value)}
                      className="min-h-[42px] w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {activePipelineStages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex min-h-[42px] items-center rounded-md border border-border bg-card px-3 py-2">
                      {stageName ? (
                        <Badge
                          variant="outline"
                          className={cn("text-xs", stageColor)}
                        >
                          {stageName}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Temperatura toggle */}
                <div className="form-group mb-2.5 last:mb-0">
                  <label className="mb-1.5 block text-[13px] font-medium leading-none text-foreground">
                    Temperatura
                  </label>
                  <div className="flex min-h-[42px] items-center gap-1 rounded-md border border-border bg-card px-2 py-1">
                    {(["hot", "warm", "cold"] as const).map((t) => {
                      const cfg = CRM_TEMP_BADGE[t];
                      const active = lead?.temperature === t;
                      return (
                        <Button
                          key={t}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => saveLead("temperature", t)}
                          className={cn(
                            "h-auto rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                            active
                              ? cfg.className
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {cfg.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <InlineField
                  label="Canal"
                  value={lead?.channel}
                  onSave={(v) => saveLead("channel", v)}
                />
                <InlineField
                  label="Origem"
                  value={lead?.source}
                  onSave={(v) => saveLead("source", v)}
                />
              </div>
              <InlineField
                label="Resumo / interesse"
                value={lead?.summary}
                onSave={(v) => saveLead("summary", v)}
              />
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <InlineField
                  label="Valor estimado (R$)"
                  value={
                    lead?.value != null
                      ? lead.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })
                      : null
                  }
                  type="number"
                  onSave={(v) => {
                    const num = parseFloat(v);
                    if (!isNaN(num)) saveLead("value", num);
                  }}
                />
                <Field label="Prioridade (score)" value={lead?.score} />
              </div>
            </div>

            {/* Atribuição */}
            <div className="crm-lead-section mb-5 mt-0 space-y-0">
              <SectionHeader title="Atribuição" />
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <Field label="Agente IA" value={lead?.agentId ?? "—"} />
                <Field
                  label="Responsável (humano)"
                  value={lead?.assignedTo?.name}
                />
              </div>
            </div>

            {/* Integração e auditoria */}
            <div className="crm-lead-section mb-5 mt-0 space-y-0">
              <SectionHeader title="Integração e auditoria" />
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <Field
                  label="ID externo (Pipefy / CRM)"
                  value={lead?.externalId}
                  mono
                />
                <Field label="ID conversa Hub" value={lead?.threadId} mono />
              </div>
              <div className="crm-lead-grid2 grid grid-cols-2 gap-2.5">
                <Field
                  label="Criado em"
                  value={lead?.createdAt ? formatDate(lead.createdAt) : null}
                />
                <Field
                  label="Atualizado"
                  value={lead?.updatedAt ? formatDate(lead.updatedAt) : null}
                />
              </div>
            </div>

            {/* Notas internas */}
            <div className="crm-lead-section mb-0 mt-0 space-y-0">
              <SectionHeader title="Notas internas (card)" />
              <InlineField
                label="Observações (visível apenas à equipe)"
                value={lead?.notes}
                multiline
                onSave={(v) => saveLead("notes", v)}
              />
            </div>
          </Block>

          {/* ---- Block 3: Activity Timeline ---- */}
          {lead?.id && <ActivityTimeline leadId={lead.id} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
