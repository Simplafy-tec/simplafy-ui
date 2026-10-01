"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

const Tabs = TabsPrimitive.Root;

/**
 * `underline` (padrão): abas de página, sublinhado + `text-primary` no ativo.
 * `segmented`: grupo em pílula do protótipo — `.tab-group` + `.tab` (`kits/hub/hub.css:806/815`)
 * e `.view-toggle` (:1940): fundo `--color-muted`, ativo = card + foreground + sombra
 * (Platform#2.1.1.10). O trigger lê a variante do `TabsList` pai.
 */
export type TabsListVariant = "underline" | "segmented";
const TabsListVariantContext = React.createContext<TabsListVariant>("underline");

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsListVariant;
}

const TabsList = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "underline", ...props }, ref) => (
    <TabsListVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        ref={ref}
        data-variant={variant}
        className={cn(
          variant === "segmented"
            ? "inline-flex min-w-0 max-w-full gap-0.5 overflow-x-auto rounded-sm bg-muted p-[3px] text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex border-b text-muted-foreground",
          className,
        )}
        {...props}
      />
    </TabsListVariantContext.Provider>
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsListVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        variant === "segmented"
          ? "inline-flex items-center justify-center whitespace-nowrap rounded-xs px-3 py-[5px] text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          : "-mb-px inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-primary",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
