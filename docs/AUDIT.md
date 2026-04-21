# Audit de inconsistências

Levantamento do que **existe hoje** em cada superfície Simplafy. O objetivo deste documento **não é julgar** — é dar rastreabilidade pra hora de aplicar o Design System e migrar tudo para a mesma linguagem.

> **Regra de ouro:** se há conflito entre fontes, o `colors_and_type.css` deste projeto é a verdade. Onde a realidade divergir, `MIGRATION.md` diz como convergir.

---

## Matriz rápida

| Superfície | Repo / Origem | Primary | Tipografia | Background | Status |
| --- | --- | --- | --- | --- | --- |
| **Hub v2** (produto) | `simplafy-ui` + `simplafy-hub-v2` | `#22C55E` oklch | Geist (corpo + títulos) | Branco (`oklch(1 0 0)`) | ✅ canônico — é a base do DS |
| **Simplafy Saúde** (produto) | `simplafy-saude/apps/portal` | `#22C55E` HSL | Inter + Sora (código) → migrar p/ Geist | Branco + `--page-bg` cinza | 🟡 tokens em HSL + fonte, port pra oklch + Geist |
| **Simplafy Seguros** (produto) | absorvido pelo Hub v2 | — | — | — | 🔴 a morrer — ver `ui_kits/seguros/CAPTURED.md` |
| **Simplafy Agro** (produto) | — | — | — | — | ⚪ sem frontend no momento |
| **Site marketing** | `simplafy-site/index.html` | `#14D77D` neon + `#2AD1B0` teal | Inter + Sora (código) → migrar p/ Causten hero + Geist | Escuro navy `#05070c` radial | 🔴 **universo visual próprio** |
| **Redes sociais / OG images** | `assets/og_*.png` (site) | (herda do site) | Causten (marketing) | Escuro navy | ✅ Causten confirmado p/ marketing |

Legenda: ✅ alinhado · 🟡 divergência tática · 🔴 divergência estrutural · ⚪ não existe ainda

---

## Divergências detalhadas

### 1. Primary verde — três valores na natureza

| Contexto | Valor | Origem |
| --- | --- | --- |
| Produto (Hub + Saúde) | `#22C55E` / `oklch(0.72 0.19 150)` | `simplafy-ui/src/globals.css` |
| Site hero / CTA | `#14D77D` | `simplafy-site/index.html` `--brand` |
| Site secondary | `#2AD1B0` | `simplafy-site/index.html` `--brand-2` |
| Site dot/accent | `#1DEF3B` | `simplafy-site/index.html` e figma metadata "brand-green" |
| Figma logo / dot | `#1DEF3B` | `@simplafy_icon.svg` |

**Causa raiz:** Não há um único "green token" global — cada superfície escolheu um ponto do verde.

**Decisão do DS (`colors_and_type.css`):** adotar `#22C55E` como **primary do produto** e `#1DEF3B` como **brand-green** (marketing / logo). Marketing pode usar gradientes até `#34D399`. Ambos convivem: produto = primary, marketing = brand-green.

---

### 2. Tipografia — decisão: Causten (marca) + Geist (produto)

| Superfície | Hero / Display | Body | Status |
| --- | --- | --- | --- |
| Hub v2 (DS) | Geist 600/700 | Geist | ✅ decidido |
| Saúde (código atual) | Sora | Inter | 🟡 migrar para Geist |
| Site (código atual) | Sora | Inter | 🟡 migrar para Causten (hero) + Geist (corpo) |
| Logo + OG + social | Causten ExtraBold | — | ✅ mantido |

**Decisão do DS (Nov 2026):**
- `--font-display-brand: Causten` → **marca**: logo, hero de site, capa de decks, OG images, social
- `--font-display: Geist` → **produto**: page titles, cards, métricas, cabeçalhos
- `--font-sans: Geist` → **corpo**: forms, tabelas, parágrafos, labels
- `--font-mono: Geist Mono` → valores R$, IDs, código

**Motivação:** Inter virou ubíqua ("AI app genérico"). Geist tem tabular nums excelentes, é variable, grátis via Google Fonts, carrega personalidade tech sem comprometer legibilidade em tabela 13px. Causten continua sendo a voz da marca onde ela é força, não fricção.

Testado lado-a-lado em `preview/type-compare.html`.

---

### 3. Backgrounds — claro vs. escuro

| Superfície | Default |
| --- | --- |
| Hub v2, Saúde | **Branco** (`oklch(1 0 0)`), dark mode opcional |
| Site | **Escuro navy** (`#070a13` → `#05070c` gradient) — não tem modo claro |
| Social / OG | Escuro navy (do site) |

**Causa raiz:** o site foi feito com estética "AI/tech dark landing" e nunca teve claro. Produto nasceu em shadcn new-york (claro-first).

**Decisão do DS:**
- Produto = claro-first, dark como tema secundário
- Marketing = pode continuar dark, mas os tokens `--brand-ink-*` documentados no DS dão a paleta canônica para isso. Não é "um site que ignora o DS" — é "o DS dá tokens claro-first + uma camada ink pra marketing".

---

### 4. Border radius

| Superfície | Escala |
| --- | --- |
| Produto (simplafy-ui) | 6/8/12/16/20px + `--radius-btn: 10px` |
| Site | `12/18/28/40px` (nomes idênticos: sm/md/lg/xl) — **muito mais arredondado** |

**Causa raiz:** site estética "rounded pill hero blobs"; produto estética shadcn.

**Decisão do DS:** DS adota escala do produto. Site = escala própria "marketing" que não vai pro DS — se quiser raios maiores, combina com múltiplos da escala (`--radius-xl * 2.5 = 40px`).

---

### 5. Sombras

| Produto | `shadow-sm/md/lg` shadcn sutis (`rgb(0 0 0 / 0.05..0.10)`) |
| Site | `0 44px 90px rgba(5,10,25,0.45)` — **drop shadows exagerados** pra glass-morphism |

**Decisão:** produto usa sombras sutis. Marketing usa sombras grandes pra efeito visual. Ambos legítimos pra seus contextos. DS documenta **só as sutis**.

---

### 6. Saúde — tokens extras não no Hub

O portal Saúde adicionou (em HSL, pre-oklch):
- `*-bg` tints (`primary-bg`, `teal-bg`, `blue-bg`, `amber-bg`, `red-bg`, `purple-bg`, `orange-bg`) — para chips quiet, status pills, linhas destacadas.
- `--page-bg` — cinza sutil atrás do conteúdo branco.
- `--chart-1..5` — série de 5 cores pra gráficos.
- `--doc-color-0..9` — 10 hues determinísticos atribuídos por hash estável (médicos na agenda, usuários em kanban).
- `--border-light` — separador ainda mais sutil que `--border`.

**Causa raiz:** Saúde tem domínio "clínico" — agenda lotada com N médicos, muitos status (confirmado / aguardando / em atendimento / cancelado / reagendado). Precisou expandir o vocabulário.

**Decisão do DS:** **adotar todos** no `colors_and_type.css` — esses tokens são úteis para Hub v2 também (filtros de leads, status de jornadas, canais). Já portados para oklch onde possível.

---

### 7. Logos — múltiplas versões coexistem

| Arquivo | Onde | Uso |
| --- | --- | --- |
| `logo5.svg` | site | navbar (horizontal, colorido) |
| `logo_simpla_white.svg` | site | footer + OG (horizontal, branco) |
| `simplafy_icon.svg` | site + favicon | avatar/favicon |
| Figma "Logos" | design | master + variantes setoriais (Saúde, Seguros, Agro) com lockup |

**Causa raiz:** site tem 3 logos porque nunca passou por revisão de DS. Figma tem a versão "oficial" dos lockups setoriais.

**Decisão do DS:** importar a **família Figma** como verdade (parent + 3 setoriais), documentar tamanhos mínimos, cores, clearspace, fundos permitidos.

---

## O que isso significa pro projeto

- O **DS (este projeto)** consolida tudo numa só fonte.
- **`MIGRATION.md`** diz, por superfície, o que muda.
- Quando alguém for mexer em Hub v2, Saúde, Seguros, site ou criar post social, começa lendo aqui.
