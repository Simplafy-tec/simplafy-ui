# Como aplicar este sync no projeto "Simplafy Design System"

> Este pacote contém arquivos prontos pra serem copiados pro projeto **Simplafy Design System** (o "DEFAULT" publicado, criado por Fabiano em 20/04/2026).
>
> Cross-project é read-only no meu lado — eu não consigo escrever lá direto. Você (ou qualquer pessoa com acesso ao DS) faz o sync abrindo o DS em outra aba e arrastando estes arquivos pra dentro, mantendo as pastas exatamente como estão aqui.

---

## Contexto

O agente do site já enviou o pacote dele que **cria** a estrutura nova
(`tokens.css` na raiz, `ui_kits/_index.md`, `ui_kits/site/`).

Este pacote complementa: enche o `ui_kits/hub/` com os componentes do
SaaS — sem sobrescrever o mock antigo que já existe lá.

**Pré-requisito:** o sync do agente do site (`tokens.css` na raiz) deve
ter sido aplicado antes deste. Sem `tokens.css` na raiz, o `hub.css`
quebra na importação.

---

## Arquivos novos a colar (3 arquivos)

```
Simplafy Design System (projeto)
└── ui_kits/
    └── hub/                            ← pasta já existe (tem index.html antigo)
        ├── hub.css                     ← NOVO
        ├── showroom.html               ← NOVO
        ├── README.md                   ← SUBSTITUI o atual (que descreve mock antigo)
        │
        └── index.html                  ← mock antigo da Hub v2; deixar
                                          alongside (ou mover pra _legacy/)
```

**Importante:**
- `hub.css` e `showroom.html` são arquivos NOVOS — não tem conflito.
- `README.md` SUBSTITUI o atual (que tem 16 linhas descrevendo um mock).
  Se quiser preservar o legado, renomeie o atual pra `README.legacy.md`
  antes de colar o novo.
- O `index.html` antigo **não é tocado** — ele descreve um mock de
  dashboard Hub v2 que ainda pode servir de referência. O novo
  showroom é `showroom.html`.

---

## Passo a passo

1. **Confirme** que o sync do agente do site já foi aplicado:
   - `<DS>/tokens.css` existe na raiz
   - `<DS>/ui_kits/_index.md` existe
   - `<DS>/ui_kits/site/` existe

   Se não foi, aplique aquele primeiro.

2. **Abra o DS em outra aba** ("Simplafy Design System · DEFAULT")

3. **Renomeie** (opcional, recomendado) o `ui_kits/hub/README.md`
   atual pra `ui_kits/hub/README.legacy.md` — pra preservar a descrição
   do mock v2.

4. **Copie 3 arquivos** pra `ui_kits/hub/`:
   - `_sync-to-ds/ui_kits/hub/hub.css`
   - `_sync-to-ds/ui_kits/hub/showroom.html`
   - `_sync-to-ds/ui_kits/hub/README.md`

5. **Verifique** abrindo `<DS>/ui_kits/hub/showroom.html` num browser:
   - Cores carregam (não devem aparecer `transparent`)
   - Fonte Causten/Geist aparecem
   - Tecla `T` alterna tema
   - Score widget aparece com ring verde no topo da seção Display

---

## Estrutura final esperada (depois do sync)

```
Simplafy Design System
├── tokens.css                        ← do sync do site
├── fonts/
├── logos/
├── colors_and_type.css               ← deprecated (do site, mantido pra back-compat)
├── globals.css                       ← legado
├── CLAUDE.md
├── README.md
│
└── ui_kits/
    ├── _index.md                     ← do sync do site
    │
    ├── site/                         ← do sync do site
    │   ├── README.md
    │   ├── site.css
    │   └── index.html
    │
    ├── hub/
    │   ├── README.md                 ← deste sync (substitui o antigo)
    │   ├── README.legacy.md          ← opcional (renomeação do antigo)
    │   ├── hub.css                   ← deste sync
    │   ├── showroom.html             ← deste sync
    │   └── index.html                ← legado (mock dashboard v2)
    │
    ├── saude/                        ← intacto
    └── seguros/                      ← intacto
```

---

## Verificação visual

Depois de aplicar, abra os 3 showrooms lado a lado:

- `<DS>/ui_kits/site/index.html` — vocabulário marketing
- `<DS>/ui_kits/hub/showroom.html` — vocabulário SaaS (este sync)
- `<DS>/ui_kits/hub/index.html` — mock legado v2

Os 3 devem usar **as mesmas cores e fontes** (vindas do `tokens.css`),
mas com **tom e densidade diferentes** (site é arejado, hub é denso).

Se houver divergência de cor ou tipo entre site e hub, é bug —
algum kit hardcodou em vez de consumir token. Reportar.

---

## Versionamento

| Componente | Versão | Depende de |
|---|---|---|
| `tokens.css` (raiz) | 1.0.0 | — |
| `ui_kits/site/site.css` | 1.0.0 | tokens 1.x |
| `ui_kits/hub/hub.css` | 0.2.0 | tokens 1.x |

`ui_kits/hub/hub.css` está em **0.2.x** porque ainda há componentes
pendentes de extração (tables, sheets, full chat surface da Fase 2). A
1.0 sai quando todos os componentes do produto estiverem aqui.

---

## Próximos kits

Depois deste sync, os kits faltantes são:

- `ui_kits/saude/` — portal clínico (placeholder hoje)
- `ui_kits/seguros/` — broker (placeholder hoje)

Ambos vão nascer já consumindo `tokens.css` — não precisam recriar
primitivos.

---

_Gerado em "Simplafy - Tela Agente" durante a remodelagem Fase 1 do Hub — 19/05/2026._
