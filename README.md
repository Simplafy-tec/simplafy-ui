# @simplafy-tec/ui

Design System do ecossistema Simplafy — componentes, tokens semânticos, Tailwind 4 preset.


## Design System — referência canônica (marca + kits)

| O quê | Onde |
|-------|------|
| **Spec visual completa** | [`docs/design-system/`](docs/design-system/) |
| Tokens | [`docs/design-system/tokens.css`](docs/design-system/tokens.css) |
| Kits por produto | [`docs/design-system/ui_kits/_index.md`](docs/design-system/ui_kits/_index.md) |
| Componentes npm | `src/` (este repo) — ver [`COMPONENTS.md`](COMPONENTS.md) |
| Storybook | https://design.simplafy.com.br |

**Regra:** código de produção consome `@simplafy-tec/ui`; decisões de cor/tipo/kits vêm de `docs/design-system/`.

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

## Publicação

Por tag `v*` (`.github/workflows/publish.yml`), no GitHub Packages, em runner
hospedado pelo GitHub. **Sem tag, nada é publicado**: o merge na `main` não
publica.

1. Numa PR para a `main`: bump de `version` no `package.json` e a entrada nova
   no `CHANGELOG.md`.
2. Depois do merge, crie a tag no commit de merge da `main` e envie:

   ```bash
   git checkout main && git pull
   git tag v<versão>        # igual ao `version` do package.json
   git push origin v<versão>
   ```

- **Travas:** o publish reprova se a tag não for igual a `v<version>` do
  `package.json` (tag sem bump bateria em `E409 Cannot publish over existing
  version`) e se o commit tagueado não estiver na `main`.
- **Gate:** lint, typecheck, testes e build rodam no CI da PR; o publish
  repete só o teste dos tokens e o build.

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
