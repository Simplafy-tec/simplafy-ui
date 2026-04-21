# Simplafy UI — Guia de Componentes

## Regras de Ouro

- **NUNCA** criar componente em `apps/web` se equivalente existe em `@simplafy/ui`
- **NUNCA** hardcodar cor — usar tokens (`bg-primary`, `text-muted-foreground`, `border-border`, etc.)
- **NUNCA** hardcodar radius — usar `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl`
- **NUNCA** hardcodar font — usar `font-sans` (Geist) ou `font-display` (Geist, heavier)
- **Ícones:** SEMPRE `lucide-react` — NÃO importar outro icon pack
- **Altura inputs:** 40px (`Input`) ou 34px (`Select`) — NÃO alterar

---

## Tabela de Decisão

| Preciso de... | Usar | NÃO usar |
|---|---|---|
| Botão de ação | `<Button variant="...">` | `<button>` nativo |
| Status/tag | `<Badge variant="success">` | `<span>` custom |
| Toggle on/off | `<Switch>` | checkbox styled |
| Tabela | `<Table>` | `<div>` grid |
| Input texto | `<Input>` | `<input>` nativo |
| Dropdown | `<Select>` | `<select>` nativo |
| Modal | `<Dialog>` | portal custom |
| Painel lateral | `<Sheet>` | div absolute |
| Abas | `<Tabs>` | div + state |
| Menu contexto | `<DropdownMenu>` | div absolute |
| Command palette | `<Command>` | input + lista |
| Loading | `<Skeleton>` | spinner custom |
| KPI | `<MetricCard>` | Card manual |
| Gráfico barras | `<SimpleBarChart>` | recharts direto |
| Gráfico linhas | `<SimpleLineChart>` | recharts direto |
| Texto longo | `<Textarea>` | `<textarea>` nativo |
| Checkbox | `<Checkbox>` | `<input type="checkbox">` nativo |
| Avatar | `<Avatar>` | `<img>` com classes |
| Tooltip | `<Tooltip>` | `title=""` nativo |
| Progresso | `<Progress>` | div com width custom |
| Scroll área | `<ScrollArea>` | `overflow-y: auto` direto |
| Popover | `<Popover>` | div absolute/fixed |
| Separador | `<Separator>` | `<hr>` nativo |
| Card container | `<Card>` | `<div>` com shadow manual |
| Label formulário | `<Label>` | `<label>` nativo |
| Tooltip chart | `<ChartTooltip>` | tooltip recharts direto |

---

## Badge Variants — Usar Correto

| Semântica | Variant | Exemplo |
|---|---|---|
| Ativo / Sucesso | `success` | Status ativo, pipeline Convertido |
| Alerta / Pendente | `warning` | Aguardando, temperatura Morno |
| Erro / Danger | `destructive` | Erro, Expirado |
| Inativo / Neutro | `secondary` | Desabilitado, Inativo |
| Info / Em progresso | `teal` | Em andamento, Canal WhatsApp |
| Tipo / Sistema | `blue` | Tipo Agente, Canal Email |
| Destaque / Premium | `purple` | Tipo Jornada, Premium |
| Urgente / Quente | `orange` | Lead Hot, Expiração próxima |
| Tags / Neutros | `outline` | Labels, categorias |
| Padrão | `default` | Contexto genérico |

**Regra:** NÃO criar variantes novas. Mapear semântica da UI em uma das variantes acima.

### Status Lifecycle Mapping
```
ativo / convertido / sucesso → success
pendente / aguardando / morno → warning
erro / expirado / cancelado → destructive
inativo / desabilitado → secondary
em_progresso / whatsapp → teal
tipo_agente / email → blue
jornada / premium → purple
hot / urgente → orange
```

---

## Padrões de Composição

### Card com Ações
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Título</CardTitle>
    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
  </CardHeader>
  <CardContent>conteúdo</CardContent>
  <CardFooter className="gap-2">
    <Button variant="outline">Cancelar</Button>
    <Button>Salvar</Button>
  </CardFooter>
</Card>
```

### Form Field
```tsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor="name">Nome</Label>
  <Input id="name" placeholder="Digite o nome" />
  {error && <p className="text-xs text-destructive">{error}</p>}
</div>
```

### Tabela com Badges e Ações
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Status</TableHead>
      <TableHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.active ? "success" : "secondary"}>
            {item.active ? "Ativo" : "Inativo"}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Painel Lateral (Sheet)
```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[480px] sm:max-w-[480px]">
    <SheetHeader>
      <SheetTitle>Título</SheetTitle>
    </SheetHeader>
    <div className="mt-4">conteúdo</div>
  </SheetContent>
</Sheet>
```

### Loading Skeleton
```tsx
<div className="flex flex-col gap-3">
  <Skeleton className="h-6 w-48" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

---

## Button Variants

| Variant | Uso |
|---|---|
| `default` | Ação primária (fundo verde gradiente) |
| `outline` | Ação secundária, cancelar |
| `ghost` | Ação terciária, ícone em tabela |
| `destructive` | Excluir, ação irreversível |
| `link` | Link inline no texto |

**Sizes:** `default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (h-9 w-9)

---

## Tokens de Design

Definidos em `packages/ui/src/globals.css` (bloco `@theme`):

| Token | Uso |
|---|---|
| `bg-primary` / `text-primary` | Verde Simplafy (#22C55E) |
| `bg-card` / `text-card-foreground` | Superfície de card |
| `bg-muted` / `text-muted-foreground` | Fundo sutil / texto secundário |
| `bg-destructive` / `text-destructive` | Erros e ações perigosas |
| `border-border` | Bordas padrão |
| `font-sans` | Geist (body) |
| `font-display` | Geist 600/700 (headings) |
| `bg-teal` / `bg-blue` / `bg-purple` / `bg-orange` | Semântica de badges |
| `bg-success` / `bg-warning` | Status positivo / alerta |

---

## Storybook

```bash
pnpm --filter @simplafy/ui storybook
# Abre em localhost:6006
```

Use para inspecionar variantes de componentes antes de implementar.

---

## Onde Criar Componentes Novos

| Componente é... | Onde criar |
|---|---|
| Reutilizável entre módulos ou apps | `packages/ui/src/components/` → exportar em `index.ts` |
| Específico de uma página/módulo | `apps/web/src/app/(app)/<modulo>/components/` |
| Layout estrutural (sidebar, topbar) | `apps/web/src/components/` |

**Fluxo:** Verificar `packages/ui/` → se não existe e é reutilizável → criar em `packages/ui/` → importar via `@simplafy/ui`.
