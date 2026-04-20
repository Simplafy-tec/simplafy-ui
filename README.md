# @simplafy/ui

Design System do ecossistema Simplafy — componentes, tokens semânticos, Tailwind 4 preset.

## Instalação

```bash
pnpm add @simplafy/ui
```

Requer `.npmrc` no projeto consumidor:

```
@simplafy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Uso

```tsx
import { Button, Badge, Input } from "@simplafy/ui";
import "@simplafy/ui/globals.css";
```

## Storybook

- **Produção:** https://design.simplafy.com.br
- **Local:** `pnpm storybook`

## Componentes

Ver `COMPONENTS.md` para tabela completa de decisão.
