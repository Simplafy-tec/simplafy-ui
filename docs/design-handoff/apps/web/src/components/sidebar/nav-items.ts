import {
  LayoutDashboard,
  MessageSquare,
  Funnel,
  Send,
  Zap,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  group: "business";
  /** Se ausente, oculto — todo item deve declarar papéis permitidos. */
  roles: string[];
}

/** Admin/Owner vê tudo. */
const ADMIN_UP: string[] = ["OWNER", "ADMIN"];

/** Negócios (MEMBER): Dashboard, Chat, CRM, Jornadas. */
const BIZ: string[] = ["OWNER", "ADMIN", "MEMBER"];

/** Técnico (VIEWER): só Configurações (seção Recursos). */
const TECH: string[] = ["OWNER", "ADMIN", "VIEWER"];

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    group: "business",
    roles: BIZ,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: MessageSquare,
    group: "business",
    roles: BIZ,
  },
  {
    label: "CRM",
    href: "/crm",
    icon: Funnel,
    group: "business",
    roles: BIZ,
  },
  {
    label: "Jornadas",
    href: "/jornadas",
    icon: Send,
    group: "business",
    roles: BIZ,
  },
  {
    label: "Execucoes",
    href: "/execucoes",
    icon: Zap,
    group: "business",
    roles: ADMIN_UP,
  },
  {
    label: "Agentes",
    href: "/agentes",
    icon: Bot,
    group: "business",
    roles: ADMIN_UP,
  },
  {
    label: "Configuracoes",
    href: "/settings",
    icon: Settings,
    group: "business",
    roles: TECH,
  },
];
