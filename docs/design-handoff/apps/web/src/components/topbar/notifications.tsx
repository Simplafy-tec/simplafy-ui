"use client";

import { Bell } from "lucide-react";
import { Button, Badge } from "@simplafy-tec/ui";

interface NotificationsProps {
  count?: number;
}

export function Notifications({ count = 0 }: NotificationsProps) {
  return (
    <Button variant="ghost" size="icon" className="relative" aria-label="Notificacoes">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center px-1 text-[10px]">
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}
