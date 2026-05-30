"use client";

import { Menu } from "lucide-react";
import { Button, cn } from "@simplafy-tec/ui";
import { useSidebarStore } from "@/stores/sidebar-store";
import { APP_HEADER_ROW_CLASS } from "@/lib/app-header-classes";
import { TopbarSectionTitle } from "./topbar-section-title";

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(
        "h-[14px] w-[14px] shrink-0 transition-transform duration-200",
        collapsed && "rotate-180",
      )}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function Topbar() {
  const { collapsed, toggle, setMobileOpen } = useSidebarStore();

  return (
    <header
      className={cn(
        APP_HEADER_ROW_CLASS,
        "sticky top-0 z-20 bg-background px-4 lg:px-6",
      )}
    >
      {/* Left: hamburger (mobile) + colapsar sidebar (desktop) */}
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        >
          <SidebarToggleIcon collapsed={collapsed} />
        </Button>
        <TopbarSectionTitle />
      </div>
    </header>
  );
}
