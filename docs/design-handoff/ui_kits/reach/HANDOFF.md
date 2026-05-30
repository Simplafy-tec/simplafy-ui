# Reach — Handoff de desenvolvimento

> Documento pra quem vai **implementar** o Reach em produção (Next.js +
> `@simplafy-tec/ui`). O kit visual (`reach.css` + `index.html`) é
> **referência de design**, não código de produção. Aqui está o contrato
> de como traduzir pro stack real.

Stack alvo: **Next.js 15 · React 19 · Tailwind 4 · @simplafy-tec/ui**
(shadcn new-york + Lucide). Idioma **pt-BR** em todo texto visível.

---

## 1. Regra de ouro — antes de criar qualquer componente

A maioria do que aparece no kit **já existe** em `@simplafy-tec/ui`. Não
recriar. A tabela abaixo mapeia cada classe do `reach.css` para o que usar
em produção.

| Classe no kit (`reach.css`) | Em produção | Observação |
|---|---|---|
| `.reach-button --primary` | `<Button>` | Variante default. No fundo escuro inverte pra verde — usar `variant="default"` dentro de container `dark` ou criar `variant="reach-invert"` se necessário |
| `.reach-button --secondary` | `<Button variant="outline">` | — |
| `.reach-pill` | `<Badge variant="secondary">` | — |
| `.reach-pill --green` | `<Badge variant="success">` | Usa token de sucesso |
| `.reach-pill --warm` | `<Badge>` custom | **Variante nova** — ver §3 |
| `.reach-pill --dark` | `<Badge variant="default">` (sobre claro) | — |
| `.reach-card` | `<Card>` | `--featured` = `<Card>` + `shadow-md` |
| `.reach-card --featured` | `<Card className="shadow-md">` | — |
| `.stat-card` | `<MetricCard>` | Já existe no pacote — ver COMPONENTS.md |
| `.reach-grid --2/3/4` | grid Tailwind (`grid grid-cols-*`) | Não é componente, é layout |
| `.testimonial` | **componente novo** (`<Testimonial>`) | Ver §3 — reportar ao PM antes |
| `.step-list` | **componente novo** (`<StepList>`) | Ver §3 — reportar ao PM antes |
| `.reach-mark` (brand mark) | **componente novo** (`<ReachMark>`) | Ver §2 — contrato completo abaixo |
| `.reach-lockup` | **componente novo** (`<ReachLockup>`) | Ver §2 |
| `.reach-nav` | composição de `<NavigationMenu>` + layout | — |
| `.reach-footer` | layout próprio (não há Footer no pacote) | OK criar em `apps/web` |

**Componentes NOVOS (reportar ao PM antes de criar, conforme CLAUDE.md):**
`ReachMark`, `ReachLockup`, `Testimonial`, `StepList`, e variante `warm` de `Badge`.

---

## 2. Brand mark — contrato do componente `<ReachMark>`

O elemento mais característico do Reach. Dot verde central + 2 anéis
concêntricos que pulsam pra fora ("o alcance que se estende").

### Props

```ts
interface ReachMarkProps {
  size?: 'sm' | 'lg' | 'xl';   // 48 / 88 / 128 px — default 'sm'
  static?: boolean;            // desliga o ripple (usar em lockups/logo)
  onDark?: boolean;            // glow mais forte sobre fundo ink
  className?: string;
}
```

### Regras de implementação

- **Animação:** 2 anéis, `animation-delay` do segundo = metade da duração
  (`2.4s` total). Easing `cubic-bezier(0.16, 0.7, 0.3, 1)`.
- **`prefers-reduced-motion: reduce`** → ripple **desligado** obrigatoriamente
  (acessibilidade). Já está no `reach.css`, replicar no componente.
- **Dot:** `bg-primary` (verde), `rounded-full`, com `box-shadow` de glow
  (token `--glow-green-2`).
- **Static:** em lockup/logo e em superfícies de leitura prolongada, usar
  `static` — o ripple só anima em hero e CTA (1× por seção, máximo).
- Sizes mapeiam: `sm` dot 14px / `lg` dot 22px / `xl` dot 30px.

### Lockup `<ReachLockup>`

`<ReachMark static />` + bloco de texto:
- Nome **"Reach"** — `font-display` (Causten), weight 700, tracking -0.035em
- Assinatura **"by Simpla.fy"** — `font-sans`, 12px, `text-muted-foreground`,
  com "Simpla.fy" em weight 600
- Sizes: `sm` (nome 22px) / default (28px) / `lg` (38px)

---

## 3. Componentes novos — specs curtas

### `<Badge variant="warm">`
- Fundo `--reach-warm` (#F4ECDC), texto `#6F5430`, borda `--reach-warm-line`.
- Uso restrito: contexto humano/social (testimonial, "sobre o programa").
  **Nunca** status/CTA.

### `<Testimonial>`
- Card com borda `--reach-warm-line`, radius `xl`, padding 28px.
- Citação em `font-display` weight 500, 22px, lh 1.35.
- Rodapé: avatar circular 40px (`bg-[--reach-warm-deep]`, iniciais brancas) +
  nome (14px, 600) + sub (12px, muted).

### `<StepList>`
- `<ol>` com counter `decimal-leading-zero` (01, 02, 03).
- Cada item: número em pill verde (`--glow-green` bg, `--green-deep` texto,
  40px) + título (15px, 600) + descrição (13px, muted).

---

## 4. Tokens — regra dura

- **Zero hardcode.** Cor, radius e fonte sempre via token.
- O Reach adiciona **um único token de cor** ao vocabulário Simplafy:
  `--reach-warm` (+ `-2`, `-deep`, `-line`). Tudo o mais é herdado de
  `tokens.css`.
- Em Tailwind 4, expor os tokens warm no `@theme` para virarem utilitários
  (`bg-reach-warm`, `border-reach-warm-line`).
- **Radius:** seguir a escala canônica de `tokens.css` (xl = card, pill =
  botão/badge). ⚠️ Há uma inconsistência aberta entre `tokens.css` e
  `MIGRATION.md` sobre a escala de radius — ver `AUDIT.md` antes de fixar
  valores. Use os nomes (`rounded-xl`), não os números.

---

## 5. Idioma

- **Todo texto de UI em pt-BR** (CLAUDE.md). Labels, botões, toasts,
  placeholders, erros.
- A tagline **"Digital support for people doing good."** é **claim de marca**
  — fica em inglês **de propósito**, como assinatura. Aparece em mono,
  discreta, ao lado do conteúdo PT-BR. Não traduzir, não usar como headline
  funcional.
- Headline de trabalho é sempre PT-BR (ex: *"Tecnologia pra quem não deixa o
  Brasil parar."*).

---

## 6. Checklist de pronto

- [ ] `ReachMark` respeita `prefers-reduced-motion`
- [ ] Componentes existentes do `@simplafy-tec/ui` reutilizados (não recriados)
- [ ] Componentes novos aprovados pelo PM antes de entrar
- [ ] `--reach-warm` exposto no `@theme` do Tailwind
- [ ] Zero cor/radius/fonte hardcoded
- [ ] Todo texto de UI em pt-BR; tagline EN só como claim
- [ ] Tagline EN não usada como headline funcional

---

## Arquivos de referência

| Arquivo | O que é |
|---|---|
| `reach.css` | Fonte visual — tokens + classes utilitárias |
| `index.html` | Showroom — como tudo se compõe numa landing |
| `README.md` | Quando usar Reach vs outros kits, decisões de marca |
| `../../tokens.css` | Tokens canônicos Simplafy (herdados) |
| `../../COMPONENTS.md` | Catálogo `@simplafy-tec/ui` (o que já existe) |

— Reach DS v0.1.0 · handoff 2026-05-29
