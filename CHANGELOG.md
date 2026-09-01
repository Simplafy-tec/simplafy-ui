# Changelog

## [2.3.0] — 2026-09-01

### Alterado

- **⚠️ BREAKING VISUAL — Escala de radius** (`--radius-xs/sm/md/lg/xl`) no `globals.css` e em `docs/design-system/tokens.css` §7: **enxugada ~35%** (xs 6→3px, sm 8→4px, md 10→5px, lg 14→7px, xl 16→10px), alinhando à régua do protótipo `[Hub] SaaS`, que a encolheu em 26/08/2026 pelo motivo registrado no `SPEC-UI.md` dele: *"os componentes estavam abaulados demais"*. Impacto visual direto em todo `Card`, `Input`, `Textarea`, `Popover`, `DropdownMenu`, `Button`, `Checkbox`, `Badge`, `Tooltip` e `Skeleton`. `--radius-2xl` (18px), `--radius-3xl` (24px) e `--radius-pill` (999px) **não mudam**: os dois primeiros não têm degrau correspondente no protótipo, e o pill é forma intencional, não raio. O mapa `--r-*` → `--radius-*` é **1:1 por nome** e está documentado em `docs/design-system/ui_kits/hub/hub.css`. (Hub#5.2.13.12)

### Corrigido

- **Contraste de `--color-destructive` no tema escuro** (`globals.css` `.dark`, `ui_kits/hub/hub.css` `[data-theme="dark"]`): era `oklch(0.65 0.22 27)` = `#f9423d`, que como TEXTO dá **3.86** sobre o card `--ink-3` (`#14322c`) do Hub — e o escuro é o tema **default** do produto, então essa era a cor de toda mensagem de erro. Agora `--error-on-dark` (`#f87171`): **6.41** sobre `--ink-1`, **6.12** sobre `--ink-2`, **4.99** sobre `--ink-3`. O par **inverte junto**: `--color-destructive-foreground` no escuro passa a `--ink-1` (`#0b1b18`, **6.41** por cima do preenchimento) — manter `--white` deixaria o botão destrutivo em **2.77**, pior do que estava. Primitivo `--error-on-dark` adicionado ao `tokens.css` §5. (Hub#5.2.13.11)
- **`--color-destructive` no tema claro** passa de `oklch(0.58 0.22 27)` (= `#df2225`) para `#dc2626`, o `--error` canônico do `tokens.css`. Diferença imperceptível (4.78 → 4.83 sobre branco), elimina a divergência entre pacote e primitivo.
- **Contraste de `--color-muted-foreground` nos dois temas** (`globals.css`, `tokens.css` `--fg-3` / `--fg-on-dark-4`): claro de `oklch(0.55 0.01 265)` (= `#6f7278`) para **`#666e69`** — o valor antigo reprovava AA sobre as superfícies recuadas da marca (4.48 sobre `--soft`, 4.32 sobre `--soft-3`) e passava só sobre branco puro, a única superfície contra a qual fora calibrado. Escuro de `#94a3b8` para **`#969f99`**, dentro da paleta ink. Medido: claro 5.25 / 4.87 / 4.70; escuro 6.52 / 6.22 / 5.07, e **4.52** sobre a superfície `muted` **composta** do Hub (branco a 4% sobre o card = `#1d3a34`). (Hub#7.1.23.3)
- **`.chip .x:hover`** (`ui_kits/hub/hub.css`) cravava `color: white` em vez do token de foreground, então não acompanhava a inversão do par no escuro e ficava em 2.77. Passa a usar `var(--color-destructive-foreground)`.

### Adicionado

- **Contrato conteúdo × decorativo** escrito no `tokens.css` §4: os três primeiros níveis de cada escada de texto (`--fg-1..3`, `--fg-on-dark-1..4`) são **conteúdo** e passam AA sobre as três superfícies do tema; o último de cada uma (`--fg-4`, `--fg-on-dark-5`) é **decorativo** — grafismo, divisor, estado desabilitado, nunca texto a ser lido. Com as duas regras de medição que faltavam: medir contra as **três** superfícies, e **compor o alpha** antes de medir superfície translúcida. (Hub#7.1.23.3)

## [2.2.1] — 2026-08-24

### Corrigido

- **`globals.css`** — `@import url(...)` das fontes Geist/Geist Mono movido da linha 96 para o topo do arquivo, antes de `@import "tailwindcss"`. O Tailwind v4 expande o import do Tailwind em blocos `@layer` com conteúdo real; com o import de fonte depois disso, o CSS final violava `@import rules must precede all rules aside from @charset and @layer statements` e o Turbopack (`next dev`) derrubava toda rota do app consumidor com 500. URL e pesos inalterados; `@font-face` da Causten intocados. (issue#2395)

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
