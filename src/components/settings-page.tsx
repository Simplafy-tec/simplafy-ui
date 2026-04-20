import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Hierarquia típica em Configurações (Hub 2.0):
 * 1. **Página** — `SettingsPageHeader` (título display + descrição muted)
 * 2. **Bloco com borda** — `SettingsInsetSection` (subtítulo semibold + texto de apoio + conteúdo)
 * 3. **Subsecção** — `SettingsSectionHeading` (só título, mesmo peso do subtítulo do inset)
 *
 * Evitar misturar: títulos em ALL CAPS 11px, `text-[13px]` solto e `h3` com pesos diferentes na mesma tela.
 */

export type SettingsPageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

/** Título principal da página / painel (ex.: “Coleção”, “Usuários”). */
export function SettingsPageHeader({
  title,
  description,
  className,
}: SettingsPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-1", className)}>
      <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description != null && description !== "" ? (
        <p className="text-sm leading-snug text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}

export type SettingsInsetSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Secção agrupada com fundo leve e borda (ex.: bloco “Fontes” com tabs).
 * Título: `text-sm font-semibold` — mesmo nível que `SettingsSectionHeading`.
 */
export function SettingsInsetSection({
  title,
  description,
  children,
  className,
}: SettingsInsetSectionProps) {
  return (
    <section
      className={cn(
        "border-border bg-muted/10 rounded-xl border p-4",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description != null && description !== "" ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export type SettingsSectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

/** Título de subsecção fora do inset (ex.: “Estado dos envios”, lista antes da tabela). */
export function SettingsSectionHeading({
  children,
  className,
}: SettingsSectionHeadingProps) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}
