"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, cn, Separator } from "@simplafy-tec/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@simplafy-tec/ui";
import {
  ArrowLeft,
  ArrowRightLeft,
  MessageSquare,
  PenLine,
  Plus,
  StickyNote,
  UserPlus,
} from "lucide-react";
import { useLead, useLeadActivities } from "@/hooks/use-crm";
import type { LeadActivity } from "@/types/crm";
import { CRM_STAGE_BADGE_CLASS, CRM_TEMP_BADGE } from "../../crm-badge-tokens";

/* ---------- Activity Icon ---------- */

const activityIcon: Record<LeadActivity["type"], React.ReactNode> = {
  NOTE: <StickyNote className="h-4 w-4 text-warning" />,
  CALL: <MessageSquare className="h-4 w-4 text-purple" />,
  EMAIL: <MessageSquare className="h-4 w-4 text-blue" />,
  MEETING: <Plus className="h-4 w-4 text-success" />,
  TASK: <Plus className="h-4 w-4 text-success" />,
  STATUS_CHANGE: <ArrowRightLeft className="h-4 w-4 text-orange" />,
  STAGE_CHANGE: <ArrowRightLeft className="h-4 w-4 text-blue" />,
};

const activityLabel: Record<LeadActivity["type"], string> = {
  NOTE: "Nota adicionada",
  CALL: "Ligação registrada",
  EMAIL: "E-mail registrado",
  MEETING: "Reunião registrada",
  TASK: "Tarefa criada",
  STATUS_CHANGE: "Status alterado",
  STAGE_CHANGE: "Estágio alterado",
};

/* ---------- Format Date ---------- */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------- Field Row ---------- */

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <p className="text-sm">{value ?? "—"}</p>
    </div>
  );
}

/* ---------- Page ---------- */

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: lead } = useLead(id);
  const { data: activities } = useLeadActivities(id);

  if (!lead) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link
          href="/crm"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao CRM
        </Link>
        <p className="text-muted-foreground">Lead não encontrado.</p>
      </div>
    );
  }

  const contact = lead.contact;
  const stageName = lead.stage?.name ?? "—";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back link */}
      <Link
        href="/crm"
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao CRM
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{contact?.name ?? "Sem nome"}</h1>
        <Badge
          variant="outline"
          className={cn("text-xs", CRM_STAGE_BADGE_CLASS[stageName] ?? "")}
        >
          {stageName}
        </Badge>
        {lead.temperature && (
          <Badge
            variant="outline"
            className={cn("text-xs", CRM_TEMP_BADGE[lead.temperature].className)}
          >
            {CRM_TEMP_BADGE[lead.temperature].label}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="conversas">Conversas</TabsTrigger>
          </TabsList>

          {/* ---- Dados ---- */}
          <TabsContent value="dados">
            <Card>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <Field label="Nome" value={contact?.name} />
                <Field label="Telefone" value={contact?.phone} />
                <Field label="Email" value={contact?.email} />
                <Field label="CPF" value={contact?.document} />
                <Field label="Empresa" value={contact?.company} />
                <Field label="Cargo" value={contact?.role} />
                <Field label="Estágio" value={stageName} />
                <Field
                  label="Temperatura"
                  value={
                    lead.temperature
                      ? CRM_TEMP_BADGE[lead.temperature].label
                      : undefined
                  }
                />
                <Field label="Canal" value={lead.channel} />
                <Field label="Origem" value={lead.source} />
                <div className="sm:col-span-2">
                  <Field label="Resumo" value={lead.summary} />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Notas" value={lead.notes} />
                </div>
                <Field
                  label="Valor"
                  value={
                    lead.value != null
                      ? `R$ ${lead.value.toLocaleString("pt-BR")}`
                      : undefined
                  }
                />
                <Field label="Score" value={lead.score} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Timeline ---- */}
          <TabsContent value="timeline">
            <Card>
              <CardContent className="p-6">
                {(!activities || activities.length === 0) && (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    Nenhuma atividade registrada
                  </p>
                )}
                <div className="space-y-4">
                  {activities?.map((act, idx) => (
                    <div key={act.id}>
                      <div className="flex items-start gap-3">
                        <div className="bg-muted mt-0.5 flex h-8 w-8 items-center justify-center rounded-full">
                          {activityIcon[act.type]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activityLabel[act.type]}
                          </p>
                          {act.content && (
                            <p className="text-muted-foreground text-sm">
                              {act.content}
                            </p>
                          )}
                          <p className="text-muted-foreground mt-1 text-xs">
                            {formatDate(act.createdAt)}
                          </p>
                        </div>
                      </div>
                      {idx < (activities?.length ?? 0) - 1 && (
                        <Separator className="ml-4 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Conversas ---- */}
          <TabsContent value="conversas">
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-12">
                <MessageSquare className="text-muted-foreground h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma conversa vinculada
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/chat">Ir para Chat</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Mover estágio
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Atribuir
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <PenLine className="mr-2 h-4 w-4" />
                Adicionar nota
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
