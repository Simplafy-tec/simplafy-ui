# Simplafy Hub v2 — Claude Code Instructions

## PM Board
Módulo PM Board: `hub`. Usar `pm_get_hierarchy(module='hub')` para orientação.

## Stack
- **Frontend:** Next.js 15 (App Router, React 19, TypeScript 5.7)
- **Backend:** NestJS (TypeScript)
- **ORM:** Prisma 6 + PostgreSQL
- **UI:** @simplafy-tec/ui (repo próprio: Simplafy-tec/simplafy-ui) — shadcn/ui new-york style + Lucide icons + Tailwind CSS 4
- **Auth:** NextAuth v5 (JWT)
- **Package Manager:** pnpm (--frozen-lockfile obrigatório)
- **Monorepo:** Turborepo

## Onde estou trabalhando? — escolher o kit certo

A Simplafy tem **2 contextos visuais distintos** que dividem a mesma marca:

| Contexto | Onde está | Kit | Quando usar |
|---|---|---|---|
| **Site marketing** (simplafy.com.br) | projeto "Site Simplafy - V2" | `ui_kits/site/` | Landing, blog, casos, conectores, calculadora, status, página institucional |
| **Hub SaaS** (workspace logado) | este repo | `ui_kits/hub/` | Builder de agente, dashboards, chat, CRM, billing, settings |
| **Saúde** (portal clínico) | TBD | `ui_kits/saude/` | Agenda, prontuário, financeiro de clínica |
| **Seguros** (broker) | TBD | `ui_kits/seguros/` | Simulação, gestão de apólice |

**Antes de começar qualquer trabalho visual:**

1. Leia `ui_kits/_index.md` — mapa geral
2. Leia `tokens.css` na raiz — primitivos canônicos da marca
3. Leia `ui_kits/<seu-kit>/README.md` — vocabulário e densidade do contexto

**Regras de ouro:**
- Não inventar nova cor de marca em um kit. Se faltar token, ADD em `tokens.css` (raiz).
- Mudou token? Alinha com todos os kits que consomem + bumpa versão no header.
- Kits podem ADICIONAR vocabulário próprio (ex: `--hub-shell-w`), nunca contradizer um primitivo.
- Site = hierarquia agressiva (body 15px); Hub = density alta (body 14px). Não misturar.

## Monorepo Structure
- `apps/web/` — Next.js 15 frontend
- `apps/api/` — NestJS backend
- ~~`packages/ui/`~~ — removido (extraído para repo próprio: Simplafy-tec/simplafy-ui)
- `prisma/` — Prisma schema

## Commands
```bash
pnpm install --frozen-lockfile    # Install deps
pnpm dev                          # Dev all apps
pnpm lint                         # Lint all
pnpm typecheck                    # TypeScript check
pnpm test                         # Run tests
pnpm build                        # Build all
```

## Code Style
- **No console.log** — use console.warn or console.error
- **Unused vars** — prefix with `_`
- **Prettier** — singleAttributePerLine + prettier-plugin-tailwindcss
- **Zero hardcoded colors/radius/fonts** — use design tokens
- **Idioma pt-BR obrigatório** em todo texto visível ao usuário (labels, botões, toasts, placeholders, mensagens de erro). NUNCA pt-PT. Usar: salvar (não guardar), arquivo (não ficheiro), usuário (não utilizador), configurações (não definições), contato (não contacto), tela (não ecrã)

## Direção frontend (integrações / ferramentas)

Modelo **multi-instância** (N conexões por tipo), fluxo Ferramentas (catálogo → ConfigModal → tabela → ToolDetailModal), padrões UI/hooks/BFF/PT-BR e backlog: ver [`docs/architecture/hub-v2-frontend-direction.md`](docs/architecture/hub-v2-frontend-direction.md).

## Architecture Decisions (ADR-001 v8)
- Hub v2 is a **clean start** — not a fork of Hub v1 (OAP)
- Backend NestJS lives INSIDE this repo (apps/api/)
- @simplafy-tec/ui extraído para repo próprio (Simplafy-tec/simplafy-ui) — Hub#5.2.13.5
- Seguros absorvido como módulo do Hub
- Frontend modules: Agent Console, Chat, CRM, Campaigns, Jornadas, BI
- Backend modules: CRM, Campaigns, Agents, Billing (Stripe AaaS), Auth, Integrations

## Design System — @simplafy-tec/ui

**REGRA:** Antes de criar componente novo, verificar o COMPONENTS.md no repo Simplafy-tec/simplafy-ui. Se equivalente existe em `@simplafy-tec/ui`, USAR (`import { X } from '@simplafy-tec/ui'`). Se não existe: REPORTAR ao PM/usuário e aguardar autorização.

- **Repo:** github.com/Simplafy-tec/simplafy-ui
- Storybook: design.simplafy.com.br
- **Import:** `import { Button, Badge, ... } from '@simplafy-tec/ui'`
- **Registry:** GitHub Packages (`.npmrc`: `@simplafy-tec:registry=https://npm.pkg.github.com`)
- Tokens: via `@import "@simplafy-tec/ui/globals.css"` no globals.css

**PROIBIDO:**
- Hardcodar cores (usar tokens: `bg-primary`, `text-muted-foreground`)
- Hardcodar radius (usar `rounded-sm`/`md`/`lg`/`xl`)
- Importar icon pack que não seja `lucide-react`
- Criar Button/Badge/Switch/Input/Table custom em `apps/web`

**Relação com este DS project:**

O pacote `@simplafy-tec/ui` é o BUILD do Hub kit (`ui_kits/hub/`) deste projeto. As fontes (tokens.css, hub.css, componentes) vivem aqui; o pacote npm é a publicação versionada que apps consomem.

Site (simplafy.com.br) NÃO consome `@simplafy-tec/ui` — usa `ui_kits/site/` deste DS diretamente (ou seu próprio build futuro). São contextos visuais distintos com o mesmo `tokens.css` na raiz.

## Secrets
All via Infisical (https://secrets.simplafy.com.br). Project: simplafy-hub-v2. NEVER hardcode.

## Deploy
- **Staging only** — zero prod Application
- **Cluster:** Staging-2 (157.90.19.114)
- **Namespace:** simplafy-staging-hub-v2
- **Registry:** ghcr.io/simplafy-tec/simplafy-hub-v2-{web,api}
- **GitOps:** ArgoCD auto-sync

## Local Dev (hybrid)
Setup para dev local com hot reload, usando staging para DB/Redis/LangGraph.

- **Skill:** `/bmad:bmm:workflows:devops-dev-local` — requer autorização explícita do usuário
- **Script:** `bash .tooling/dev-local-hub-v2.sh` (workspace root)
- **Portas:** web :3000/hub, api :3002, swagger :3002/docs
- **Tunnels:** DB :5433, Redis :6380, LangGraph :2024 (staging-2)
- **Env:** `.env.local` na raiz do hub-v2 (gitignored, gerado a partir do Infisical)
- **Banco compartilhado:** dados criados localmente aparecem no staging (e vice-versa)
- **CI obrigatório:** migrations Prisma, LangGraph agents, Dockerfiles, novas dependências
