"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useCrmStore } from "@/stores/crm-store";
import { usePipelines, usePipelineLeads, useContacts, useLead } from "@/hooks/use-crm";
import { LeadTable } from "./components/lead-table";
import { CrmMainTabs, type CrmTab } from "./components/crm-main-tabs";
import { PipelineToolbar } from "./components/pipeline-toolbar";
import { ContactTable } from "./components/contact-table";
import { ContactDrawer } from "./components/contact-drawer";
import { LeadDrawer } from "./components/lead-drawer";

/** dnd-kit gera aria-describedby (DndDescribedBy-N) com contador que não bate SSR/cliente — só montar no browser. */
const KanbanBoard = dynamic(
  () =>
    import("./components/kanban-board").then((m) => ({ default: m.KanbanBoard })),
  {
    ssr: false,
    loading: () => (
      <div
        className="kanban-scroll w-full min-w-0 overflow-x-auto pb-0.5"
        aria-busy="true"
      >
        <div className="kanban flex w-max gap-4 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-muted p-0"
            >
              <div className="border-b border-border bg-card px-3 py-2.5">
                <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="space-y-2 p-2">
                <div className="h-24 animate-pulse rounded-md border border-border bg-card" />
                <div className="h-24 animate-pulse rounded-md border border-border bg-card" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
);

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState<CrmTab>("pipeline");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );

  const { selectedPipelineId, viewMode, setSelectedPipeline, setViewMode } =
    useCrmStore();
  const { data: pipelines } = usePipelines();
  const activePipelineId = selectedPipelineId ?? pipelines?.[0]?.id ?? null;
  const activePipeline = pipelines?.find((p) => p.id === activePipelineId);
  const { data: leads, isLoading: leadsLoading } = usePipelineLeads(activePipelineId);
  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const { data: selectedLead } = useLead(selectedLeadId ?? undefined);
  const selectedContact =
    contacts?.find((c) => c.id === selectedContactId) ?? null;

  function handleLeadClick(leadId: string) {
    setSelectedContactId(null);
    setSelectedLeadId(leadId);
  }

  function handleDrawerClose() {
    setSelectedLeadId(null);
  }

  function handleContactClick(contactId: string) {
    setSelectedLeadId(null);
    setSelectedContactId(contactId);
  }

  /** Abre o ContactDrawer a partir do LeadDrawer (sem fechar o lead) */
  function handleOpenContactFromLead(contactId: string) {
    setSelectedContactId(contactId);
  }

  function handleContactDrawerClose() {
    setSelectedContactId(null);
  }

  function handleNavigateToPipeline(pipelineId: string, leadId: string) {
    setSelectedContactId(null);
    setActiveTab("pipeline");
    setSelectedPipeline(pipelineId);
    setSelectedLeadId(leadId);
  }

  function handleTabChange(tab: CrmTab) {
    setActiveTab(tab);
    if (tab === "pipeline") setSelectedContactId(null);
    if (tab === "contatos") setSelectedLeadId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <CrmMainTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* -------- Pipeline Tab -------- */}
      <div
        id="crm-panel-pipeline"
        role="tabpanel"
        aria-labelledby="crm-tab-pipeline"
        hidden={activeTab !== "pipeline"}
        className="flex flex-col gap-4"
      >
        <PipelineToolbar
          pipelines={pipelines ?? []}
          activePipelineId={activePipelineId}
          viewMode={viewMode}
          onPipelineChange={(id) => setSelectedPipeline(id)}
          onViewModeChange={setViewMode}
        />

        {leadsLoading && !leads ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary mr-2" />
            Carregando leads…
          </div>
        ) : viewMode === "kanban" && activePipeline ? (
          <KanbanBoard
            stages={activePipeline.stages}
            leads={leads ?? []}
            pipelineId={activePipeline.id}
            onLeadClick={handleLeadClick}
            selectedLeadId={selectedLeadId}
          />
        ) : leads?.length === 0 && !leadsLoading ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum lead neste pipeline</p>
            <p className="mt-1 text-xs text-muted-foreground">Selecione outro pipeline ou adicione um novo lead.</p>
          </div>
        ) : (
          <LeadTable
            leads={leads ?? []}
            onLeadClick={handleLeadClick}
            selectedLeadId={selectedLeadId}
          />
        )}
      </div>

      {/* -------- Contatos Tab -------- */}
      <div
        id="crm-panel-contatos"
        role="tabpanel"
        aria-labelledby="crm-tab-contatos"
        hidden={activeTab !== "contatos"}
      >
        {contactsLoading && !contacts ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary mr-2" />
            Carregando contatos…
          </div>
        ) : (
          <ContactTable
            contacts={contacts ?? []}
            pipelines={pipelines ?? []}
            onContactClick={handleContactClick}
            openedContactId={selectedContactId}
          />
        )}
      </div>

      {/* -------- Lead Drawer -------- */}
      <LeadDrawer
        lead={selectedLead ?? null}
        open={selectedLeadId !== null}
        onClose={handleDrawerClose}
        onOpenContact={handleOpenContactFromLead}
      />
      <ContactDrawer
        contact={selectedContact}
        open={selectedContactId !== null}
        onClose={handleContactDrawerClose}
        onNavigateToPipeline={handleNavigateToPipeline}
      />
    </div>
  );
}
