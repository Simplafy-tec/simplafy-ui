# Simplafy Design Context Package

Context package for visual/UX design review of two Simplafy applications.

---

## Applications

### Hub v2 (`hub-v2/`)

**What:** AI agent platform for businesses. Manages AI agents, CRM leads, automated journeys (campaigns), chat, knowledge base, and integrations (WhatsApp, Pipefy, etc.).

**Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7
- Tailwind CSS 4 (CSS-first config, no tailwind.config.ts)
- @simplafy-tec/ui (shared design system)
- Lucide React icons
- Monorepo via Turborepo

**URL (staging):** app-staging.simplafy.com.br

---

### Saude (`saude/`)

**What:** Healthcare clinic management SaaS. Multi-tenant platform for medical clinics with WhatsApp AI agents, appointment scheduling, patient management, financial tools, and clinical records.

**Stack:**
- React 18
- Vite 6
- TypeScript
- Tailwind CSS 3 (traditional tailwind.config.js)
- Shadcn/UI (Radix primitives)
- TanStack Query 5
- Zustand (client state)
- React Router 6

**URL (staging):** saude-staging.simplafy.com.br

---

## Shared Design System

Both apps consume **@simplafy-tec/ui** from the repo `github.com/Simplafy-tec/simplafy-ui`.

- **Package:** `@simplafy-tec/ui` (GitHub Packages registry)
- **Storybook:** https://design.simplafy.com.br
- **Style:** shadcn/ui new-york variant + Lucide icons
- **Import:** `import { Button, Badge, ... } from '@simplafy-tec/ui'`
- **Tokens import:** `@import "@simplafy-tec/ui/globals.css"` in app globals.css

Hub v2 consumes the design system directly. Saude has its own local Shadcn/UI copy (historical) but follows the same token system.

---

## Folder Contents

### `hub-v2/`
| Path | Contents |
|------|----------|
| `assets/` | Logos (hub-logos/), icons (icons/) from `public/` |
| `styles/globals.css` | CSS entry point (imports @simplafy-tec/ui/globals.css) |
| `styles/postcss.config.mjs` | PostCSS/Tailwind 4 configuration |
| `layout.tsx` | Root layout (fonts, providers) |
| `layout/app-layout.tsx` | App shell layout (sidebar + content area) |
| `layout/sidebar.tsx` | Main sidebar component |
| `layout/sidebar-nav.tsx` | Navigation items renderer |
| `layout/nav-items.ts` | Navigation item definitions |
| `layout/org-switcher.tsx` | Organization switcher in sidebar |
| `layout/sidebar-user.tsx` | User avatar/menu in sidebar |
| `layout/topbar.tsx` | Top navigation bar |
| `pages/` | 17 page components (dashboard, chat, CRM, agents, journeys, executions, settings, profile, help) |
| `settings/` | 5 settings panel components (canais, conexoes, contatos, ferramentas, kb) |

### `saude/`
| Path | Contents |
|------|----------|
| `assets/` | Logos (logos/), images (images/), favicon, oauth-callback |
| `styles/index.css` | Full CSS variables (light + dark mode tokens) |
| `styles/tailwind.config.js` | Tailwind 3 config with all semantic color mappings |
| `layout/Layout.tsx` | Main app layout wrapper |
| `layout/Sidebar.tsx` | Navigation sidebar |
| `pages/` | 27 page components (Dashboard, Patients, Calendar, Chat, Agents, Settings, Financial, etc.) |

---

## Key Design Tokens

Both apps share the same token system (HSL CSS custom properties):

### Colors (Light Mode)
| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--primary` | 142 71% 45% | #22C55E | Primary green (buttons, active states) |
| `--primary-text` | 142 71% 38% | #16A34A | Active text/icons (light mode) |
| `--secondary` | 172 66% 50% | #2DD4BF | Teal accent |
| `--background` | 0 0% 100% | #FFFFFF | Page background |
| `--foreground` | 220 39% 11% | #0F172A | Primary text |
| `--card` | 220 13% 98% | #F9FAFB | Card/surface background |
| `--muted` | 220 13% 96% | #F3F4F6 | Muted surface |
| `--muted-foreground` | 215 16% 47% | #64748B | Secondary text |
| `--border` | 220 13% 91% | #E5E7EB | Borders |
| `--destructive` | 0 84% 60% | #EF4444 | Error/danger red |
| `--warning` | 38 92% 50% | #F59E0B | Warning amber |
| `--info` | 199 89% 61% | #38BDF8 | Info blue |
| `--purple` | 271 91% 65% | #A855F7 | Purple accent |
| `--orange` | 24 94% 53% | #F97316 | Orange accent |

### Colors (Dark Mode)
| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--background` | 220 20% 7% | #0E1117 | Dark page background |
| `--foreground` | 210 20% 93% | #ECF0F5 | Light text |
| `--card` | 220 18% 11% | #161B26 | Dark card surface |
| `--muted` | 220 16% 15% | #1F2633 | Dark muted surface |
| `--muted-foreground` | 215 15% 65% | #95A3B8 | Dark secondary text |
| `--border` | 215 20% 22% | #2A3548 | Dark borders |
| `--primary-text` | 142 76% 59% | #4ADE80 | Active text/icons (dark mode) |

### Semantic Background Tokens (low-opacity tints)
| Token | Usage |
|-------|-------|
| `--primary-bg` | Green tinted backgrounds |
| `--teal-bg` | Teal tinted backgrounds |
| `--blue-bg` | Blue tinted backgrounds |
| `--purple-bg` | Purple tinted backgrounds |
| `--amber-bg` | Amber tinted backgrounds |
| `--orange-bg` | Orange tinted backgrounds |
| `--red-bg` | Red/error tinted backgrounds |

### Typography
| Token | Value |
|-------|-------|
| `--font-sans` | Inter, ui-sans-serif, system-ui, sans-serif |
| `--font-serif` | Source Serif 4, serif |
| `--font-mono` | JetBrains Mono, ui-monospace, monospace |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.5rem (8px) | Default (buttons, inputs) |
| `--radius-card` | 0.75rem (12px) | Cards |
| `--radius-modal` | 1rem (16px) | Modals/dialogs |

### Shadows
Defined from `--shadow-2xs` through `--shadow-2xl` with progressive depth.

### Chart Colors
5 chart colors: Green, Teal, Lime, Sky, Dark Green (variables `--chart-1` through `--chart-5`).

---

## Design Principles

1. **Token-driven:** Zero hardcoded colors, radii, or fonts. All visual values come from CSS custom properties.
2. **Dark mode ready:** Both light and dark themes defined via `.dark` class toggle.
3. **Green identity:** Primary brand color is green (#22C55E), with teal as secondary.
4. **Consistent spacing:** Uses Tailwind's spacing scale (4px base unit).
5. **Icon system:** Lucide React exclusively (no mixing icon libraries).
6. **Component library:** @simplafy-tec/ui provides all primitives (Button, Badge, Input, Card, Dialog, etc.).
7. **PT-BR language:** All user-facing text is in Brazilian Portuguese.
