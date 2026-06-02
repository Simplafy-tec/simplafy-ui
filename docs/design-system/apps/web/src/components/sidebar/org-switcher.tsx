"use client";

import { useSession } from "next-auth/react";
import { Building2, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@simplafy-tec/ui";
import { useSidebarStore } from "@/stores/sidebar-store";

export function OrgSwitcher() {
  const { data: session } = useSession();
  const { collapsed } = useSidebarStore();

  const products = session?.user?.products ?? [];
  const activeProduct = session?.user?.activeProduct;
  const activeOrg = products.find((p) => p.slug === activeProduct);

  if (collapsed) {
    return (
      <div className="flex justify-center px-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          S
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3 py-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <div className="flex-1 text-left">
            <p className="truncate text-sm font-medium">
              {activeOrg ? activeProduct : "Simplafy Hub"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {activeOrg?.role ?? "Sem organizacao"}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Organizacoes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {products.length === 0 ? (
          <DropdownMenuItem disabled>
            <Building2 className="mr-2 h-4 w-4" />
            Nenhuma organizacao
          </DropdownMenuItem>
        ) : (
          products.map((p) => (
            <DropdownMenuItem key={`${p.orgId}-${p.slug}`}>
              <Building2 className="mr-2 h-4 w-4" />
              {p.slug}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
