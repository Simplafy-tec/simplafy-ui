# simplafy-ui — Claude Code Instructions

## Design System

- **Referência canônica (marca, tokens, ui_kits):** `docs/design-system/` — ler `README.md` e `ui_kits/_index.md` antes de qualquer UI.
- **Código publicado:** `src/` → `@simplafy-tec/ui` no GitHub Packages.
- **Storybook:** design.simplafy.com.br

## Regras

- Token novo → primeiro em `docs/design-system/tokens.css`, depois propagar para `src/globals.css` / `tailwind-preset.ts`.
- Componente novo reutilizável → `src/components/`, documentar em `COMPONENTS.md` + Storybook.
- pt-BR em todo texto visível ao usuário.
