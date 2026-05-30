# Design System - Simplafy Saude Portal

## Visão Geral

Este documento descreve o design system do Portal Simplafy Saude, baseado em **Shadcn/UI** e **Radix UI primitives**. Todos os componentes seguem padrões de acessibilidade WCAG AA e utilizam variáveis CSS de tema.

## Princípios Fundamentais

### 1. Tema e Cores

**NUNCA use cores hardcoded**. Sempre utilize variáveis CSS de tema:

```tsx
// ❌ ERRADO - Cores hardcoded
<div className="text-blue-500 bg-green-100">

// ✅ CORRETO - Variáveis de tema
<div className="text-foreground bg-accent">
```

**Variáveis CSS Disponíveis:**

- `--background`: Cor de fundo principal
- `--foreground`: Cor de texto principal
- `--muted`: Cor atenuada para elementos secundários
- `--muted-foreground`: Texto em elementos atenuados
- `--accent`: Cor de destaque
- `--accent-foreground`: Texto em elementos de destaque
- `--primary`: Cor primária da marca
- `--primary-foreground`: Texto em elementos primários
- `--secondary`: Cor secundária
- `--secondary-foreground`: Texto em elementos secundários
- `--destructive`: Cor para ações destrutivas/erros
- `--destructive-foreground`: Texto em elementos destrutivos
- `--border`: Cor de bordas
- `--input`: Cor de bordas de input
- `--ring`: Cor do focus ring

### 2. Acessibilidade

- **Contraste Mínimo**: WCAG AA 4.5:1 para texto normal, 3:1 para texto grande
- **Navegação por Teclado**: Todos os componentes interativos devem ser acessíveis via teclado
- **Screen Readers**: Usar labels e aria-attributes apropriados
- **Focus Visible**: Indicação clara de foco em elementos interativos

### 3. Responsividade

- **Mobile-First**: Design prioritariamente para mobile
- **Breakpoints Tailwind**: `sm`, `md`, `lg`, `xl`, `2xl`
- **Flexbox/Grid**: Usar para layouts responsivos

## Componentes Shadcn/UI

### Badge

**Variantes Suportadas:**

- `default` - Badge padrão com cor primária
- `secondary` - Badge com cor secundária
- `destructive` - Badge para estados de erro/atenção
- `outline` - Badge com contorno

**Uso:**

```tsx
<Badge variant="default">Ativo</Badge>
<Badge variant="secondary">Inativo</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="outline">Rascunho</Badge>
```

### Button

**Variantes Suportadas:**

- `default` - Botão sólido primário
- `secondary` - Botão sólido secundário
- `destructive` - Botão para ações destrutivas
- `outline` - Botão com contorno
- `ghost` - Botão transparente
- `link` - Botão com estilo de link

**Tamanhos:**

- `default` - Tamanho padrão
- `sm` - Pequeno
- `lg` - Grande
- `icon` - Para ícones

**Uso:**

```tsx
<Button variant="default">Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="ghost">Fechar</Button>
```

### Card

**Componentes:**

- `Card` - Container principal
- `CardHeader` - Cabeçalho do card
- `CardTitle` - Título do card
- `CardDescription` - Descrição do card
- `CardContent` - Conteúdo do card
- `CardFooter` - Rodapé do card

**Uso:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo do card</CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Input

**Tipos Suportados:**

- `text` - Texto padrão
- `email` - Email
- `password` - Senha
- `number` - Número
- `date` - Data
- `file` - Arquivo

**Uso:**

```tsx
<Input type="text" placeholder="Nome" />
<Input type="email" placeholder="email@example.com" />
```

### Select

**Componentes:**

- `Select` - Container principal
- `SelectTrigger` - Botão que abre o dropdown
- `SelectValue` - Valor selecionado
- `SelectContent` - Container do conteúdo
- `SelectItem` - Item individual

**Uso:**

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder='Selecione uma opção' />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value='option1'>Opção 1</SelectItem>
    <SelectItem value='option2'>Opção 2</SelectItem>
  </SelectContent>
</Select>
```

### Switch

**Estados:**

- `checked` - Ligado/Desligado
- `disabled` - Desabilitado

**Uso:**

```tsx
<Switch checked={isEnabled} onCheckedChange={setIsEnabled} disabled={false} />
```

### Alert

**Variantes Suportadas:**

- `default` - Alert padrão informativo
- `destructive` - Alert de erro/atenção

**Componentes:**

- `Alert` - Container principal
- `AlertTitle` - Título do alert
- `AlertDescription` - Descrição do alert

**Uso:**

```tsx
<Alert variant='destructive'>
  <AlertCircle className='h-4 w-4' />
  <AlertTitle>Erro</AlertTitle>
  <AlertDescription>Descrição do erro</AlertDescription>
</Alert>
```

### Dialog/Modal

**Componentes:**

- `Dialog` - Container principal
- `DialogTrigger` - Elemento que abre o modal
- `DialogContent` - Conteúdo do modal
- `DialogHeader` - Cabeçalho
- `DialogTitle` - Título
- `DialogDescription` - Descrição
- `DialogFooter` - Rodapé

**Uso:**

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Fechar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tabs

**Componentes:**

- `Tabs` - Container principal
- `TabsList` - Lista de abas
- `TabsTrigger` - Botão de aba individual
- `TabsContent` - Conteúdo de cada aba

**Uso:**

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value='tab1'>Aba 1</TabsTrigger>
    <TabsTrigger value='tab2'>Aba 2</TabsTrigger>
  </TabsList>
  <TabsContent value='tab1'>Conteúdo 1</TabsContent>
  <TabsContent value='tab2'>Conteúdo 2</TabsContent>
</Tabs>
```

### Toast/Notifications

**Provider:** Usar `Sonner` (não `react-hot-toast`)

**Uso:**

```tsx
import { toast } from 'sonner';

// Success
toast.success('Operação realizada com sucesso');

// Error
toast.error('Erro ao processar operação');

// Info
toast.info('Informação importante');

// Warning
toast.warning('Atenção necessária');
```

## Padrões de Estilização

### Spacing

Usar classes Tailwind de spacing com variáveis de tema:

```tsx
// Padding/Margin
className = 'p-4 px-6 py-2'; // Padding
className = 'm-4 mx-auto'; // Margin

// Gap (Flexbox/Grid)
className = 'gap-4 gap-x-2 gap-y-4';
```

### Typography

```tsx
// Tamanhos de texto
className = 'text-xs text-sm text-base text-lg text-xl text-2xl';

// Pesos de fonte
className = 'font-normal font-medium font-semibold font-bold';

// Cores de texto (usar variáveis de tema)
className = 'text-foreground text-muted-foreground text-destructive';
```

### Borders e Radius

```tsx
// Bordas
className = 'border border-border border-t-0';

// Border radius
className = 'rounded rounded-md rounded-lg rounded-full';
```

### Shadows

```tsx
className = 'shadow-sm shadow shadow-md shadow-lg';
```

## Boas Práticas

### DO ✅

```tsx
// Usar variáveis de tema
<div className="bg-background text-foreground border-border">

// Componentes Shadcn/UI para UI consistente
<Button variant="secondary">Cancelar</Button>

// Acessibilidade
<button aria-label="Fechar" onClick={onClose}>

// Mobile-first responsivo
<div className="flex flex-col md:flex-row">
```

### DON'T ❌

```tsx
// Cores hardcoded
<div className="bg-blue-500 text-green-700">

// Variantes inválidas
<Badge variant="primary"> // ❌ não existe 'primary', usar 'default'

// Sem acessibilidade
<div onClick={onClick}> // ❌ usar <button>

// CSS inline
<div style={{ color: '#3b82f6' }}> // ❌ usar classes Tailwind
```

## Adicionar Novos Componentes Shadcn/UI

```bash
# Adicionar componente
npx shadcn@latest add [component-name]

# Exemplo
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

## Referências

- **Shadcn/UI**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## Atualização

**Última atualização**: 2025-09-30
**Versão**: 1.0
**Autor**: James (Developer)
