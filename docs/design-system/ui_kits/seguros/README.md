# `ui_kits/seguros/` — Simplafy Seguros

Portal de corretora — pipeline comercial, carteira, apólices, sinistros.

> **Atenção:** o módulo Seguros vai ser **absorvido pelo Hub v2** (ADR-001 v8).
> Este kit existe pra documentar os padrões de domínio até a migração
> acontecer. Ver [`CAPTURED.md`](CAPTURED.md) para o que vale levar.

---

## Quando usar

Quando o output é uma tela de **operação de corretora**: pipeline kanban,
gestão de leads, cotações, apólices, renovações, sinistros.

A densidade visual é a mesma do Hub (SaaS interno), mas o **accent setorial
é orange + amber** — usados em "Hot lead", "Urgente", "Renovação próxima".

---

## Como usar

```html
<head>
  <!-- Kit Seguros (já importa tokens.css canônico) -->
  <link rel="stylesheet" href="<DS>/ui_kits/seguros/seguros.css">
</head>
```

Não importe `tokens.css` separadamente — `seguros.css` já faz isso.

---

## O que está aqui

| Arquivo | Contém |
| --- | --- |
| [`seguros.css`](seguros.css) | Camada de alias produto (`--color-*`) + accent setorial (orange/amber) + reset mínimo |
| [`index.html`](index.html) | Mock "Pipeline comercial" — referência visual do kit em uso |
| [`CAPTURED.md`](CAPTURED.md) | O que migrar pro Hub v2 quando o módulo for absorvido |

---

## Tom e densidade

- **Body:** 14px Geist
- **Density:** alta (SaaS interno)
- **Fundo:** claro (`--white`), cards brancos sobre `--soft`
- **Primary:** `--green-mid` `#22C55E` (verde Simplafy do produto)
- **Accent setorial:** `--color-orange` para "Hot/Urgente"; `--color-warning`
  para "Pendente/Renovação"
- **Status de lead/apólice:**
  - `success` (verde) → Convertido / Fechado / Ativo
  - `warning` (âmbar) → Pendente / Aguardando documentação
  - `orange` → Hot / Lead quente / Urgente
  - `blue` → Tipo de produto (Auto, Patrimonial, Frota)
  - `teal` → Vida / WhatsApp sincronizado
  - `destructive` (vermelho) → Sinistro / Cancelado

---

## Componentes do kit

Seguros usa o **mesmo vocabulário do Hub** (`.sb`, `.nv`, `.btn`, `.card`,
`.badge`). Componentes específicos do domínio comercial (no `index.html`):

| Componente | Onde | Padrão |
| --- | --- | --- |
| Lockup setorial | `<img src="assets/logos/seguros_*.svg">` | Sempre na head da sidebar |
| Kanban pipeline | `.pipe` (grid 5 colunas: Novo → Fechado) | 5 estágios fixos |
| Coluna kanban | `.col / .col-h / .col-body` | Contador no header pill mono |
| Card de lead | `.lead / .lead-name / .lead-co / .lead-meta / .lead-val` | Valor `font-mono`; border-color = success quando Fechado |
| KPI strip | `.kpi / .kpi-l / .kpi-v` | 4 cards (Leads no mês, Em negociação, Fechados, Conversão) |
| Toolbar de filtros | `.toolbar / .trigger` | Row de selects + "Atualizado há N min" à direita |

---

## Não fazer

- ❌ Trocar o primary verde por orange (orange é **accent**, não primary)
- ❌ Misturar com Hub kit num mesmo HTML (escolher um)
- ❌ Customizar os 5 estágios do pipeline (Novo / Contato / Cotação /
  Negociação / Fechado são o padrão de domínio — virar config no Hub v2)

---

## Versionamento

| Versão | Data | Mudanças |
| --- | --- | --- |
| 0.1.0 | 2026-05-23 | Primeira extração. Kit CSS criado a partir do mock `index.html`. Consome `tokens.css` v1.1.0. |
