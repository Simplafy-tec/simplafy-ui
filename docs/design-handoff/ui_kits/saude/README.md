# `ui_kits/saude/` — Simplafy Saúde

Portal clínico — agenda, prontuário, financeiro, comunicação com pacientes.

---

## Quando usar

Quando o output é uma tela de **gestão clínica**: agenda, fila de pacientes,
prontuários, faturamento de convênios, comunicação WhatsApp clínica.

A densidade visual é a mesma do Hub (SaaS interno), mas o **accent setorial
é teal + blue** — usados em integrações (convênios), status de exames e
plantões médicos.

---

## Como usar

```html
<head>
  <!-- Kit Saúde (já importa tokens.css canônico) -->
  <link rel="stylesheet" href="<DS>/ui_kits/saude/saude.css">
</head>
```

Não importe `tokens.css` separadamente — `saude.css` já faz isso.

---

## O que está aqui

| Arquivo | Contém |
| --- | --- |
| [`saude.css`](saude.css) | Camada de alias produto (`--color-*`) + accent setorial (teal/blue) + reset mínimo |
| [`index.html`](index.html) | Mock de tela "Agenda da semana" — referência visual do kit em uso |

---

## Tom e densidade

- **Body:** 14px Geist
- **Density:** alta (SaaS interno)
- **Fundo:** claro (`--white`), cards brancos sobre `--soft`
- **Primary:** `--green-mid` `#22C55E` (verde Simplafy do produto)
- **Accent setorial:** `--color-teal` para integrações + status; `--color-blue`
  para tipos de exame
- **Status de agendamento:**
  - `success` (verde) → consulta confirmada
  - `warning` (âmbar) → aguardando / reagendado
  - `blue` → exame
  - `teal` → telemedicina / integração WhatsApp
  - `destructive` (vermelho) → cancelado

---

## Componentes do kit

A Saúde usa o **mesmo vocabulário do Hub** (`.sb`, `.nv`, `.btn`, `.card`,
`.badge`). Componentes específicos do domínio clínico (no `index.html`):

| Componente | Onde | Padrão |
| --- | --- | --- |
| Lockup setorial | `<img src="assets/logos/saude_*.svg">` | Sempre na head da sidebar |
| Lista de pacientes | `.pat-list / .pat / .pat-ava` | Avatar com iniciais, nome + sub (horário · tipo) |
| Agenda semanal | `.agenda` (grid 60px + 5 colunas) | Slot por horário, célula por dia |
| Card de agendamento | `.appt` (variantes `.appt.b` exame, `.appt.w` bloqueio) | Borda lateral 3px + tint do status |
| KPI strip | `.kpi / .kpi-l / .kpi-v / .kpi-t` | 3 cards de métrica do dia |

---

## Não fazer

- ❌ Trocar o primary verde por teal (teal é **accent**, não primary)
- ❌ Hardcode de cor de médico — usar a paleta `--doc-color-0..9` (deterministic
  por hash). Quando estiver disponível em tokens.css canônico, migrar pra lá.
- ❌ Misturar com Hub kit num mesmo HTML (escolher um)

---

## Versionamento

| Versão | Data | Mudanças |
| --- | --- | --- |
| 0.1.0 | 2026-05-23 | Primeira extração. Kit CSS criado a partir do mock `index.html`. Consome `tokens.css` v1.1.0. |
