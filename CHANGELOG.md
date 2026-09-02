# Changelog

## [2.4.1] — 2026-09-02

### Corrigido

- **O gate de tokens agora roda de verdade.** `pnpm test` (as guardas em `scripts/ci/`) passou a ser executado no job `quality` do `ci.yml` **e** no `publish.yml`. Até aqui nenhum workflow o chamava: as guardas escritas em 2.3.0 (contraste) e 2.4.0 (classes de raio) existiam fora do caminho de merge e fora do caminho de publicação. Isto liga o que a entrada da 2.4.0 registrava como pendente ("hoje isso não está no job `quality` do CI").
- **`"test"` deixou de passar em silêncio quando não há teste.** Era `node --test scripts/ci/`, que devolve `EXIT=0` com a pasta vazia — renomear um arquivo desligava o gate sem ninguém ver, exatamente o defeito que ligar o gate pretende matar. Agora é `node --test scripts/ci/*.test.mjs`, que devolve `EXIT=1` sem match. Medido nos dois casos.
- **`ubuntu-latest` nos dois workflows virou exceção DOCUMENTADA do ADR-015 v4, com a evidência no próprio arquivo.** A tentativa de migrar para a VM self-hosted (`runs-on: ${{ vars.CI_RUNNER }}`) foi feita e **revertida com medição**: `simplafy-ui` é repositório **público** e o grupo de runners da org tem `allows_public_repositories: false`, então o job nunca é atribuído — fica `queued` para sempre e **não vira vermelho**. No `publish.yml` isso significaria o pacote parar de ser publicado sem nenhum sinal de erro. A variável de repositório `CI_RUNNER=simplafy-ci-2` segue gravada e **inerte**. Comentário em cima de cada `runs-on` carrega a saída dos comandos, para o próximo agente não "consertar" de volta.
- (issue#2508, PR simplafy-ui#20)

## [2.4.0] — 2026-09-02

### Alterado

- **⚠️ BREAKING VISUAL — Componentes ainda usavam a classe `rounded-*` de antes do encolhimento de 26/08** (2.3.0 trocou só o VALOR por trás de cada nome, não a classe usada em cada componente) — ficavam 1–2 degraus maiores que o protótipo `[Hub] SaaS`, no mesmo espírito quebrante da 2.3.0 (mesma família de mudança, mesmo aviso). Corrigido por PAPEL do componente no protótipo (`.gr-card`/`.tool-card`/`.cmd-modal`/`.cmd-item`/etc — nunca por coincidência de valor ou tamanho em px), com uma rodada de review adversarial no meio (16 achados, ver abaixo). Tabela completa `arquivo:linha` → classe antiga → nova → seletor do protótipo → px, na PR. Resumo por papel:
  - **Botão base/lg** `rounded-md`→`rounded-sm` (`.btn`, 5px); **botão sm/icon** `rounded-md`→`rounded-xs` (`.btn-sm`/`.ibtn`, 4px). **Botão de fechar** (Dialog/Sheet) `rounded-md`/`rounded-sm`→`rounded-xs` (mesmo papel de `.ibtn`).
  - **Input/Textarea/Select (trigger)** `rounded-lg`→`rounded-xs` (`.field input/textarea/select`, `hub.css:858-861`, 4px — não 5px: ver correção do comentário em `src/globals.css §radius` abaixo). **No Hub v2, hoje isso não muda nada visível** — um override em `apps/web/src/app/globals.css:377-382` força `--radius-sm` (5px) nesses três seletores com especificidade maior que o utilitário; a remoção desse bloco é `simplafy-hub-v2#2412`, PR companheira, fora deste repo.
  - **Card / MetricCard / OAuthConsent / AccessNote** (conteúdo em card único) `rounded-lg`/`rounded-xl`→`rounded-sm` (5px) — a MAIORIA dos cards de conteúdo do protótipo é `--r-md` (`.tool-card`, `.kb-item`, `.score-card`, `.tpl-card`, `.ed-toc .deploy-card`, `.prompt-block`), não `.gr-card`/`.id-card` (7px, minoria — é wrapper de LISTA de linhas, não card de conteúdo único).
  - **SettingsInsetSection** (agrupador de múltiplos controles, papel de wrapper de lista) fica em `rounded-md` (7px, `.gr-card`) — distinto do Card de conteúdo único acima.
  - **Painel flutuante** (Dialog, Select content, DropdownMenu content/sub, Popover, Command root, ChartTooltip) `rounded-2xl`/`rounded-lg`→`rounded-md` (`.cmd-modal`, 7px).
  - **Item de menu** (CommandItem, DropdownMenuItem/SubTrigger, SelectItem) `rounded-sm`/`rounded-md`→`rounded-xs` (`.cmd-item`, 4px).
  - **Ícone dentro de card** (MetricCard, OAuthConsent) `rounded-lg`/`rounded-sm`→`rounded-xs` (4px) — mapeado pelo PAPEL "ladrilho de ícone em card" (`.gr-row .ic`, `.tool-card .ico`, `.kb-item .ic`, `.tpl-card .em`, todos `--r-sm`), não pelo tamanho em px do quadradinho.
  - **Badge / AccessBadge / SyncPill** `rounded-xs`→`rounded-full` (NÃO `rounded-2xs` nem `rounded-pill`) — o protótipo chama `.badge`/`.pill`/`.chip` de `--r-pill` (pílula), e tanto `2xs` quanto `pill` são chaves do preset **sem nenhum consumidor** (`--radius-*` mora em `@layer base`, não em `@theme`; nenhum app importa `tailwind-preset.ts` — ver `src/tailwind-preset.ts:88-93`). Usar qualquer uma das duas gera `border-radius: 0` silencioso. `rounded-full` é a classe nativa do Tailwind já usada por `avatar.tsx`/`switch.tsx`/`progress.tsx` — emite `border-radius: calc(infinity * 1px)` (static value do Tailwind 4, não uma var), mesmo efeito visual dos 999px do protótipo (imperceptível, e sempre "mais redondo que qualquer elemento real").
  - **SheetContent** (drawer) ganhou raio pela primeira vez — só na borda LIVRE (oposta ao lado fixo na viewport): `rounded-b-lg`/`rounded-t-lg`/`rounded-r-lg`/`rounded-l-lg` conforme `side`, 10px (`--radius-lg` ≡ `--r-xl`, "cards de destaque, drawers"). Não tinha classe de raio nenhuma antes.
  - **CommandInput** `rounded-lg`(10px)→`rounded-sm`(5px) — inerte hoje (campo sem borda/fundo), mas 10px era o MAIOR raio do pacote dentro de um modal de 7px; ficaria visível e errado no dia em que ganhasse fundo.
  - **Skeleton** (placeholder de Card e de botão) `rounded-xl`/`rounded-md`→`rounded-sm`/`rounded-xs`, acompanhando os valores corrigidos de `Card` e `Button size="sm"` (`h-9` = mesma altura do botão pequeno).
  - Sem troca de classe nesta versão (⚠️ não é "ficou como estava": o VALOR por trás já mudou na 2.3.0, só a classe continua a mesma) — sem correspondente claro no protótipo: `checkbox.tsx` (`rounded-sm`), `Skeleton` base genérico (`rounded-md`).
  - `TabsList`/`TabsTrigger` (`tabs.tsx`) e `CommandShortcut` (`command.tsx:124`) TÊM seletor de papel no protótipo (`.tab-group`/`.tab`/`.kbd`), mas nenhum dos três usa `rounded-*` hoje — `Tabs` é sublinhado (`border-b-2`, sem caixa) e `CommandShortcut` é `<span>` de texto sem fundo/borda. Raio não apareceria de qualquer forma; fora do escopo (mudar pra caixa com raio seria mudança de DESENHO, não de régua).
  - Corrigido o comentário de `src/globals.css §radius` que citava o override do Hub v2 (ver acima) como prova de que inputs deveriam usar `--radius-sm` (5px) — o seletor literal do protótipo (`.field input/textarea/select`) usa `--r-sm` (4px), e o override é o que diverge, não o pacote.
  - (Hub#5.2.13.12, PR simplafy-ui#19 — review adversarial: 16 achados corrigidos no mesmo branch, ver histórico de commits)

### Adicionado

- **`scripts/ci/radius-classes.test.mjs`** — guarda estática que varre todo `rounded-*` em `src/components/**/*.tsx` e falha se o sufixo não estiver no namespace `--radius-*` que o Tailwind 4 emite sozinho (teria pego o achado do `rounded-2xs` antes de chegar em review). Roda via `pnpm test` (`node --test scripts/ci/`) — **hoje isso não está no job `quality` do CI** (`.github/workflows/ci.yml` não chama `pnpm test`, só `lint`/`typecheck`/`build`); ligar é mudança de workflow, fora do escopo desta PR.

## [2.3.0] — 2026-09-01

### Alterado

- **⚠️ BREAKING VISUAL — Escala de radius** (`--radius-2xs/xs/sm/md/lg/xl`) no `globals.css` e em `docs/design-system/tokens.css` §7: **enxugada ~35%**, alinhando à régua do protótipo `[Hub] SaaS`, que a encolheu em 26/08/2026 pelo motivo registrado no `SPEC-UI.md` dele: *"os componentes estavam abaulados demais"*. **O mapa `--r-*` (protótipo) → `--radius-*` (pacote) é DESLOCADO em um degrau, não 1:1 por nome** — achado do review adversarial, confirmado pelo PM com o protótipo na mão; o desempate foi o papel de cada componente, não o valor nem o nome: `--radius-2xs: 3px` (NOVO — tags/chips mínimos, ≡ `--r-xs`), `--radius-xs: 4px` (era 6px, ≡ `--r-sm`), `--radius-sm: 5px` (era 8px, ≡ `--r-md` — inputs/botões/cards de lista), `--radius-md: 7px` (era 10px, ≡ `--r-lg`), `--radius-lg: 10px` (era 14px, ≡ `--r-xl`), `--radius-xl: 12px` (era 16px — **órfão**, o protótipo não tem degrau acima de `--r-xl`, mantido só por retrocompat). Impacto visual direto em todo `Card`, `Input`, `Textarea`, `Popover`, `DropdownMenu`, `Button`, `Checkbox`, `Badge`, `Tooltip`, `Skeleton` **e no alias `--radius-btn` (→ `--radius-sm`), que cai de 8px para 5px**. `--radius-2xl` (18px), `--radius-3xl` (24px) e `--radius-pill` (999px) **não mudam**: os dois primeiros não têm degrau correspondente no protótipo, e o pill é forma intencional, não raio. (Hub#5.2.13.12)

### Corrigido

- **Contraste de `--color-destructive` no tema escuro** (`globals.css` `.dark`, `ui_kits/hub/hub.css` `[data-theme="dark"]`): era `oklch(0.65 0.22 27)` = `#f9423d`, que como TEXTO dá **3.86** sobre o card `--ink-3` (`#14322c`) do Hub — e o escuro é o tema **default** do produto, então essa era a cor de toda mensagem de erro. Agora `--error-on-dark` (`#f87171`): **6.41** sobre `--ink-1`, **6.12** sobre `--ink-2`, **4.99** sobre `--ink-3`. O par **inverte junto**: `--color-destructive-foreground` no escuro passa a `--ink-1` (`#0b1b18`, **6.41** por cima do preenchimento) — manter `--white` deixaria o botão destrutivo em **2.77**, pior do que estava. Primitivo `--error-on-dark` adicionado ao `tokens.css` §5. (Hub#5.2.13.11)
- **`--color-destructive` no tema claro** passa de `oklch(0.58 0.22 27)` (= `#df2225`) para `#dc2626`, o `--error` canônico do `tokens.css`. Diferença imperceptível (4.78 → 4.83 sobre branco), elimina a divergência entre pacote e primitivo.
- **Contraste de `--color-muted-foreground` nos dois temas** (`globals.css`, `tokens.css` `--fg-3` / `--fg-on-dark-4`): claro de `oklch(0.55 0.01 265)` (= `#6f7278`) para **`#666e69`** — o valor antigo reprovava AA sobre as superfícies recuadas da marca (4.48 sobre `--soft`, 4.32 sobre `--soft-3`) e passava só sobre branco puro, a única superfície contra a qual fora calibrado. Escuro de `#94a3b8` para **`#969f99`**, dentro da paleta ink. Medido: claro 5.25 / 4.87 / 4.70; escuro 6.52 / 6.22 / 5.07, e **4.52** sobre a superfície `muted` **composta** do Hub (branco a 4% sobre o card = `#1d3a34`). (Hub#7.1.23.3)
- **`.chip .x:hover`** (`ui_kits/hub/hub.css`) cravava `color: white` em vez do token de foreground, então não acompanhava a inversão do par no escuro e ficava em 2.77. Passa a usar `var(--color-destructive-foreground)`.

### Adicionado

- **Contrato conteúdo × decorativo** escrito no `tokens.css` §4: todo nível de cada escada de texto, MENOS o último, é **conteúdo** e passa AA sobre as três superfícies do tema — a escala clara tem 3 níveis (`--fg-1..3`), a escura tem 4 (`--fg-on-dark-1..4`); o último de cada uma (`--fg-4`, `--fg-on-dark-5`) é **decorativo** — grafismo, divisor, estado desabilitado, nunca texto a ser lido. Com as duas regras de medição que faltavam: medir contra as **três** superfícies, e **compor o alpha** antes de medir superfície translúcida. (Hub#7.1.23.3)

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
