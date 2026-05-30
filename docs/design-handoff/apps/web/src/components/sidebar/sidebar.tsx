"use client";

import { cn, Sheet, SheetContent, SheetTitle } from "@simplafy-tec/ui";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useMediaQuery } from "@simplafy-tec/ui";
import { APP_BASE_PATH } from "@/lib/app-base-path";
import { APP_HEADER_ROW_CLASS } from "@/lib/app-header-classes";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

/**
 * Logos do wireframe em `public/hub-logos/`.
 * Troca claro/escuro via `dark:` (classe no `<html>`), não via `useTheme` —
 * o estado React do tema só atualiza após o efeito e gerava logo errado no 1º paint.
 * - *claro.svg* = traço escuro para fundo claro do sidebar
 * - *escuro.svg* = traço claro para fundo escuro do sidebar
 */
function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  const base = `${APP_BASE_PATH}/hub-logos`;
  const openClaro = `${base}/logo_hub_aberto_claro.svg`;
  const openEscuro = `${base}/logo_hub_aberto_escuro.svg`;
  const closedClaro = `${base}/logo_hub_fechado_claro.svg`;
  const closedEscuro = `${base}/logo_hub_fechado_escuro.svg`;

  const sizeOpen = { w: 196, h: 69 };
  const sizeClosed = { w: 76, h: 61 };

  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        collapsed
          ? "w-full shrink-0 justify-center"
          : "min-w-0 flex-1 justify-start overflow-hidden",
      )}
    >
      {collapsed ? (
        <>
          <img
            src={closedClaro}
            alt="Simplafy Hub"
            width={sizeClosed.w}
            height={sizeClosed.h}
            decoding="async"
            className="h-auto max-h-[30px] w-auto max-w-[52px] object-contain object-center dark:hidden"
          />
          <img
            src={closedEscuro}
            alt="Simplafy Hub"
            width={sizeClosed.w}
            height={sizeClosed.h}
            decoding="async"
            className="hidden h-auto max-h-[30px] w-auto max-w-[52px] object-contain object-center dark:block"
          />
        </>
      ) : (
        <>
          <img
            src={openClaro}
            alt="Simplafy Hub"
            width={sizeOpen.w}
            height={sizeOpen.h}
            decoding="async"
            className="h-auto w-auto max-w-full object-contain object-left max-h-[34px] dark:hidden"
          />
          <img
            src={openEscuro}
            alt="Simplafy Hub"
            width={sizeOpen.w}
            height={sizeOpen.h}
            decoding="async"
            className="hidden h-auto w-auto max-w-full object-contain object-left max-h-[34px] dark:block"
          />
        </>
      )}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SidebarNav />
      <SidebarUser />
    </div>
  );
}

export function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebarStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Mobile: Sheet drawer
  if (!isDesktop) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>
          <div className="flex h-full min-h-0 flex-col">
            <div className={cn(APP_HEADER_ROW_CLASS, "px-4")}>
              <SidebarBrand collapsed={false} />
            </div>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex min-h-0 flex-col border-r bg-sidebar transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar-w",
      )}
    >
      <div
        className={cn(
          APP_HEADER_ROW_CLASS,
          collapsed ? "justify-center px-1.5" : "px-3",
        )}
      >
        <SidebarBrand collapsed={collapsed} />
      </div>

      <SidebarContent />
    </aside>
  );
}
