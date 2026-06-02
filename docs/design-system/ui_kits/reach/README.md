# `ui_kits/reach/` — Reach by Simpla.fy

**Reach** é o **programa social** da Simplafy — site institucional + agente
Fy dedicados a ONGs e associações brasileiras que não podem deixar o
Brasil parar.

> Tagline: **"Digital support for people doing good."**

É uma **sub-marca**. Vive sob Simplafy, hereda paleta + tipografia, mas tem
3 decisões próprias.

---

## Quando usar

| Use Reach quando… | Use site/hub quando… |
| --- | --- |
| Página do programa social | Página comercial/produto |
| Landing de candidatura de ONG | Pricing, planos, comercial |
| Painel de "ONG apoiada" no site dela | Painel de cliente pagante |
| Material institucional / imprensa do programa | Material de venda |
| OG image / posts sobre causas atendidas | OG image / posts sobre features |

---

## Como usar

```html
<head>
  <!-- Kit Reach (já importa tokens.css canônico) -->
  <link rel="stylesheet" href="<DS>/ui_kits/reach/reach.css">
</head>
```

Não importe `tokens.css` separadamente — `reach.css` já faz isso.

---

## O que está aqui

| Arquivo | Contém |
| --- | --- |
| [`reach.css`](reach.css) | Kit completo — tokens próprios, brand mark com ripple, componentes utilitários (`.reach-button`, `.reach-pill`, `.reach-card`...) e tons de seção |
| [`index.html`](index.html) | Showroom completo — landing institucional usando o kit em 7 seções (hero / DNA / mark / cores / type / componentes / warm / tones / CTA / footer) |
| [`HANDOFF.md`](HANDOFF.md) | **Para o time de dev** — mapeamento das classes → `@simplafy-tec/ui`, contrato do `<ReachMark>`, specs dos componentes novos, regra de tokens e idioma |

---

## As 3 decisões próprias do Reach

| Decisão | Por quê |
| --- | --- |
| **Brand mark com ripple** | Dot verde + 2 anéis concêntricos pulsando. O alcance se estende — combina com o nome. No `.fy` estático, o dot só sinaliza; aqui ele **propaga**. |
| **Token `--reach-warm`** | Cream `#F4ECDC`. Suaviza a frieza do verde-neon em contexto social. Use SÓ em testimonials, "Sobre o programa", callouts de candidatura. **Nunca** como CTA ou status. |
| **Tipografia 600/700, não 800** | Site comercial usa Causten 800 (peso vendedor). Reach abre pra 700 — editorial, institucional, sem perder hierarquia. |

---

## Tom & densidade

- **Body:** 16px Geist (não 14 do hub, não 15 do site — mais arejado pra leitura prolongada)
- **Density:** baixa, editorial. Seções respiram (88px padrão, 120px loose).
- **Fundo padrão:** `--white`. Alternar com `data-tone="soft"`, `data-tone="warm"`, `data-tone="warm-2"`, `data-tone="dark"`.
- **Primary:** mantém `--ink-1` no claro / `--green` no escuro (mesmo padrão do site)
- **Hero:** combinação obrigatória de `data-tone="dark"` + `.reach-mark--xl` com ripple ativo
- **Tom:** institucional sem ser caridade-piegas, calmo sem ser apático, direto sem ser comercial

---

## Componentes do kit

| Componente | Classe | Padrão |
| --- | --- | --- |
| Container | `.reach-container` | Largura máxima 1180px |
| Seção | `.reach-section` + `data-tone=…` | Padding 88px vertical (variantes `--tight` 56 / `--loose` 120) |
| Brand mark | `.reach-mark` (+ `--lg` / `--xl` / `--static` / `.on-dark`) | Dot + ripple animado; estático em lockups |
| Lockup | `.reach-lockup` (+ `--sm` / `--lg`) | Mark + "Reach / by Simpla.fy" |
| Tipo | `.reach-hero` `.reach-display` `.reach-h1` `.reach-h2` `.reach-h3` `.reach-lead` `.reach-body` `.reach-meta` `.reach-eyebrow` | |
| Botão | `.reach-button` + `--primary` / `--secondary` | 48px, pill, inverte sobre dark |
| Pill | `.reach-pill` + `--green` / `--warm` / `--dark` | 28px de altura |
| Card | `.reach-card` + `--tight` / `--featured` | Padding 28px, radius xl, borda hairline |
| Grid | `.reach-grid` + `--2` / `--3` / `--4` | Gap 20px, responsivo |

---

## Não fazer

- ❌ Usar `--reach-warm` em CTA, alert, status — é só decorativo
- ❌ Trocar o verde-neon Simplafy por outro verde "mais natural" — paleta é canônica
- ❌ Misturar Reach kit com hub kit num mesmo HTML
- ❌ Usar Causten 800 — abre 1 ponto, fica editorial
- ❌ Animar o ripple em superfícies de leitura prolongada (uso 1× por seção, no máximo)
- ❌ Colocar a Simplafy "na frente" do Reach — a marca do programa é **Reach**, com "by Simpla.fy" como assinatura discreta

---

## Versionamento

| Versão | Data | Mudanças |
| --- | --- | --- |
| 0.1.0 | 2026-05-24 | Primeiro release. Brand mark com ripple, token warm, componentes utilitários, showroom completo. Consome `tokens.css` v1.1.0. |
