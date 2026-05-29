# Changelog

## [1.2.0] — 2026-05-29

### Adicionado

- **`Empty`** — componente de estado vazio reutilizável (`illustration`, `title`, `description`, `actions`). Ports do Hub v2 vendado. (platform#2.2.1.3)
- **`ErrorBoundary`** — captura de erros de renderização com fallback padrão pt-BR e prop `fallback` customizável. (platform#2.2.1.3)
- **`ModalConfirm` / `Modal.Confirm`** — modal de confirmação composicional para ações destrutivas, com `data-testid` e suporte a `loading`. (platform#2.2.1.3)
- **`SkeletonCard`** — cartão placeholder composto sobre `Skeleton`; exportado via namespace `Skeleton.Card`. Tipo `SkeletonComponent` exportado. (platform#2.2.1.3)
- **Escala de radius canônica** (`--radius-xs/sm/md/lg/xl/2xl/3xl/pill`) no `globals.css` — valores DS v1.1.0 (6/8/10/14/16/18/24/999px). Shims `--radius-full` e `--radius-btn` para retrocompatibilidade. (platform#2.2.2.1)
- **`radius-2xl`, `radius-3xl`, `pill`** no `tailwind-preset.ts`. (platform#2.2.2.1)
- **Tokens aditivos** no `globals.css`: tints `--color-{primary,teal,blue,purple,amber,orange,red}-bg`, `--color-page-bg`, `--color-border-light`, `--chart-1..5`, `--doc-color-0..9`, `--shadow-sm/md/focus`, tracking `--tracking-{display,h,tight,eyebrow,mono}`. (platform#2.2.2.2)

### Alterado

- **`input.tsx`** — radius de `rounded-md` para `rounded-lg` (par visual com Select). (platform#2.2.1.3 / 2.2.2.3)
- **`textarea.tsx`** — radius de `rounded-md` para `rounded-lg` (par com Input). (platform#2.2.2.3)
- **`command.tsx`** — adicionado `aria-describedby={undefined}` no `DialogContent` interno (fix de acessibilidade a11y). (platform#2.2.1.3)

### Mantido sem alteração

- `select.tsx` — mantido 40px / `focus-visible` / `z-[110]` (superior ao DS-novo; NÃO regredido).
- `switch.tsx` — mantido `bg-muted-foreground/35` + `border-border/65` unchecked (acessibilidade WCAG; NÃO regredido).

## [1.1.1] — anterior

Versão base de referência.
