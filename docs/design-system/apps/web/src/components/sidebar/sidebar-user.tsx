"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import {
  User,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  cn,
} from "@simplafy-tec/ui";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useTheme } from "@/hooks/use-theme";
import { APP_BASE_PATH } from "@/lib/app-base-path";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Negócios",
  VIEWER: "Técnico",
  CLIENT: "Cliente",
};

const HOVER_CLOSE_MS = 200;

function getRoleLabel(role?: string | null): string {
  if (!role) return "Proprietário";
  return ROLE_LABELS[role.toUpperCase()] ?? role;
}

/** Primeira palavra do nome (wireframe `.user-name` na barra) ou parte local do e-mail */
function getSidebarDisplayName(name?: string | null, email?: string | null): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const first = trimmed.split(/\s+/)[0];
    if (first) return first;
  }
  const local = email?.split("@")[0]?.trim();
  if (local) return local;
  return "Conta";
}

/** Nome completo no painel ou fallback ao e-mail (sem iniciais soltas) */
function getPanelDisplayName(name?: string | null, email?: string | null): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;
  const local = email?.split("@")[0]?.trim();
  if (local) return local;
  return "Conta";
}

function getInitials(
  name?: string | null,
  email?: string | null,
  userId?: string | null,
): string {
  const fromName = name?.trim();
  if (fromName) {
    const parts = fromName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`
        .toUpperCase()
        .slice(0, 2);
    }
    return fromName.slice(0, 2).toUpperCase();
  }
  const local = email?.split("@")[0]?.trim();
  if (local) return local.slice(0, 2).toUpperCase();
  const id = userId?.replace(/-/g, "") ?? "";
  if (id.length >= 1) return (id + id).slice(0, 2).toUpperCase();
  return "?";
}

/** Hub 2.0 wireframe `.user-menu-item` — 13px medium, hover `--sidebar-active`, ícones 16px */
const menuItemClass =
  "flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-[13px] font-medium text-foreground outline-none transition-colors " +
  "mx-1 w-[calc(100%-0.5rem)] max-w-none " +
  "hover:bg-sidebar-accent focus-visible:bg-sidebar-accent " +
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20";

const menuIconClass = "h-4 w-4 shrink-0 opacity-[0.85]";

function AccountMenuPanel({
  user,
  roleLabel,
  theme,
  toggleTheme,
  onClose,
  className,
}: {
  user?: Session["user"];
  /** Wireframe: linha abaixo do nome (ex.: Proprietario) — não o e-mail */
  roleLabel: string;
  toggleTheme: () => void;
  theme: "light" | "dark";
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      role="menu"
      aria-label="Menu da conta"
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg",
        "pt-1.5 pb-2.5",
        className,
      )}
    >
      <div className="border-border border-b px-3 pt-2.5 pb-2">
        <p className="text-[13px] font-semibold leading-tight text-foreground">
          {getPanelDisplayName(user?.name, user?.email)}
        </p>
        <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">{roleLabel}</p>
      </div>

      <div className="mt-1 space-y-0.5 pb-0.5">
        <Link
          href="/profile"
          role="menuitem"
          className={menuItemClass}
          onClick={onClose}
        >
          <User className={menuIconClass} strokeWidth={2} />
          Meu perfil
        </Link>

        <Link
          href="/ajuda"
          role="menuitem"
          className={menuItemClass}
          onClick={onClose}
        >
          <HelpCircle className={menuIconClass} strokeWidth={2} />
          Ajuda
        </Link>

        <Button
          type="button"
          variant="ghost"
          role="menuitem"
          className={menuItemClass}
          onClick={() => {
            toggleTheme();
            onClose();
          }}
        >
          {theme === "dark" ? (
            <Sun className={menuIconClass} strokeWidth={2} />
          ) : (
            <Moon className={menuIconClass} strokeWidth={2} />
          )}
          {theme === "dark" ? "Modo claro" : "Modo escuro"}
        </Button>
      </div>

      {/* Wireframe `.user-menu-sep`: 1px border, margens laterais — não faixa full-bleed em bg-muted */}
      <div
        className="bg-border mx-2 my-1.5 h-px shrink-0"
        role="separator"
        aria-hidden
      />

      <div className="pb-0.5">
        <Button
          type="button"
          variant="ghost"
          role="menuitem"
          className={cn(
            menuItemClass,
            "text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive",
          )}
          onClick={() => {
            onClose();
            void signOut({ callbackUrl: `${APP_BASE_PATH}/login` });
          }}
        >
          <LogOut className={menuIconClass} strokeWidth={2} />
          Sair
        </Button>
      </div>
    </div>
  );
}

function useDismissOnOutsideAndEscape(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      onClose();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return ref;
}

function useHoverMenu() {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, [cancelScheduledClose]);

  const openMenu = useCallback(() => {
    cancelScheduledClose();
    setOpen(true);
  }, [cancelScheduledClose]);

  const close = useCallback(() => {
    cancelScheduledClose();
    setOpen(false);
  }, [cancelScheduledClose]);

  useEffect(() => () => cancelScheduledClose(), [cancelScheduledClose]);

  return {
    open,
    setOpen,
    openMenu,
    scheduleClose,
    cancelScheduledClose,
    close,
  };
}

export function SidebarUser() {
  const { data: session } = useSession();
  const { collapsed } = useSidebarStore();
  const { theme, toggleTheme } = useTheme();
  const user = session?.user;
  const roleLabel = getRoleLabel(user?.products?.[0]?.role);
  const sidebarName = getSidebarDisplayName(user?.name, user?.email);
  const accountTitle =
    "Menu da conta — o painel abre acima (hover, clique ou Tab)";

  const hover = useHoverMenu();
  const rootRef = useDismissOnOutsideAndEscape(hover.open, hover.close);

  if (collapsed) {
    return (
      <div
        className="relative z-20 flex shrink-0 justify-center overflow-visible p-2"
        ref={rootRef}
      >
        {/*
          Painel à direita da barra (`left-full`), não em flex ao lado do avatar —
          senão o grupo fica mais largo que a sidebar e o justify-center “corta” o menu na borda esquerda.
        */}
        <div
          className="relative"
          onMouseEnter={hover.openMenu}
          onMouseLeave={hover.scheduleClose}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-auto rounded-lg p-0 outline-none ring-sidebar-ring focus-visible:ring-2"
            aria-label="Menu da conta"
            aria-expanded={hover.open}
            aria-haspopup="menu"
            onClick={() => hover.setOpen((v) => !v)}
          >
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
                {getInitials(user?.name, user?.email, user?.id)}
              </AvatarFallback>
            </Avatar>
          </Button>

          {hover.open ? (
            <div
              className="absolute bottom-0 left-full z-[100] ml-2 w-56 max-w-[min(16rem,calc(100vw-1.5rem))]"
              onMouseEnter={hover.cancelScheduledClose}
              onMouseLeave={hover.scheduleClose}
            >
              <AccountMenuPanel
                user={user}
                roleLabel={roleLabel}
                toggleTheme={toggleTheme}
                theme={theme}
                onClose={hover.close}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-10 shrink-0 overflow-visible px-2 pb-3 pt-0"
      ref={rootRef}
    >
      <Separator className="mb-3" />
      <div
        className="flex w-full flex-col-reverse gap-2"
        onMouseEnter={hover.openMenu}
        onMouseLeave={hover.scheduleClose}
      >
        {/* Em column-reverse o 1º filho fica embaixo: botão primeiro, menu depois (acima). */}
        <Button
          type="button"
          variant="ghost"
          className="user-info group hover:bg-sidebar-accent h-auto w-full justify-start gap-2.5 rounded-lg px-2 py-2 text-left font-normal transition-colors"
          title={accountTitle}
          aria-expanded={hover.open}
          aria-haspopup="menu"
          onClick={() => hover.setOpen((v) => !v)}
        >
          <Avatar className="h-8 w-8 shrink-0 border-2 border-primary">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                {getInitials(user?.name, user?.email, user?.id)}
              </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[13px] font-medium leading-tight">{sidebarName}</p>
            <p className="text-muted-foreground truncate text-[11px] leading-tight">{roleLabel}</p>
          </div>
          <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-[0.45] transition-opacity group-hover:opacity-[0.65]" />
        </Button>

        {hover.open ? (
          <div
            className="min-w-0 w-full px-1"
            onMouseEnter={hover.cancelScheduledClose}
            onMouseLeave={hover.scheduleClose}
          >
            <AccountMenuPanel
              className="w-full"
              user={user}
              roleLabel={roleLabel}
              toggleTheme={toggleTheme}
              theme={theme}
              onClose={hover.close}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
