# Simplafy Hub · Padrões de UI

> Esse documento é a **fonte da verdade** pra como UI do Hub é construída. Não invente um padrão novo se já tem um listado aqui — siga, ou justifica em PR a substituição.
>
> **Atualize quando uma decisão muda.** Não contradiga em silêncio.
>
> Espelhado do projeto canônico do Hub. Consome `tokens.css` v1.1.0 deste DS.
> Última atualização: Fase 5 (Configurações) — drawers padronizados, toast system, em-breve, hero unificado.

---

## 1. Hierarquia de telas

```
App shell           ← Sidebar (240px) + main content (1fr)
  └─ Topbar         ← sticky, 56px, dynamic context (workspace/crumbs/custom)
     └─ Page-content
        ├─ List screen     (hero compacto + toolbar + grid/rows)
        ├─ Detail/editor   (ed-shell: TOC + doc + preview rail)
        ├─ Settings shell  (hero + sub-sidebar + content)
        └─ Empty stub      (centered illustration + CTA)
```

**Hero superior é padrão em toda página principal** (Agentes, Configurações, e fases 2-4 quando forem). Hero contém eyebrow + h1 com mark + parágrafo de intro. Veja seção 14.

**Editor de Agente** é a referência canônica de "documento longo configurável" — usa o padrão `ed-shell` (TOC + doc + preview rail).

---

## 2. Section pattern (uso obrigatório no editor-style)

Cada bloco de configuração segue:

```jsx
<section id="sec-{id}" className="ed-section">
  <div className="ed-section-h">
    <div className="ed-section-num">04</div>   {/* num chip primary-bg */}
    <h3>Título da seção</h3>
    {/* opcional: ação à direita (linka pra config global) */}
    <a className="sec-act"><Settings size={13}/> Gerenciar X</a>
  </div>
  <p className="ed-section-sub">
    Subtítulo explicando o quê e quando mexer.
    Máximo 720px de largura pra legibilidade.
  </p>
  {/* conteúdo da seção: cards, pickers, forms */}
</section>
```

**Visual**:
- Hairline horizontal acima de cada seção (exceto a 1ª)
- Tab verde de 2×26px pendurado da hairline na esquerda, alinhado ao number chip
- Number chip 30×30, fundo `--primary-bg`, mono 13px bold
- Title em `--font-display` 24px, peso 700, letter-spacing -0.015em

---

## 3. Picker patterns

### Single-select (radio) — usado em Channel, Pipeline, Modelo
```html
<label className="X-card on">              {/* on = selected */}
  <div className="radio"><span/></div>      {/* círculo + dot interno */}
  <div className="body">
    <div className="top">
      <span className="hd">Nome</span>
      <span className="tp">Tipo</span>
    </div>
    <div className="ds">meta · meta · meta</div>
  </div>
  {/* opcional: pill de status à direita */}
</label>
```

### Multi-select (switch) — usado em Ferramentas, Base de conhecimento, Mídia
```html
<div className="Y-card on">
  <div className="ico">{icon}</div>
  <div className="body">
    <div className="nm">Nome</div>
    <div className="ds">descrição</div>
  </div>
  <button className="switch on"></button>
</div>
```

### Collapsible list (> 3 itens)
Use o helper `useCollapsibleList(items, isSelected)` + componente `<MoreLess>`:
- Mostra os 3 primeiros (selecionados ficam no topo)
- Botão "Ver mais (N)" / "Ver menos"

---

## 4. Drawer pattern — **REGRA #1 do app**

> **Toda tela secundária (criar, editar, configurar, escolher tipo, ver documentação) é um drawer direita. Modais centrados e popups são proibidos exceto em decisões atômicas críticas (transferir ownership, deletar org inteira).**

### Estrutura canônica

```jsx
<div className="vars-backdrop" onClick={onClose}>
  <aside className="vars-drawer wide" onClick={e => e.stopPropagation()}>
    <header className="vars-head">
      {onBack && <button className="drawer-back" onClick={onBack}><ArrowLeft/></button>}
      <div style={{ flex: 1 }}>
        <h3>Título</h3>
        <div className="sub">Subtítulo curto explicando contexto.</div>
      </div>
      <button className="ibtn" onClick={onClose}><X/></button>
    </header>

    {/* Opcional: tabs */}
    <div className="drawer-tabs">
      <button className="drawer-tab on">Config</button>
      <button className="drawer-tab">Documentação</button>
    </div>

    <div className="vars-body" style={{ gap: 14 }}>
      {/* campos, listas, etc. */}
    </div>

    <footer className="vars-foot" style={{ display: "flex", gap: 8 }}>
      <button className="btn btn-outline btn-sm" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={!valid} onClick={onSave}>
        <Check size={13}/> Salvar
      </button>
    </footer>
  </aside>
</div>
```

### Dimensões
- Largura: `.vars-drawer` = 420px, `.vars-drawer.wide` = 460px
- Backdrop: dim foreground 35%
- Animação: slide-in da direita 220ms `cubic-bezier(.22,.61,.36,1)`

### Fecha com
- Click no backdrop
- ESC
- Botão X no header
- Cancelar no footer

### Drawer aninhado (back button)
Quando um drawer abre OUTRO drawer (catálogo → config), o **drawer filho recebe `onBack` prop** que volta pra o anterior:

```jsx
<ToolConfigDrawer
  onBack={isNewFromCatalog ? handleBackToCatalog : null}
  onClose={() => { setConfig(null); setCatalog(null); }}
  ...
/>
```

- Se `onBack` está set, renderiza seta `←` à esquerda do título
- Se NULL (ex: editando item existente, não veio de catálogo), só mostra X de fechar
- handleBack fecha o filho e reabre o pai

### Quando criar um drawer vs. usar inline

| Cenário | Padrão |
|---|---|
| Criar novo item (webhook, pipeline, coleção, agente) | **Drawer** |
| Editar item existente (canal, ferramenta) | **Drawer** |
| Escolher tipo (catálogo de tools, tipos de canal) | **Drawer** com lista vertical (`.catalog-list`) |
| Configurar credenciais (OAuth, API key) | **Drawer** com sub-formulário por tool/canal |
| Ver documentação de algo (webhook curl) | **Drawer** com tab "Documentação" |
| Convidar usuário | **Drawer** |
| Decisão atômica destrutiva (typed confirm) | Modal centrado (raro) |
| Confirmação de delete simples | **Toast com Desfazer** (seção 5) |
| Notificação de sucesso/erro | **Toast** (seção 5) |

---

## 5. Toast system — feedback + delete confirmation

Sistema global de toast. API:

```js
window.toast(message, {
  type: "success" | "info" | "warn" | "error",  // default "info"
  duration: 4000,                                // ms, 0 = não auto-dismiss
  action: {                                       // opcional — botão de ação
    label: "Desfazer",
    onClick: () => { ... },
  },
  onDismiss: () => { ... },                       // chamado se NÃO foi acionada
})
```

### Tipos e quando usar
- **success** (verde) — ação concluída: "Convite enviado", "X removido", "Salvo"
- **info** (azul) — feedback neutro / em breve: "URL copiada", "Em produção abriria X"
- **warn** (âmbar) — restrição: "Não é possível remover o Proprietário"
- **error** (vermelho) — falha real

### Posição
- Desktop: canto inferior-direito, empilha column-reverse
- Mobile (≤768px): acima da bottom tab bar (76px de bottom), full-width com margem

### **Optimistic delete + Undo** — padrão obrigatório pra excluir cards/rows

> **NUNCA use `confirm()` nativo pra deletes.** Use sempre optimistic delete + toast com Desfazer.

```js
function handleDelete(item) {
  let removed = null;
  setList(arr => {
    const idx = arr.findIndex(x => x.id === item.id);
    if (idx === -1) return arr;
    removed = { item: arr[idx], idx };
    return arr.filter((_, i) => i !== idx);
  });
  if (!removed) return;
  window.toast(`"${item.name}" removido.`, {
    type: "success",
    duration: 5000,
    action: {
      label: "Desfazer",
      onClick: () => {
        setList(arr => {
          const next = [...arr];
          next.splice(Math.min(removed.idx, next.length), 0, removed.item);
          return next;
        });
        window.toast("Restaurado.", { type: "info", duration: 2200 });
      },
    },
  });
}
```

Helper `deleteWithUndo({ setList, predicate, undoMessage })` existe em `settings-resources.jsx` — copie pro arquivo que precisar ou mova pra shell.

### Toast pra feedback simples
- Copiou URL → `window.toast("URL copiada.", { type: "success", duration: 2500 })`
- Reenviou convite → `window.toast(\`Convite reenviado pra ${email}\`, { type: "success" })`
- Em produção abriria X → `window.toast("Em produção, abriria ...", { type: "info" })`

---

## 6. "Em breve" pattern

Quando um card/seção/item ainda não funciona mas precisa estar visível no produto, marca como **Em breve** em vez de esconder ou usar placeholder vazio.

### Aplicação em cards inteiros
```html
<div className="form-card disabled">
  <div className="form-card-h">
    <span>Notificações</span>
    <span className="soon-tag">Em breve</span>
  </div>
  <p className="form-card-sub">Em breve você vai escolher por evento ...</p>
  {/* nada de conteúdo interativo aqui */}
</div>
```

`.form-card.disabled` → opacity 0.78, bg cinza muito sutil. Texto fica em `muted-foreground`. `.soon-tag` é um pill mono cinza compacto.

### Aplicação em linhas individuais (security-row, etc.)
```html
<div className="security-row disabled">
  <div className="ic"><Shield/></div>
  <div className="body">
    <div className="nm">Verificação em 2 etapas <span className="soon-tag">Em breve</span></div>
    <div className="meta">Estamos finalizando ...</div>
  </div>
  <button className="switch" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}></button>
</div>
```

### Em catálogos (drawer de catálogo de tools, channels)
- Item da lista vira `disabled` (`opacity: 0.55`, cursor not-allowed)
- Adiciona `<span className="soon-tag">Em breve</span>` ao lado do nome
- Não dispara o `onClick` (o handler já checa `available` ou `soon`)

### Onde aplicar
- Profile section: Alterar foto, 2FA, Sessões, Notificações, Preferências (todas em breve no MVP)
- Tool catalog: tudo exceto Gmail (no MVP)
- Channel catalog: tudo exceto Telegram (no MVP)

### Regra
Use **Em breve** quando a feature está roadmap. Não use pra coisas que não vão existir nunca — essas você remove.

---

## 7. Ícones — padronização rígida

| Ação | Ícone (Lucide) |
|---|---|
| **Editar** qualquer item (tool, channel, webhook, pipeline, etc.) | `Edit2` (lápis) |
| Excluir / Remover | `Trash2` |
| Configurações de sistema (engrenagem) | `Settings` — **só em links "Gerenciar X" globais** |
| Copiar pra área de transferência | `Copy` |
| Mais opções (menu de contexto) | `MoreHorizontal` |
| Expand/Collapse | `ChevronDown` / `ChevronRight` (rotaciona pra `Down`) |
| Voltar (drawer aninhado) | `ArrowLeft` |
| Fechar (drawer/popup) | `X` |
| Sub-agente (badge/avatar) | `GitBranch` |

> **Não troque ícone "edit" por "settings" em row buttons.** Editar uma ferramenta = `Edit2`, não `Settings`. Mantém consistência visual no app inteiro.

---

## 8. Pills (status + categóricos)

```css
.pill              /* base — sem cor, mono 10px */
.pill.success      /* verde — ativo, online */
.pill.warn         /* âmbar — rascunho, pendente */
.pill.muted        /* cinza — inativo, sem canal */
.pill.danger       /* vermelho — destructive */
.pill.teal         /* categórica — WhatsApp */
.pill.orange       /* categórica — lead hot */
.pill.purple       /* categórica — sub-agente, premium, jornada */
.pill.dot::before  /* adiciona dot colorido antes do texto */
```

**Regra**: pills com `success/warn/danger` carregam significado semântico. Categóricas (teal/orange/purple) **NÃO** carregam — usar só pra distinguir tipos.

`soon-tag` é mais discreto que pill — mono cinza, padding mínimo. Use pra Em breve.

---

## 9. CTA hierarchy

```html
<button className="btn btn-primary">Salvar</button>      <!-- 1 por tela -->
<button className="btn btn-outline">Cancelar</button>     <!-- secundária -->
<button className="btn btn-ghost">Histórico</button>      <!-- terciária, sem chrome -->
```

Variantes de tamanho: `btn-sm`, `btn-md` (default), `btn-lg`.

`text-transform: none` está aplicado no `.btn` base. Não use uppercase em CTAs.

**Copywriting de CTA**:
- Use verbos diretos: "Salvar", "Publicar", "Adicionar", "Remover"
- **NÃO** use: "Análise automática", "Salvar configuração" (genérico)
- Botões que não fazem nada → **removidos**, não estilizados como disabled

---

## 10. Form fields

```html
<div className="field">
  <label>Nome do campo</label>
  <input value={...}/>
  {hint && <span className="field-hint">{hint}</span>}
  {error && <span className="field-error">{error}</span>}
</div>
```

- Label: 11px mono, uppercase, letter-spacing 0.06em, color muted
- Input: altura 38px, border 1px, radius `--r-md`, padding 0 12px
- Focus: border vira `--color-primary`, sem outline
- `.field-hint`: 11px muted abaixo do input
- `.field-error`: 11.5px destructive, aparece com `.field.has-error`
- Required: adicione `<span className="req">*</span>` no label

Label desacoplada (acima de grupo, ex: role-cards):
```html
<label className="field-label-detached">Papel no espaço</label>
<div className="role-cards">...</div>
```

---

## 11. Menu de contexto (3-pontos)

Pra ações secundárias num item de lista (usuário, lead, etc.), use popover com items. **NÃO use modal**.

```html
<div className="user-menu-wrap" ref={ref}>
  <button className="ibtn" onClick={toggle}><MoreHorizontal/></button>
  {open && (
    <div className="user-menu" role="menu">
      <button className="user-menu-item">
        <Shield size={13}/> Trocar papel
        <span className="curr">{currentValue}</span>
        <ChevronDown size={12}/>
      </button>
      <button className="user-menu-item">
        <Send size={13}/> Reenviar convite
      </button>
      <button className="user-menu-item destructive">
        <Trash2 size={13}/> Remover
      </button>
    </div>
  )}
</div>
```

- Posição: absolute right: 0, top: calc(100% + 4px)
- Fecha com click outside + ESC
- Items destrutivos: classe `destructive` (vermelho)
- Sub-menus inline (não popovers em cascata): usar `.user-menu-sub` debaixo do item

---

## 12. Sidebar profile menu (`.sb-foot`)

`.sb-foot` (rodapé da sidebar com FP + Fabiano + Proprietário) é clickável. Abre popover **ACIMA** (porque tá no rodapé) com hot-links:

```
┌────────────────────┐
│ 👤 Meu perfil      │ → vai pra Configurações > Meu perfil
│ ❓ Ajuda           │ → toast / abriria help
│ ─────────────────  │
│ ⤴ Sair             │ → signout (destrutivo)
└────────────────────┘
┌─ FP Fabiano · Prop ▾
└────────────────────┘
```

Hot-links em vez de duplicar funcionalidades que já existem no app:
- Não inclua "Notificações" aqui (já está no topbar)
- Não inclua "Trocar tema" aqui (toggle já no topbar)
- Toda "configuração de usuário" delega pra Configurações > Meu perfil

Pra navegação cross-component (clicar Perfil aqui leva pra Configurações), use o event bus do main.jsx:
```js
window.dispatchEvent(new CustomEvent("hub:nav-config", { detail: { sub: "profile" } }));
```
`SettingsShell` escuta e troca o active.

---

## 13. Cards (lista de agentes — pode reusar)

### Grid card (`acard`)
- Status pill no canto sup direito
- Head: avatar + nome + descrição
- Meta: chips em linha (canal, ferramentas, KB)
- Vitals: 3 colunas com label uppercase + valor (configuração do agente, não métricas)
- Footer: ações + switch on/off

### Row card (`arow`)
- Grid horizontal: avatar | nome+desc | status | meta | vitals | ações
- Em mobile, esconde meta + vitals

**Toggle entre grid/row**: componente `.view-toggle` (List ↔ LayoutGrid)

### Variante sub-agente
- `.acard.sub` / `.arow.sub`: tint purple no card + avatar GitBranch (em vez de Bot) com bg purple-bg
- Badge `<span className="pill purple dot">Sub-agente</span>` no canto
- Pill "Chamado por N agentes" em vez do canal

---

## 14. Hero pattern (topo de toda página principal)

Estrutura compacta, padrão em **toda página** que tem conteúdo principal (Agentes, Configurações, etc.):

```html
<div className="list-hero">
  <div>
    <div className="eyebrow">Simplafy Hub · {Página}</div>
    <h1>Frase de impacto com <span className="mark">palavra-chave</span> destacada.</h1>
    <p>Parágrafo de intro explicando o que faz aqui (2-3 linhas, max 640px).</p>
  </div>
  <div className="h-actions">
    {/* CTAs principais opcionais */}
  </div>
</div>
```

### Dimensões (compactas — Fase 5)
- Padding: `22px 32px 18px`
- H1: 38px, font-display-brand, weight 800
- `.mark`: cor `--accent-vivid` (verde brand)
- Eyebrow: 11px mono uppercase, color accent-vivid
- p: 13.5px muted, max-width 640px, line-height 1.45
- Border-bottom 1px

### Ambient glow (dark theme)
Já no CSS — não precisa fazer nada.

### Quando o hero é compacto demais
Em telas de **Settings** que têm hero + sub-sidebar + content, o hero é o mesmo (compacto). Não invente versões.

### Em modo Editor (ed-tb)
Editor de agente NÃO usa hero — usa `.ed-tb` (topbar customizado com back + nome + Salvar).

### Telas operacionais — sem hero
Algumas telas são **ferramentas de uso contínuo**, não páginas de navegação. Nelas o hero tira espaço crítico e não educa nada que o usuário já não saiba. **Sem hero**:

- **Chat** — 3 colunas densas, cada 100px conta
- **CRM (Kanban view)** — colunas verticais precisam de altura
- **Jornadas (flow editor)** — canvas precisa do viewport
- **Editor de Agente** — usa `.ed-tb` próprio (back + nome + Save)

**Com hero** (navegação/listagem):
- Agentes (lista), Configurações, Dashboard, Execuções, Vendedores, CRM (lista de leads), Jornadas (lista de jornadas)

---

## 15. Mobile (≤768px)

**Filosofia**: emular app nativo, não tentar redesenhar 1:1 do desktop.

- **Sidebar** → bottom tab bar fixa (64px, ícone empilhado com label, scroll horizontal pros 9 items)
- **Topbar** → logo Hub centralizado (mini) + avatar de perfil à direita (dropdown com Meu perfil / Ajuda / Trocar tema / Sair)
- **Editor** → single column, esconde TOC + Preview rail
- **Todos os grids** → 1 coluna
- **Drawers** → full screen (vars-drawer.wide vira 100% width)
- **Page transitions** → fade + slide-up 220ms
- **Toast** → posiciona acima da bottom tab bar (bottom: 76px)

Breakpoint extra ≤420px: ajustes finos (vitals empilhadas, labels menores).

---

## 16. Tipografia (do DS)

```
--font-display-brand  Causten    → hero H1/H2 (marca, marketing) — alias de --font-display
--font-display        Causten    → títulos de seção/produto (fallback Geist)
--font-sans           Geist      → corpo, UI, labels, inputs
--font-mono           Geist Mono → KPIs, IDs, código, datas, env names
```

> ⚠️ Modelo canônico (tokens.css v1.1.0): **Causten = marca, Geist = UI.**
> Não existe Sora nem Inter no DS — qualquer referência antiga a elas é
> obsoleta. `--font-display` resolve pra Causten; títulos densos de produto
> que devem ficar em Geist usam `--font-sans` (ou o alias `--font-display-app`
> que os kits expõem).

Tracking (de tokens.css §10):
- Display/hero: `--tracking-display` (-0.035em)
- H1/H2: `--tracking-h` (-0.02em)
- Botões/H3: `--tracking-tight` (-0.01em)
- Eyebrow uppercase: `--tracking-eyebrow` (+0.14em)
- Mono caps: `--tracking-mono` (+0.04em)

---

## 17. Cores (consume tokens.css v1.1.0)

**NUNCA** escreva hex inline. Use sempre:

```css
var(--color-primary)        /* CTAs, accents, active state */
var(--color-primary-bg)     /* fundo de accent suave */
var(--color-foreground)     /* texto principal */
var(--color-muted-foreground)  /* texto secundário */
var(--color-card)           /* fundo de card */
var(--color-background)     /* fundo da página */
var(--color-border)         /* bordas, dividers */
var(--color-success / warning / destructive)  /* semânticos */
var(--color-teal / blue / purple / orange)    /* categóricos */
var(--color-teal-bg / blue-bg / purple-bg / orange-bg / red-bg)  /* containers quiet */
```

Para "cor crua" (em situações onde precisa de raw color, ex: gradient):
```css
var(--green) var(--ink-1) var(--soft) ...
```

---

## 18. Anti-padrões (NÃO faça)

- ❌ **Popups / modais centrados** pra criar/editar/configurar. Sempre drawer direita.
- ❌ **`confirm()` nativo** pra deletes. Use optimistic + toast undo.
- ❌ **`alert()` em qualquer lugar.** Use `window.toast()`.
- ❌ **Ícone `Settings` (gear) em buttons de row.** Editar = `Edit2` (lápis).
- ❌ Métricas fake (CSAT, resolução) sem medir. Use config viva.
- ❌ Botões decorativos sem ação. Remova.
- ❌ Pill "Rascunho" — só temos Ativo/Inativo.
- ❌ Versionamento fake (v11 → v12). Só usar se publish gate for real.
- ❌ Workspace switcher como dropdown se não tem multi-conta. Use label simples ou nada.
- ❌ Dropdown que não abre nada. Se chevron, abre.
- ❌ Filtros que não filtram. Se botão "Filtros", abre painel.
- ❌ Cores hex inline. Sempre tokens.
- ❌ Sections com `<span className="meta">` decorativa. Se a info não importa, fora.
- ❌ Padding/raio chutado. Use `--radius-xs/-sm/-md/-lg/-xl/-pill` (tokens.css §7) e múltiplos de 4px. (No hub.css os aliases `--r-*` apontam pra essa mesma escala.)
- ❌ Inline `<input>` em row de catálogo — use drawer.
- ❌ Drawer aninhado SEM botão "voltar". Se A abriu B, B precisa de back.

---

## 19. Próximos vocabulários a estabelecer (Fases 2-4)

| Fase | Tela | Padrão novo a criar |
|---|---|---|
| 2 | Chat | Bolha de mensagem, painel de contato lateral, fila de conversas, atalhos rápidos |
| 3 | CRM | Kanban com swimlanes, lead-detail timeline, bulk-action toolbar |
| 4 | Dashboard | KPI card grande, chart wrapper, comparação período-a-período |
| 4 | Jornadas | Bloco de fluxo (trigger/action/wait/condition), conexão entre blocos |

Cada um adicionará 1-3 padrões novos ao kit. Quando isso acontecer, **documente aqui** + sincronize o kit com o DS.

---

## 20. Checklist pra nova tela

Antes de mergear uma tela nova:

- [ ] Hero compacto no topo (eyebrow + h1+mark + p)
- [ ] Todas as ações secundárias são **drawers** (não modais)
- [ ] Ícones seguem tabela seção 7 (Edit2, Trash2, Settings…)
- [ ] Deletes usam optimistic + toast undo (seção 5)
- [ ] Feedback de save/criação usa toast success (não alert)
- [ ] "Em breve" usa padrão da seção 6 (não esconder, não placeholder bobo)
- [ ] Drawer aninhado tem botão voltar (seção 4)
- [ ] Buttons sem `text-transform: uppercase` (já default no .btn)
- [ ] Sem hex inline. Sem confirm/alert nativo.
- [ ] Responsive testado em 768px e 420px

---

_Documento mantido em `PATTERNS.md` na raiz do projeto. Atualizado quando uma decisão é tomada e a UI já implementa._
