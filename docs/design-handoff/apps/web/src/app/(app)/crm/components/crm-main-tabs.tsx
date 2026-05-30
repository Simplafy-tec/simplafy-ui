"use client";

import { Button, cn } from "@simplafy-tec/ui";

export type CrmTab = "pipeline" | "contatos";

const CRM_TABS: { value: CrmTab; label: string }[] = [
  { value: "pipeline", label: "Pipeline" },
  { value: "contatos", label: "Contatos" },
];

interface CrmMainTabsProps {
  activeTab: CrmTab;
  onTabChange: (tab: CrmTab) => void;
}

export function CrmMainTabs({ activeTab, onTabChange }: CrmMainTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="CRM"
      className="crm-main-tabs inline-flex rounded-lg border border-border bg-muted/60 p-[3px] shadow-sm"
    >
      {CRM_TABS.map(({ value, label }) => {
        const isActive = activeTab === value;
        return (
          <Button
            key={value}
            id={`crm-tab-${value}`}
            type="button"
            variant="ghost"
            role="tab"
            aria-selected={isActive}
            aria-controls={`crm-panel-${value}`}
            onClick={() => onTabChange(value)}
            className={cn(
              "crm-main-tabs__btn h-auto rounded-lg px-[22px] py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
