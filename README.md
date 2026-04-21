# @simplafy-tec/ui

Design System do ecossistema Simplafy — componentes, tokens semânticos, Tailwind 4 preset.

## Instalação

```bash
pnpm add @simplafy-tec/ui
```

Requer `.npmrc` no projeto consumidor:

```
@simplafy-tec:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Uso

```tsx
import { Button, Badge, Input } from "@simplafy-tec/ui";
import "@simplafy-tec/ui/globals.css";
```

## Storybook

- **Produção:** https://design.simplafy.com.br
- **Local:** `pnpm storybook`

## Componentes

Ver `COMPONENTS.md` para tabela completa de decisão.

---

## Design System

### Fonte de verdade

Protótipos e decisões visuais no **Claude Design** (claude.ai/design) — projeto "Simplafy Design System".

### Tokens canônicos

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#22C55E` oklch(0.72 0.19 150) | Produto (Hub, Saúde, Seguros) |
| Brand green | `#1DEF3B` | Marketing, logo, OG images |
| Font produto | Geist (display + body) | Títulos + corpo no app |
| Font marca | Causten ExtraBold | Hero site, logo, decks |
| Font mono | Geist Mono | Código, R$, IDs |

### Escala de radius

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 2px | Badge, barras chart |
| sm | 4px | Nav item, icon button, tabs |
| md | 6px | Input, Select, Textarea, Button |
| lg | 8px | Card, KPI, Sheet, Popover |
| xl | 10px | Hero marketing |
| full | 9999px | Switch, avatar, profile button |

### Superfícies

| Produto | Status | Migração |
|---------|--------|----------|
| Hub v2 | ✅ Canônico | Fonte do DS |
| Saúde | 🟡 HSL legacy | Migrar para oklch + Geist + @simplafy-tec/ui |
| Seguros | 🟡 Absorvido Hub | Variante amber/orange |
| Site | 🔴 Dark marketing | Tokens base + override marketing |

### Fluxo de prototipação

1. Prototipar no Claude Design
2. Iterar com PO → aprovação
3. Exportar handoff bundle
4. Implementar via Claude Code

### Links

- Storybook: [design.simplafy.com.br](https://design.simplafy.com.br)
- Documentação detalhada: [docs/](./docs/)
