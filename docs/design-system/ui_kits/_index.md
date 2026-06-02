# `ui_kits/` — mapa de orientação

> **Primeira leitura pra qualquer agente que abre o Simplafy Design System.**
> Antes de escrever uma linha de CSS, abra este arquivo e o `tokens.css` da raiz.

---

## Estrutura

```
ds/
├── tokens.css            ⭐ PRIMITIVOS DA MARCA (cor, tipo, radius, brand)
│                            — única fonte de verdade. Mudou aqui, propaga.
│
└── ui_kits/
    ├── _index.md         ← você está aqui
    │
    ├── site/             marketing público — landing pages, blog, conectores
    │   → projeto "Site Simplafy - V2"
    │   → fundo dominante: light/soft; alterna com hero/footer dark (ink-1)
    │   → type scale agressiva (hero 80px, body 15px)
    │   → componentes: Section, Container, Button (pill), Pill, Eyebrow, Mark, Card
    │
    ├── hub/              SaaS interno — workspace, agent builder, dashboards
    │   → projeto Hub v2 (Next.js + Tailwind)
    │   → fundo dominante: dark (ink-1/ink-2); cards translúcidos
    │   → type scale densa (body 14px, h1 30px)
    │   → PATTERNS.md ⭐ — fonte de verdade das interações (drawers, toast, ícones)
    │   → componentes: Shell (sidebar+topbar), AgentCard, ScoreWidget,
    │                  TemplatesDrawer, ToolCard, PromptBlock, KPI inline,
    │                  Command palette, Tables, Drawers, Sheets
    │
    ├── reach/           **sub-marca social** — programa pro bono p/ ONGs
    │   → "Digital support for people doing good."
    │   → herda paleta Simplafy, adiciona token --reach-warm + brand mark com ripple
    │   → componentes: lockup, mark animado (dot + ripple), button pill, card,
    │                  step-list, stat-card, testimonial, 5 tons de section
    │
    ├── saude/            portal clínico — agendamento, prontuário, financeiro
    │   → predomina light/soft; accent setorial: teal + blue
    │   → componentes: Shell, lista de pacientes, agenda semanal,
    │                  card de agendamento (variantes consulta/exame/bloqueio),
    │                  KPI strip
    │
    └── seguros/          broker / corretora
        → predomina light/soft; accent setorial: orange + amber
        → componentes: Shell, pipeline kanban (5 estágios), card de lead,
                       KPI strip, toolbar de filtros
        → será absorvido pelo Hub v2 — ver seguros/CAPTURED.md
```

---

## Regras de ouro

1. **Não inventar nova cor de marca em um kit.**
   Se faltar token, ADD em `tokens.css` da raiz.

2. **Não mudar token sem alinhar** com TODOS os kits que consomem.
   Bumpa a versão de `tokens.css` no header dele.

3. **Kits podem ADICIONAR vocabulário próprio** — ex: `ui_kits/hub/` define
   `--hub-shell-w: 240px`, `--hub-topbar-h: 56px`. Não cabe em `tokens.css`
   porque é específico do app. NUNCA contradizer um primitivo.

4. **Cada kit tem seu próprio README.md** com:
   - Tons e densidade que o kit usa
   - Type scale do kit (varia entre site e produto)
   - Lista de componentes do kit
   - Quando usar esse kit vs outro

5. **Antes de criar componente novo**, ler o README do kit relevante.
   Componentes que existem em um kit podem ser reaproveitados em outro
   só se fizerem sentido (ex: `Button` é universal — vive em todos os kits
   com leves variações de altura/peso).

---

## Como escolher o kit certo

| Contexto | Kit |
|---|---|
| Landing page, blog post, página institucional | `site` |
| Workspace logado, builder de agentes, dashboards | `hub` |
| Portal de clínica, agenda médica | `saude` |
| Corretor de seguros, simulação | `seguros` |
| Programa social, landing de ONG, candidatura pro bono | `reach` |
| Email transacional, PDF gerado | `site` (tem variantes utilitárias inline-friendly) |
| Componente que será compartilhado entre 2+ contextos | discutir com o time antes de criar |

---

## Versionamento

Cada kit é versionado independente, MAS seu major bate com o major do `tokens.css`.

- `tokens.css v1.x` ⇄ todos os kits 1.x compatíveis
- `tokens.css v2.0` ⇄ requer kits 2.x (breaking change na marca)

Por ora `tokens.css` está em **v1.1.0**.
