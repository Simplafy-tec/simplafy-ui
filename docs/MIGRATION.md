# Guia de migração — aplicando o DS no que já existe

Este guia diz, por superfície, **o que precisa mudar** pra alinhar com o Design System canônico (`colors_and_type.css` + `README.md` + `preview/*`).

Complementa o `AUDIT.md` (que diagnosticou o que tá diferente).

---

## 1. Simplafy Hub v2 (`simplafy-hub-v2` + `@simplafy-tec/ui`)

**Status atual:** ✅ Já é a fonte canônica. É o Hub v2 que define o DS, não o contrário.

**O que fazer:**
- Continuar consumindo tokens direto de `@simplafy-tec/ui/tailwind-preset`.
- Qualquer token novo que criar (ex: se precisar de uma cor `lime`) deve **primeiro** entrar neste DS e depois ser propagado pro `simplafy-ui`.
- Se criar componente novo, espelhar neste DS (em `preview/components-*.html`) antes de marcar como oficial.

**O que NÃO fazer:**
- Adicionar cor ad-hoc num módulo (ex: `style={{color:'#f59e0b'}}`) — isso cria débito que o DS não rastreia.

### 1.1 Patch — nova escala de radius (Nov 2026)

O DS mudou a escala de radius para algo mais **contido**. Aplicar no `@simplafy-tec/ui`:

| Token | Antes | Agora | Onde usa |
| --- | --- | --- | --- |
| `--radius-xs` | — (novo) | **2 px** | Badges, barras de chart |
| `--radius-sm` | 6 px | **4 px** | nav-item, icon-button, tabs helpers |
| `--radius-md` | 8 px | **6 px** | Input, Select, Textarea, **Button** |
| `--radius-lg` | 12 px | **8 px** | Cards, KPIs, Sheets, Popovers |
| `--radius-xl` | 16 px | **10 px** | Hero marketing (site) |
| `--radius-2xl` | 20 px | *removido* | — |
| `--radius-full` | 9999 px | 9999 px | Switch, avatar, profile-btn, contador |

**Arquivos a editar no `simplafy-ui`:**
- `src/tailwind-preset.ts` — atualizar escala `borderRadius` com os valores acima.
- `src/components/button.tsx` — trocar `rounded-[10px]` (hardcoded) por `rounded-md` (token).
- `src/components/select.tsx` — alinhar altura em **40 px** (hoje 34). Combina com o Input.
- `src/components/{input,textarea}.tsx` — confirmar que usam `rounded-md` (novo 6 px).
- `src/components/{card,metric-card}.tsx` — trocar `rounded-[16px]`/`rounded-xl` por `rounded-lg` (novo 8 px).
- `src/components/badge.tsx` — trocar para `rounded-xs` (novo 2 px).

**Arquivos a editar no `simplafy-hub-v2`:**
- `apps/web/**/*.tsx` — rodar `rg 'rounded-\[' apps/web/src` e substituir hardcodes por tokens.
- `apps/portal/src/index.css` (Saúde) — mesma troca, ver §2 abaixo.

**Ordem sugerida:**
1. PR no `simplafy-ui` com novos tokens + ajustes de componentes + bump de versão.
2. `pnpm up @simplafy-tec/ui` no Hub v2 e Saúde.
3. Rodar `rg 'rounded-\[\d+px\]'` nos consumidores e limpar os hardcodes residuais.

---

## 2. Simplafy Saúde (`simplafy-saude/apps/portal`)

**Status atual:** 🟡 Tokens em HSL legacy (Tailwind 3), primary correto mas formato diferente do Hub v2.

**Migração por etapas:**

### Passo 1 — Atualizar `apps/portal/src/index.css`
Substituir os `--color-*` em HSL por equivalentes oklch (ver `colors_and_type.css` deste projeto). Todos os tokens `*-bg`, `chart-*` e `doc-color-*` já estão mapeados lá.

```diff
- --color-primary: 142 71% 45%;
+ --color-primary: oklch(0.72 0.19 150);
```

Manter tailwind 3 compilando enquanto não migra — `rgb(var(--color-primary))` vira `var(--color-primary)` direto, e o `bg-primary` utility continua funcionando.

### Passo 2 — Auditar classes hardcoded
Rodar busca por hex literais e substituir por token:
```sh
rg '#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}' apps/portal/src
```
Tudo que aparecer deve ou virar token do DS ou ser justificado como "dado externo" (ex: cor vinda de API).

### Passo 3 — Migrar para `@simplafy-tec/ui`
Uma vez alinhados os tokens, trocar componentes internos por imports do `simplafy-ui`:
```diff
- import { Button } from '@/components/ui/button'
+ import { Button } from '@simplafy-tec/ui'
```

### Passo 4 — Tailwind v4
Depois de Hub v2 estar estável em v4 há um ciclo, subir Saúde também. O `@theme` já tá pronto no `simplafy-ui`.

---

## 3. Simplafy Seguros (`simplafy-seguros`)

**Status atual:** 🟡 Assumido espelhar Saúde. A receita é a mesma do item 2.

**Específico:** nos UI kits setoriais deste DS, Seguros tem um acento `amber/orange` pra diferenciar de Saúde (teal/blue). Isso é **variant**, não um token novo — use `--color-orange` e `--color-orange-bg` quando quiser "sabor Seguros".

---

## 4. Site marketing (`simplafy-site`)

**Status atual:** 🔴 Universo visual próprio. Cor, raio, sombra e background todos divergentes.

**Aqui a estratégia muda:** o site **não precisa virar igual ao produto** — ele é marketing-first (dark, rounded, dramático). O objetivo é **tornar a relação explícita**, não fundir.

### O que migrar

1. **Logo e mark canônicos** — trocar `logo5.svg` por `logo_simplafy_parent.svg` (da master Figma importada neste projeto). Alinhar clearspace/tamanhos.
2. **Primary green** — decidir: manter `#14D77D` marketing-only (documentar como "Neon brand-green do site") OU convergir para `#22C55E` do produto. Recomendação: **unificar em `#1DEF3B`** (é o brand-green do Figma), abandonar `#14D77D`.
3. **Tipografia** — incluir `Causten` via `@font-face` (o site hoje só usa Sora/Inter). Usar Causten **no H1 hero e no logo-wordmark**; manter Sora no resto. Isso reforça identidade sem mudar muito o look.
4. **CTA primário** — usar o mesmo shape do produto (gradiente `oklch(0.72 0.19 150)` → `#34d399`) OU manter o próprio. Documentar a escolha.

### O que manter
- Background escuro + glass-morphism + radial blobs ← é a estética marketing e é legítima.
- Radius 40px, sombras dramáticas ← marketing-specific.
- Estrutura HTML custom (não vale refatorar para React).

### Entregável
Um `site.css` que importa `colors_and_type.css` e sobrescreve só o que precisa ficar marketing:
```css
@import url("simplafy-ds/colors_and_type.css");
:root {
  --color-background: #05070c;
  --color-foreground: #ffffff;
  --radius-lg: 28px;
  --radius-xl: 40px;
  /* etc. */
}
```

---

## 5. Redes sociais / OG images / Decks

**Status atual:** 🔴 Fragmentados. Cada post é feito ad-hoc.

**Plano:**
- Criar templates (Figma ou Canva) que consomem: logo Simplafy, Causten ExtraBold para headline, `#1DEF3B` como brand-green, fundo `#0B0F2A`/`#05070c`.
- Decks (pitch, produto) — usar este próprio projeto para gerar (há templates em `preview/*` que viram slides).
- OG images do site (`og_*.png`) — regenerar com Causten + logo canônico.

**Quem é responsável:**
- Marketing: produz templates.
- Design Ops (quem mantém este DS): valida cor/logo/tipografia antes de publicar.

---

## 6. Agro (`simplafy-agro`)

**Status atual:** ⚪ Sem frontend ainda.

**Quando começar:**
- Forkar `simplafy-ui` direto, nem pensar em reescrever.
- Definir uma cor de acento setorial (candidato: `green` mais terroso ou `earth` — decidir com marketing).
- Seguir o mesmo playbook do Saúde: começar de um template do `simplafy-ui` e adicionar só `*-bg` e componentes específicos do domínio.

---

## Ordem recomendada de execução

1. **Agora:** DS completo (este projeto) — tokens, kits, previews, governança.
2. **Próxima sprint:** PR no `simplafy-ui` com nova escala de radius (§1.1) + Select em 40 px. Bump minor.
3. **Mês 1:** Site — substituir logos + incluir Causten + decidir `#14D77D` vs `#1DEF3B`.
4. **Mês 1:** Templates sociais com DS.
5. **Mês 2–3:** Saúde portal — migrar tokens HSL → oklch, consumir `simplafy-ui`, substituir Inter/Sora por Geist.
6. **Mês 3+:** Seguros alinhamento (se aplicável).
7. **Continuous:** qualquer feature nova em qualquer superfície começa consultando o DS.

---

## Regra de convivência

Enquanto uma superfície ainda não migrou, **o DS é aspiracional, não policial**. Não quebrar o que funciona. A meta é que em ~3 ciclos, todas as superfícies estejam consumindo os mesmos tokens.
