/**
 * Paleta de badges alinhada ao wireframe Hub 2.0.
 * Usa design tokens de @simplafy-tec/ui (globals.css) — zero hex hardcodado.
 */

/** Estágios de funil (Novo = blue, Em contato = warning, etc.) */
export const CRM_STAGE_BADGE_CLASS: Record<string, string> = {
  Novo: "border-blue/20 bg-blue/8 text-blue",
  "Em contato": "border-warning/20 bg-warning/8 text-warning",
  Respondeu: "border-success/20 bg-success/8 text-success",
  Cotação: "border-purple/20 bg-purple/8 text-purple",
  Convertido: "border-success/20 bg-success/8 text-success",
};

/** Contadores de coluna no Kanban — mesmos tons dos estágios */
export const CRM_STAGE_COUNT_BADGE_CLASS = CRM_STAGE_BADGE_CLASS;

/** Temperatura: Hot = success; Warm = warning; Cold = teal */
export const CRM_TEMP_BADGE = {
  hot: {
    label: "Hot",
    className: "border-success/20 bg-success/8 text-success",
  },
  warm: {
    label: "Warm",
    className: "border-warning/20 bg-warning/8 text-warning",
  },
  cold: {
    label: "Cold",
    className: "border-teal/20 bg-teal/8 text-teal",
  },
} as const;

/** Badge "IA" / LIA no cartão Kanban */
export const CRM_AGENT_BADGE_CLASS = "border-blue/20 bg-blue/8 text-blue";
