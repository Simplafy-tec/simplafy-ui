> **Local canônico no monorepo:** `simplafy-ui/docs/design-system/` — fonte de verdade de **marca e kits** para Hub v2, Saúde, Site, Reach e demais superfícies. Pacote npm de produção: `src/` (`@simplafy-tec/ui`). Índice: [`../README.md`](../README.md).

# Simplafy Design System

> Documento-guia para construir qualquer artefato visual Simplafy — produto, site, deck, social.

Este projeto é a **verdade única** para cor, tipografia, espaçamento, componentes, logos e voz Simplafy. Onde o código legado (Hub, Saúde, site) divergir, este DS tem razão, e [`MIGRATION.md`](MIGRATION.md) diz como convergir.

> **Porta de entrada:** comece sempre por [`tokens.css`](tokens.css) (primitivos da marca) + [`ui_kits/_index.md`](ui_kits/_index.md) (mapa dos kits). Não escreva CSS sem ler os dois.

---

## Marca

Simplafy é a marca-mãe. Quatro produtos + uma sub-marca social herdam a identidade:

| Superfície | Domínio | Acento | Kit |
| --- | --- | --- | --- |
| **Hub v2** | Plataforma de agentes de IA | — (só verde primary) | [`ui_kits/hub/`](ui_kits/hub/) |
| **Simplafy Saúde** | Gestão clínica | `teal` + `blue` | [`ui_kits/saude/`](ui_kits/saude/) |
| **Simplafy Seguros** | Corretoras de seguros | `orange` + `amber` | [`ui_kits/seguros/`](ui_kits/seguros/) — a ser absorvido pelo Hub |
| **Simplafy Agro** | Agro | `green` (mais terroso) | ⚪ sem frontend ainda |
| **Site marketing** | simplafy.com.br, blog, casos | verde + dark | [`ui_kits/site/`](ui_kits/site/) |
| **Reach** (programa social) | Pro bono p/ ONGs | `--reach-warm` | [`ui_kits/reach/`](ui_kits/reach/) |

Todos compartilham: **verde de marca**, **Causten** (logo + marketing: hero, capas de deck, peças) e **Geist** (títulos de produto + corpo do app).

---

## Arquivos-chave

### Fontes de verdade (este projeto)

| Arquivo | Contém |
| --- | --- |
| [`tokens.css`](tokens.css) | ⭐ **Primitivos da marca** — cor, tipo, radius, tracking, sombra, brand. Única fonte de verdade. |
| [`ui_kits/`](ui_kits/) | Um kit por superfície (site, hub, saude, seguros, reach). Cada um herda `tokens.css` e adiciona vocabulário próprio. |
| [`ui_kits/_index.md`](ui_kits/_index.md) | Mapa de orientação — qual kit usar em cada contexto. |
| [`preview/`](preview/) | ~20 cards visuais de cada token e componente. |
| [`assets/logos/`](assets/logos/) | Logos Simplafy + lockups setoriais (SVG). |
| [`fonts/`](fonts/) | Causten (7 pesos, Light→Black). |
| [`AUDIT.md`](AUDIT.md) | O que está inconsistente hoje em cada superfície. |
| [`MIGRATION.md`](MIGRATION.md) | Como aplicar o DS em Hub, Saúde, site, social. |
| [`COMPONENTS.md`](COMPONENTS.md) | Inventário de componentes React (`@simplafy-tec/ui`). |

> **`colors_and_type.css` está DEPRECADO.** Continua no projeto só pra back-compat de previews antigos. Código novo **sempre** importa `tokens.css`.

### Fontes externas que este DS espelha

| Repo | Caminho | Porquê espelhar aqui |
| --- | --- | --- |
| `Simplafy-tec/simplafy-ui` | `src/globals.css`, `src/components/*` | Código canônico do DS; é o que o Hub v2 consome em produção |
| `Simplafy-tec/simplafy-saude` | `apps/portal/src/index.css` | Tokens extras (`*-bg`, `chart-*`, `doc-color-*`) nascidos no Saúde |
| `Simplafy-tec/simplafy-site` | `index.html` CSS inline | Estética marketing (dark, neon, rounded) |

---

## Tokens em 60 segundos

```css
/* Cor — importar tokens.css */
var(--green)          /* #1DEF3B — brand-green (marketing, logo, dark) */
var(--green-mid)      /* #22C55E — primary do produto (CTA no light) */
var(--green-deep)     /* texto verde sobre fundo claro */
var(--ink-1)          /* #0B1B18 — near-black esverdeado (bg dark, texto) */
var(--white)          /* superfícies claras */
var(--soft)           /* #F5F7F4 — bg alternado claro */
var(--fg-1/2/3/4)     /* hierarquia de texto sobre claro */
var(--fg-on-dark-1/2/3) /* hierarquia de texto sobre ink */

/* Semantic + accents setoriais */
--teal · --info(blue) · --purple · --orange · --warn · --error
--{accent}-bg         /* tint quiet para containers/hover */

/* Distinção sem peso semântico */
--chart-1..5          /* gráficos */
--doc-color-0..9      /* entidades (médicos, usuários, tags) */

/* Type — 2 famílias */
var(--font-display)   /* Causten — marca/marketing/hero, fallback Geist */
var(--font-sans)      /* Geist — UI, page titles, body */
var(--font-mono)      /* Geist Mono — números (R$), IDs, código */

/* Tracking */
--tracking-display -0.035em · --tracking-h -0.02em · --tracking-eyebrow 0.14em

/* Radius */
var(--radius-md)  = 10px   /* avatares quadrados, surfaces pequenas */
var(--radius-lg)  = 14px   /* card padrão */
var(--radius-xl)  = 16px   /* card grande, hero panels */
var(--radius-2xl) = 18px   /* card featured (pricing, casos) */
var(--radius-3xl) = 24px   /* CTA blocks grandes */
var(--radius-pill)= 999px  /* botões, badges, dots, eyebrow */

/* Sombra — só 4, não inventar mais */
--shadow-sm · --shadow-md · --shadow-lg · --shadow-hero
```

> ⚠️ Há uma **inconsistência aberta de radius** entre `tokens.css` e `MIGRATION.md §1.1` — ver fim do `AUDIT.md`. Use sempre os **nomes** (`--radius-lg`), nunca os números.

---

## Regras duras

1. **Nunca hardcode** cor, raio, fonte ou sombra. Se precisa um valor que não existe, **adicione ao `tokens.css` primeiro** e só depois use.
2. **Não inventar cor de marca dentro de um kit.** Falta token → ADD na raiz, bumpa a versão, alinha com todos os kits.
3. **Duas famílias só:** **Causten** = marca (logo, hero de site, OG, decks). **Geist** = produto (page titles, body, app). **Geist Mono** = números/IDs/código. Não usar Sora, Inter, Roboto.
4. **Verde:** `#1DEF3B` é brand-green (marketing/logo/dark). `#22C55E` é primary do produto (CTA no light). Não importar o `#14D77D` legado do site.
5. **Semantic badge vs soft-bg:** badge cheio quando precisa peso visual; `--{accent}-bg` em containers/hovers quiet.
6. **Ícone pack único:** `lucide-react`. Nunca misturar com Heroicons, Phosphor, FontAwesome.
7. **Tom de voz:** direto, **pt-BR** (nunca pt-PT), sem promessas vagas de IA. Ver [`preview/brand-voice.html`](preview/brand-voice.html).

---

## Fluxo para novo artefato

1. Leia [`ui_kits/_index.md`](ui_kits/_index.md) e escolha o kit certo pro contexto.
2. Importe `tokens.css` + o `<kit>.css` no topo do HTML (o kit já re-importa os tokens).
3. Leia o `README.md` do kit (tom, densidade, type scale, componentes).
4. Use `preview/*` e o `index.html`/`showroom.html` do kit como referência visual.
5. Consulte [`COMPONENTS.md`](COMPONENTS.md) antes de criar componente — se já existe em `@simplafy-tec/ui`, reutilize.

---

## Governança

- **Mudanças em tokens** → PR neste projeto primeiro, bumpa versão de `tokens.css`, depois propaga para `simplafy-ui`.
- **Novo componente** → espelhar em `preview/components-*.html` (ou no showroom do kit) antes de marcar oficial; reportar ao PM (CLAUDE.md).
- **Divergência aceitável** → kits podem ADICIONAR vocabulário próprio (ex: `--hub-shell-w`, `--reach-warm`) desde que documentado e sem contradizer um primitivo.

---

## Versionamento

`tokens.css` está em **v1.1.0**. Cada kit é versionado independente, mas seu major bate com o major dos tokens:

- `tokens.css v1.x` ⇄ kits 0.x/1.x compatíveis
- `tokens.css v2.0` ⇄ requer kits 2.x (breaking change na marca)

---

## Próximos passos

Ver [`MIGRATION.md`](MIGRATION.md). Ordem recomendada:

1. Site — trocar logos + incluir Causten + unificar verde em `#1DEF3B`.
2. Templates sociais (Figma/Canva) com DS.
3. Saúde portal — migrar tokens HSL → oklch + fonte → Geist.
4. Seguros — alinhar e absorver no Hub v2.
5. Agro — novo, nasce já com DS.
6. Sweep dos `preview/*` legados → trocar `colors_and_type.css` por `tokens.css`.
