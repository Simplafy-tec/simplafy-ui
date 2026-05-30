# `ui_kits/site/` — marketing surface

Vocabulário do site público da Simplafy (simplafy.com.br) e materiais de
marketing (landing pages, casos, blog, conectores, calculadora, status).

---

## Quando usar este kit

Use `site` quando o output é **público, lido por possível cliente**, com
hierarquia visual agressiva e respiro generoso. NÃO use para UI logada
densa — use `hub` pra isso.

| ✅ Site kit | ❌ Não-site kit |
|---|---|
| Landing page nova | Tela de workspace logado |
| Post de blog | Dashboard com 12 KPIs |
| Página de caso (case study) | Sidebar com 30 items |
| Email marketing | Drawer de configuração |
| Página de status | Tela de chat ao vivo |
| 404 / obrigado | Builder de agente |

---

## Como usar

```html
<head>
  <!-- 1. PRIMITIVOS DA MARCA (cor, tipo, radius, brand) -->
  <link rel="stylesheet" href="<DS>/tokens.css">

  <!-- 2. KIT DO SITE (layout, type-scale, classes utilitárias) -->
  <link rel="stylesheet" href="<DS>/ui_kits/site/site.css">

  <!-- 3. Overrides responsivos do projeto -->
  <link rel="stylesheet" href="<projeto>/mobile.css">
</head>
```

A ordem importa: `tokens.css` primeiro, `site.css` depois (porque consome
as variáveis dos tokens).

---

## O que está aqui

### `site.css`
Estende `tokens.css` com:

- **Layout** — `--site-container-max: 1200px`, section padding 56/88/120
- **Type scale agressiva** — hero clamp(40-80px), body 15px (NÃO 14)
- **Classes utilitárias** — `.site-button`, `.site-pill`, `.site-eyebrow`, `.site-card`, `.site-mark`
- **Chrome** — `.skip-link`, `#splash` (loader entre carregamento e mount React)

### `index.html`
Showroom visual de TODOS os tokens (cores, type, radius, sombras,
componentes). Abre num browser — é a referência mais útil pro dev.

---

## Tom e densidade

- **Dominante:** fundos claros (`--white` ou `--soft`)
- **Acento dark:** apenas hero, CTA blocks, footer (usam `--ink-1`)
- **Verde de assinatura:** `--green-soft` (#9DE85B) nos accents em dark; `--green-deep` (#16a34a) em texto sobre claro
- **Respiro:** generoso. Section padding mínimo 56px, padrão 88px, hero 120px
- **Type:** Causten 800 nos heros, Geist 400/500 no body. Body é 15px.
- **Density score:** baixa. Hub kit tem density alta.

---

## Componentes do kit

| Componente | Onde está | Quando usar |
|---|---|---|
| `Section` (tone="dark/light/soft/ink-2", pad="tight/normal/loose") | site React primitives | Wrapper de seção; gerencia bg+fg+padding |
| `Container` | site React primitives | Max-width 1200px, padding lateral |
| `Button` (variant="primary/secondary/ghost/outline", size="sm/md/lg") | site React primitives | Único botão do site — sempre pill |
| `Pill` (color="green/teal/white") | site React primitives | Badge pequeno com dot |
| `Eyebrow` | site React primitives | Label uppercase 12px com dot |
| `Mark` | site React primitives | Palavra em destaque com gradient verde |
| `Reveal` (delay, y) | site React primitives | Fade-in on scroll |
| `Display` (size) | site React primitives | H1 Causten 800 com clamp |
| `useIsMobile(bp)` | site React primitives | Hook responsive (default 720) |

> **No build de produção:** estes primitives viram componentes TS/TSX
> exportados via `@simplafy/site-kit` (ou similar). Hoje vivem no projeto
> do site (`src/primitives.jsx`).

---

## Não fazer

- ❌ Inventar novos tons de verde (4 já bastam — ver `tokens.css`)
- ❌ Botão sem ser pill (radius 999)
- ❌ Body menor que 15px (exceto em mockups embarcados)
- ❌ Mais que 2 níveis de heading por seção
- ❌ Mais que 1 hero por página
- ❌ Mais que 4 sombras (já estão definidas em tokens)
- ❌ Emoji decorativo (a marca não usa)

---

_v1.0.0 — 2026-05-19_
