# Documentação — Simplafy Design System

## Fonte de verdade (marca + kits + referência visual)

**[`design-system/`](./design-system/)** — pacote canônico exportado do Claude Design (2026-06).

| Começar por | Arquivo |
|-------------|---------|
| Visão geral | [`design-system/README.md`](./design-system/README.md) |
| Tokens da marca | [`design-system/tokens.css`](./design-system/tokens.css) |
| Qual kit usar | [`design-system/ui_kits/_index.md`](./design-system/ui_kits/_index.md) |
| Componentes React (prod) | [`../COMPONENTS.md`](../COMPONENTS.md) + [`../src/`](../src/) |
| Migração por produto | [`design-system/MIGRATION.md`](./design-system/MIGRATION.md) |
| Auditoria de gaps | [`design-system/AUDIT.md`](./design-system/AUDIT.md) |

## Duas camadas (não confundir)

| Camada | Onde | Uso |
|--------|------|-----|
| **Referência / spec** | `docs/design-system/` | Tokens, ui_kits, preview, PATTERNS, logos, fontes — **ler antes de desenhar** |
| **Pacote npm** | `src/` → `@simplafy-tec/ui` | Componentes React publicados — **usar em código de produção** |

## Histórico

- `docs/design-handoff/` (PR #6) → **substituído** por `docs/design-system/` (export completo com fontes e assets, jun/2026).
- `docs/ui_kits/` legado na raiz de `docs/` → **removido** (conteúdo vive em `design-system/ui_kits/`).
