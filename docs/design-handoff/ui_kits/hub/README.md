# `ui_kits/hub/` — SaaS workspace surface

Vocabulário visual do **Simplafy Hub** — o produto SaaS logado. Builder
de agentes, dashboards, chat, CRM, billing, settings.

---

## Quando usar este kit

Use `hub` quando o output é **interno, logado, denso**, com muitos
dados por tela e padrões repetitivos de UI. NÃO use para landing pages
ou material de marketing — use `site` pra isso.

| ✅ Hub kit | ❌ Não-hub kit |
|---|---|
| Tela de workspace logado | Landing page nova |
| Dashboard com 12 KPIs | Post de blog |
| Sidebar com 30 items | Página de caso (case study) |
| Drawer de configuração | Email marketing |
| Tela de chat ao vivo | Página de status |
| Builder de agente | 404 / obrigado |

---

## Como usar

```html
<head>
  <!-- 1. PRIMITIVOS DA MARCA (cor, tipo, radius, brand) -->
  <link rel="stylesheet" href="<DS>/tokens.css">

  <!-- 2. KIT DO HUB (componentes de produto) -->
  <link rel="stylesheet" href="<DS>/ui_kits/hub/hub.css">
</head>
```

A ordem importa: `tokens.css` primeiro, `hub.css` depois (porque
consome as variáveis dos tokens).

> **Atenção:** o `hub.css` JÁ importa `tokens.css` internamente via
> `@import url("../../tokens.css")`. Linkar os dois explicitamente no
> `<head>` é redundante mas não causa problema (CSS deduplica).

---

## O que está aqui

### `hub.css`
Estende `tokens.css` com:

- **Tokens-de-produto** — `--hub-sidebar-w: 240px`, `--hub-topbar-h: 56px`,
  `--accent-vivid` (verde brand no dark, verde primary no light)
- **Aliases produto** — `--color-background`, `--color-card`, `--color-sidebar`,
  etc. mapeados das primitivas (`--ink-1/2/3` no dark, `--white/soft` no light)
- **Reset minimal** — box-sizing, body font, button reset
- **Componentes** — shell, page hero, agent card, score widget, templates
  drawer, command palette, prompt block, tool card, switch, chip input,
  pill, tab group, KPI card, KB item, empty state

### `showroom.html`
Showroom visual de TODOS os tokens e componentes do kit, com preview ao
vivo em ambos os temas (claro/escuro). Abra num browser — é a referência
mais útil pro dev.

### `index.html` (legado)
Mock de uma única página dashboard, criado em iteração anterior.
**Considere migrar pra `_legacy/`** quando o kit novo estiver consolidado.

### `PATTERNS.md` ⭐
**Fonte de verdade das interações do Hub** — espelhado do projeto canônico.
Cobre: hierarquia de telas, section pattern, picker patterns, **drawer pattern
(regra #1: tela secundária = drawer direita, nunca modal)**, toast system +
optimistic delete/undo, "em breve", padronização de ícones (Edit2/Trash2…),
pills, CTA hierarchy, form fields, hero pattern, mobile, e checklist de tela
nova. Leia antes de construir qualquer tela do Hub.

---

## Tom e densidade

- **Dominante:** fundos escuros (`--ink-1` body, `--ink-2` sidebar, `--ink-3` cards)
- **Light mode:** primeira-classe — `--white` body, `--soft` sidebar, `--white` cards
- **Verde de assinatura:** `--green` (`#1DEF3B`) no dark — neon, brand;
  `--green-mid` (`#22C55E`) no light — sóbrio, primary
- **Respiro:** SaaS — section padding 24-36px, density alta
- **Type:** Causten 30-44px nos heros (compacto vs site); Geist 13-14px no body
- **Density score:** alta. Site kit tem density baixa.

---

## Componentes do kit

### Layout

| Componente | Classes | Quando usar |
|---|---|---|
| Shell | `.app`, `.sb`, `.tb`, `.page` | Esqueleto de toda página logada |
| Sidebar | `.sb`, `.sb-item`, `.sb-section` | Navegação primária com seções |
| Topbar | `.tb`, `.ws-context`, `.crumbs` | Workspace context + ações |
| Page hero | `.list-hero`, `.eyebrow`, `h1 .mark` | Abertura de tela-raiz (Agentes, Chat, CRM) |

### Inputs

| Componente | Classes | Quando usar |
|---|---|---|
| Button | `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-sm` | Ações |
| Field | `.field`, `label`, `input/select/textarea` | Form fields |
| Search input | `.search-input` | Busca em toolbars |
| Tab group | `.tab-group`, `.tab`, `.cnt` | Filtros de listagem (não navegação primária) |
| Switch | `.switch`, `.switch.on` | Toggle binário |
| Chip input | `.chip-input`, `.chip`, `.chip .x` | Lista de tags editável |
| Prompt block | `.prompt-block`, `.gutter` | Textarea estilo IDE (editor de agente) |
| Theme toggle | `.theme-toggle` | Dark/light |

### Display

| Componente | Classes | Quando usar |
|---|---|---|
| Pill | `.pill`, `.pill.dot`, `.pill.success/teal/warn/...` | Status, canal, versão |
| Agent card | `.acard` | Listagem de agentes |
| Score widget | `.score-card`, `.score-ring`, `.score-breakdown` | Saúde do agente 0-100 |
| Tool card | `.tool-card`, `.tool-card.on` | Seleção de ferramenta MCP |
| KPI card | inline (font-display, value, label) | Dashboard |
| KB item | `.kb-item`, `.kb-drop` | Base de conhecimento |

### Surfaces

| Componente | Classes | Quando usar |
|---|---|---|
| Empty state | `.stub` | Tela sem dados |
| Templates drawer | `.tpl-backdrop`, `.tpl-drawer`, `.tpl-card` | Biblioteca de templates de prompt |
| Command palette | `.cmd-modal`, `.cmd-item` | ⌘K em qualquer tela |
| Live preview rail | `.ed-preview`, `.pv-msg` | Chat de teste no editor |

---

## Não fazer

- ❌ Inventar nova cor (todos os tons da marca vivem em `tokens.css` raiz)
- ❌ Body maior que 14px (a não ser em prompt-block onde 13px mono é OK)
- ❌ Hero com Causten > 44px (esse é o teto pro Hub; site usa até 80px)
- ❌ Mais de 1 hero por tela
- ❌ Crumbs de 1 nível só (redundante com H1 da página — use workspace context no lugar)
- ❌ Sidebar item sem seção (sempre agrupar por contexto: Negócios, Operações, etc.)
- ❌ Botão primário no light usando `--green` (#1DEF3B); use `--green-mid` (#22c55e)
- ❌ Botão primário no dark usando `--green-mid`; use `--green` neon
- ❌ Dark mode como inversão de light (paleta é diferente — `--ink-*` family, não cinza neutro)

---

## Direções de desenho que o kit absorve

Este kit nasceu da **remodelagem Fase 1 do Hub** — dois protótipos
clicáveis explorando direções diferentes de UX no editor de agente:

- **Direção A — Conservadora:** mantém estrutura atual (3 colunas:
  Habilidades · Prompt · Análise), refresh aderente ao DS
- **Direção B — Ousada:** repensa como "agente-documento" — TOC
  esquerda, scroll vertical numerado, preview de chat ao vivo à direita

Os dois compartilham 100% do shell e tokens. A direção B introduziu o
`score-card` e `templates-drawer`. A direção A introduziu o `cobertura-card`
(uma versão simplificada do score).

---

## Versionamento

| Versão | Data | Mudanças |
|---|---|---|
| 0.2.0 | 2026-05-19 | Migração pra `tokens.css` canônico. Score widget + Templates drawer. |
| 0.1.0 | 2026-05-19 | Primeira extração da remodelagem Fase 1 |

`hub.css v0.x` requer `tokens.css v1.x`.

---

_Kit consolidado em "Simplafy - Tela Agente" (projeto de remodelagem do Hub) — 19/05/2026._
