"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, Badge, ScrollArea } from "@simplafy-tec/ui";
import { NAV_ITEMS, type NavItem } from "./nav-items";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useThreads } from "@/hooks/use-threads";
import { useActiveOrgRole } from "@/hooks/use-active-org-role";

function NavLink({
  item,
  badgeValue,
}: {
  item: NavItem;
  badgeValue?: number;
}) {
  const pathname = usePathname();
  const { collapsed, setMobileOpen } = useSidebarStore();
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => setMobileOpen(false)}
      title={item.label}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-primary/10 hover:text-primary",
        isActive
          ? "rounded-r-lg border-l-2 border-primary bg-primary/10 text-primary"
          : "rounded-lg text-sidebar-foreground/70",
        collapsed && "justify-center rounded-lg border-l-0 px-2",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {badgeValue != null && badgeValue > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 justify-center px-1 text-xs"
            >
              {badgeValue}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}

export function SidebarNav() {
  const orgRole = useActiveOrgRole();
  const { data: threads } = useThreads();
  const chatUnreadTotal = useMemo(
    () =>
      threads?.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0) ?? 0,
    [threads],
  );

  const visibleItems = NAV_ITEMS.filter((i) => i.roles.includes(orgRole));

  return (
    <ScrollArea className="min-h-0 flex-1 px-3 py-2">
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const badgeValue =
            item.href === "/chat"
              ? chatUnreadTotal
              : (item.badge ?? undefined);
          return (
            <NavLink key={item.href} item={item} badgeValue={badgeValue} />
          );
        })}
      </nav>
    </ScrollArea>
  );
}
