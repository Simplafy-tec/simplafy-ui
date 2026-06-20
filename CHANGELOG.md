# Changelog

## [2.0.0] — 2026-05-29

### Alterado

- **⚠️ BREAKING: tipografia Causten/Geist substitui Inter/Sora.** `--font-sans` agora aponta para Geist (UI/corpo/títulos de produto); `--font-display` aponta para Causten (marca/hero; fallback Geist); `--font-mono` aponta para Geist Mono. Inter e Sora foram completamente removidos. (platform#2.2.2.4)
- **`globals.css`** — `@theme inline` reescrito: novos `@font-face` Causten (7 pesos, incluídas no pacote em `src/fonts/`), `@import` Google Fonts Geist + Geist Mono. Var `--font-inter`/`--font-sora` removidas.
- **`tailwind-preset.ts`** — `fontFamily.sans` = Geist, `fontFamily.display` = Causten, `fontFamily.mono` = Geist Mono adicionado.
- **`metric-card.tsx`** — valor numérico KPI corrigido de `font-display` para `font-sans` (Geist). Causten é pesada demais para KPI numérico (DS 2.0.0 Risco 5).
- **`package.json`** — `files` inclui `src/fonts/` para publicar as TTFs da Causten junto ao pacote.

## [2.1.0] — 2026-06-20

### Adicionado

- **`ProviderLogo`** — logos oficiais SVG (gdrive, dropbox, onedrive, box, s3, ftp) para tiles e cards de integração. (Hub#5.2.13.9)
- **`AccessBadge` / `AccessNote`** — distinção visual conta conectada vs link de terceiro. (Hub#5.2.13.9)
- **`SyncPill`** — pill de estado de sincronização (ativo, sincronizando, erro, desativado) com util `.spin`. (Hub#5.2.13.9)
- **`OAuthConsent`** — bloco unificado de autorização OAuth para canais e fontes de conhecimento. (Hub#5.2.13.9)
- Util **`.spin`** em `globals.css` (keyframe + reduced-motion).

## [1.2.0] — 2026-05-29

### Adicionado

- **`Empty`** — componente de estado vazio reutilizável (`illustration`, `title`, `description`, `actions`). Ports do Hub v2 vendado. (platform#2.2.1.3)
- **`ErrorBoundary`** — captura de erros de renderização com fallback padrão pt-BR e prop `fallback` customizável. (platform#2.2.1.3)
- **`ModalConfirm` / `Modal.Confirm`** — modal de confirmação composicional para ações destrutivas, com `data-testid` e suporte a `loading`. (platform#2.2.1.3)
- **`SkeletonCard`** — cartão placeholder composto sobre `Skeleton`; exportado via namespace `Skeleton.Card`. Tipo `SkeletonComponent` exportado. (platform#2.2.1.3)
- **`radius-2xl`, `radius-3xl`, `pill`** no `tailwind-preset.ts`. (platform#2.2.2.1)
- **Tokens aditivos** no `globals.css`: tints `--color-{primary,teal,blue,purple,amber,orange,red}-bg`, `--color-page-bg`, `--color-border-light`, `--chart-1..5`, `--doc-color-0..9`, `--shadow-sm/md/focus`, tracking `--tracking-{display,h,tight,eyebrow,mono}`. (platform#2.2.2.2)

### Alterado

- **⚠️ BREAKING VISUAL — Escala de radius** (`--radius-xs/sm/md/lg/xl`) no `globals.css`: valores aumentados (xs 2→6px, sm 4→8px, md 6→10px, lg 8→14px, xl 10→16px) conforme DS v1.2.0 canônico. Impacto visual direto em: `Checkbox`, `Badge`, `Button`, `Skeleton`, `Tooltip`, `DropdownMenu`. Shims `--radius-full` (→ pill) e `--radius-btn` (→ sm) mantidos para retrocompat. (platform#2.2.2.1)
- **`input.tsx`** — radius de `rounded-md` para `rounded-lg` (par visual com Select). (platform#2.2.1.3 / 2.2.2.3)
- **`textarea.tsx`** — radius de `rounded-md` para `rounded-lg` (par com Input). (platform#2.2.2.3)
- **`command.tsx`** — adicionado `aria-describedby={undefined}` no `DialogContent` interno (fix de acessibilidade a11y). (platform#2.2.1.3)

### Mantido sem alteração

- `select.tsx` — mantido 40px / `focus-visible` / `z-[110]` (superior ao DS-novo; NÃO regredido).
- `switch.tsx` — mantido `bg-muted-foreground/35` + `border-border/65` unchecked (acessibilidade WCAG; NÃO regredido).

## [1.1.1] — anterior

Versão base de referência.
