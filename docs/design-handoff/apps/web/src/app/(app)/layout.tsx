"use client";

import { cn } from "@simplafy-tec/ui";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Topbar } from "@/components/topbar/topbar";
import { GlobalModal } from "@/components/modals/global-modal";
import { ToastContainer } from "@/components/toast/toast-container";
import { CommandPalette } from "@/components/command-palette/command-palette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-200",
          collapsed ? "lg:ml-sidebar-collapsed" : "lg:ml-sidebar-w",
        )}
      >
        <Topbar />
        <main className="flex min-h-0 flex-1 flex-col p-4 lg:p-6">{children}</main>
      </div>
      <GlobalModal />
      <ToastContainer />
      <CommandPalette />
    </div>
  );
}
