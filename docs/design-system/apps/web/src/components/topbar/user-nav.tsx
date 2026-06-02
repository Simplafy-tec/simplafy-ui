"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { HelpCircle, LogOut, Settings, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@simplafy-tec/ui";
import { useActiveOrgRole } from "@/hooks/use-active-org-role";

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "";
}

export function UserNav() {
  const { data: session } = useSession();
  const orgRole = useActiveOrgRole();
  const canOrgSettings =
    orgRole === "OWNER" || orgRole === "ADMIN" || orgRole === "VIEWER";
  const user = session?.user;
  const initials = getInitials(user?.name, user?.email);
  const hasPhoto = Boolean(user?.image?.trim());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-8 w-8 items-center justify-center rounded-full p-0"
        >
          {hasPhoto ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user!.image!} alt={user?.name ?? ""} />
              <AvatarFallback className="text-xs">
                {initials || <User className="h-4 w-4" aria-hidden />}
              </AvatarFallback>
            </Avatar>
          ) : initials ? (
            <span className="text-xs font-medium text-foreground">{initials}</span>
          ) : (
            <User className="h-5 w-5 text-muted-foreground" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        {canOrgSettings && (
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              {orgRole === "VIEWER"
                ? "Configurações (recursos)"
                : "Configurações do espaço"}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/ajuda">
            <HelpCircle className="mr-2 h-4 w-4" />
            Ajuda
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
