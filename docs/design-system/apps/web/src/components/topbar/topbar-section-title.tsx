"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/sidebar/nav-items";
import { APP_BASE_PATH } from "@/lib/app-base-path";

/** Rotas sem entrada em `NAV_ITEMS` (primeiro segmento após basePath). */
const EXTRA_LABELS: Record<string, string> = {
  profile: "Perfil",
  ajuda: "Ajuda",
};

function stripBasePath(pathname: string): string {
  const base = APP_BASE_PATH as string;
  if (base === "/") return pathname;
  if (pathname === base) return "/";
  if (pathname.startsWith(`${base}/`)) {
    const rest = pathname.slice(base.length);
    return rest || "/";
  }
  return pathname;
}

/** Título da área atual (mesmo rótulo do item ativo na sidebar). */
export function getSectionTitle(pathname: string): string {
  const path = stripBasePath(pathname);
  if (!path || path === "/") return "Dashboard";

  const sorted = [...NAV_ITEMS].sort((a, b) => b.href.length - a.href.length);
  for (const item of sorted) {
    if (item.href === "/") continue;
    if (path === item.href || path.startsWith(`${item.href}/`)) {
      return item.label;
    }
  }

  const first = path.split("/").filter(Boolean)[0];
  if (!first) return "Dashboard";
  return (
    EXTRA_LABELS[first] ?? first.charAt(0).toUpperCase() + first.slice(1)
  );
}

export function TopbarSectionTitle() {
  const pathname = usePathname() ?? "/";
  const title = useMemo(() => getSectionTitle(pathname), [pathname]);

  return (
    <span
      className="min-w-0 truncate text-sm font-medium text-foreground"
      title={title}
    >
      {title}
    </span>
  );
}
