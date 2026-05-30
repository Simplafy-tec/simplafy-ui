# Simplafy Seguros — o que levar pro Hub v2

> O módulo Seguros **vai morrer** como app independente e ser absorvido pelo Hub v2 (ADR-001 v8). Este doc captura o que vale a pena migrar. Quando o Hub v2 absorver, o `index.html` daqui pode ser deletado.

## Padrões de domínio a preservar

### 1. Kanban de pipeline comercial
5 estágios verticais: **Novo → Contato → Cotação → Negociação → Fechado**.
Cards de lead com:
- Nome (PF ou nome fantasia PJ)
- Tipo linha 2: "Pessoa física" | "Empresarial · CNPJ"
- Badge de produto: Auto, Vida, Patrimonial, Frota, Auto frota
- Badge opcional: "Hot" (orange) p/ lead quente, "Pendente" (warning), "Convertido" (success)
- Valor à direita em `font-mono` (ex: R$ 8.4k)
- Border-color: success quando Fechado

### 2. KPI strip do pipeline
4 cards horizontais:
- Leads no mês (#)
- Em negociação (R$)
- Fechados (R$)
- Taxa conversão (%)

### 3. Navegação por domínio de seguros
Sidebar agrupada em 4 seções:
- **Vendas** — Pipeline · Leads · Cotações · Apólices
- **Carteira** — Clientes · Renovações · Sinistros
- **Integrações** — Seguradoras · WhatsApp
- **Conta** — Configurações

### 4. Busca domain-aware
Placeholder: `Buscar lead, apólice, CPF/CNPJ…` (se houver busca global no Hub v2).

### 5. Toolbar de filtros
Row de selects + indicador "Atualizado há N min" à direita.

## O que descartar / atualizar ao migrar
- ❌ Topbar com sino + busca global → substituir pelo padrão Hub v2 (breadcrumb + perfil)
- ❌ Radius 10px fixo em botão → usar escala do DS (6/8)
- ❌ Cor teal pra WhatsApp → usar `--color-teal` token
- ❌ Sidebar com workspace switcher → Hub v2 é single-tenant
- ✅ Manter cards de lead em `--radius-lg` (10px) para diferenciação visual
- ✅ Manter `font-mono` em valores R$ (tabular nums)

## Destino no Hub v2
- Pipeline → módulo **CRM** (ou submódulo "Vendas Seguros")
- Apólices/Renovações/Sinistros → módulo **Seguros** (produto absorvido)
- Cotações → submódulo de Apólices
