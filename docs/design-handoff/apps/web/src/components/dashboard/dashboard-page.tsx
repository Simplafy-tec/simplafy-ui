"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@simplafy-tec/ui";
import {
  Bot,
  MessageSquare,
  Radio,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,

} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardBuilder } from "@/features/bi/components/dashboard-builder";

/* ---------- Mock Data ---------- */

const kpis = [
  {
    label: "Agentes Ativos",
    value: "3",
    icon: Bot,
    trend: "+1 este mês",
    trendUp: true,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Mensagens",
    value: "2.847",
    icon: MessageSquare,
    trend: "+18%",
    trendUp: true,
    iconBg: "bg-teal/10",
    iconColor: "text-teal",
  },
  {
    label: "Canais",
    value: "2",
    icon: Radio,
    trend: null,
    trendUp: false,
    iconBg: "bg-blue/10",
    iconColor: "text-blue",
  },
  {
    label: "Resolução",
    value: "94.2%",
    icon: CheckCircle2,
    trend: "+3.1pp",
    trendUp: true,
    iconBg: "bg-purple/10",
    iconColor: "text-purple",
  },
  {
    label: "Tempo Resposta",
    value: "1.8s",
    icon: Clock,
    trend: "-0.4s",
    trendUp: true,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
];

const messagesPerDay = [
  { dia: "Seg", mensagens: 320 },
  { dia: "Ter", mensagens: 450 },
  { dia: "Qua", mensagens: 380 },
  { dia: "Qui", mensagens: 520 },
  { dia: "Sex", mensagens: 480 },
  { dia: "Sáb", mensagens: 290 },
  { dia: "Dom", mensagens: 210 },
];

const agentPerformance = [
  { agente: "LIA Brasal", resolvidos: 142, em_andamento: 28, pendentes: 8 },
  { agente: "AME", resolvidos: 98, em_andamento: 15, pendentes: 5 },
  { agente: "LIA Vendas", resolvidos: 76, em_andamento: 22, pendentes: 12 },
];

const activityRows = [
  {
    evento: "Lead capturado — Maria Silva",
    agente: "LIA Brasal",
    canal: "WhatsApp",
    hora: "14:32",
    status: "Resolvido",
  },
  {
    evento: "Consulta apólice — CPF ***789",
    agente: "LIA Brasal",
    canal: "WhatsApp",
    hora: "14:28",
    status: "Em progresso",
  },
  {
    evento: "Card Pipefy criado — Voluntariado",
    agente: "AME",
    canal: "WhatsApp",
    hora: "14:15",
    status: "Resolvido",
  },
  {
    evento: "Jornada disparada — 15 leads",
    agente: "LIA Brasal",
    canal: "Outbound",
    hora: "11:00",
    status: "Aguardando",
  },
];

/* ---------- Badge helpers — semantic Tailwind classes (no hardcoded hex) ---------- */

function canalVariant(canal: string) {
  switch (canal) {
    case "WhatsApp":
      return "default" as const;
    case "Outbound":
      return "warning" as const;
    default:
      return "outline" as const;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "Resolvido":
      return "success" as const;
    case "Em progresso":
      return "blue" as const;
    case "Aguardando":
      return "warning" as const;
    default:
      return "outline" as const;
  }
}

/* ---------- Sub-components ---------- */

function OverviewContent() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-start gap-3 pt-5">
              <div
                className={`rounded-lg p-2 ${kpi.iconBg} ${kpi.iconColor}`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-3xl font-bold">{kpi.value}</p>
                <p className="text-muted-foreground text-sm">{kpi.label}</p>
                {kpi.trend && (
                  <p
                    className={`mt-1 flex items-center text-xs font-medium ${
                      kpi.trendUp ? "text-success" : "text-destructive"
                    }`}
                  >
                    {kpi.trendUp ? (
                      <ArrowUpRight className="mr-0.5 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-0.5 h-3 w-3" />
                    )}
                    {kpi.trend}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mensagens por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <AreaChart data={messagesPerDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-card-foreground)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mensagens"
                  name="Mensagens"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance dos Agentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <BarChart data={agentPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="agente"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-card-foreground)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "var(--color-muted-foreground)",
                  }}
                />
                <Bar
                  dataKey="resolvidos"
                  name="Resolvidos"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="em_andamento"
                  name="Em andamento"
                  fill="var(--color-teal)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pendentes"
                  name="Pendentes"
                  fill="var(--color-purple)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.evento}</TableCell>
                  <TableCell>{row.agente}</TableCell>
                  <TableCell>
                    <Badge variant={canalVariant(row.canal)}>
                      {row.canal}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.hora}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function BIBuilderContent() {
  const { data: session, status } = useSession();
  const products = session?.user?.products ?? [];
  /** Mesma regra do org-switcher: ativo no token, senão primeiro produto da lista. */
  const resolved =
    products.find((p) => p.slug === session?.user?.activeProduct) ??
    products[0];
  const orgId = resolved?.orgId as string | undefined;
  const userId = session?.user?.id as string | undefined;

  if (status === "loading") {
    return (
      <div className="flex h-96 items-center justify-center">
        <Skeleton className="h-40 w-full max-w-lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center px-4 text-center text-muted-foreground">
        Nenhuma organização vinculada a esta conta (sem produto ativo no Hub).
        Peça um convite ou fale com o administrador.
      </div>
    );
  }

  if (!userId || !orgId) {
    return (
      <div className="flex h-96 items-center justify-center px-4 text-center text-muted-foreground">
        Não foi possível obter o contexto da organização. Tente sair e entrar de
        novo.
      </div>
    );
  }

  return <DashboardBuilder orgId={orgId} userId={userId} />;
}

/* ---------- Main Component ---------- */

export function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isBuilderTab = searchParams.get("tab") === "montar-painel";

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div
        className="flex border-b"
        role="tablist"
        aria-label="Dashboard"
      >
        <Button
          role="tab"
          variant="ghost"
          aria-selected={!isBuilderTab}
          onClick={() => router.push("/")}
          className={cn(
            "rounded-none px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            !isBuilderTab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Visão geral
        </Button>
        <Button
          role="tab"
          variant="ghost"
          aria-selected={isBuilderTab}
          onClick={() => router.push("/?tab=montar-painel")}
          className={cn(
            "rounded-none px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            isBuilderTab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Montar painel
        </Button>
      </div>

      {/* Tab panels */}
      {isBuilderTab ? (
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 p-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            </div>
          }
        >
          <BIBuilderContent />
        </Suspense>
      ) : (
        <OverviewContent />
      )}
    </div>
  );
}
