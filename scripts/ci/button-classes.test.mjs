/*
 * Contrato de classes do Button e do TabsList (Platform#2.1.1.10).
 *
 * Teste de FONTE: lê `src/components/button.tsx` / `tabs.tsx` como texto, sem renderizar
 * (o pacote não tem renderizador de teste). Tranca o que a story pediu e o que o review achou:
 * altura/padding/fonte do protótipo (`hub.css:652/:695`), primário sólido, `link` sem altura,
 * largura nem padding de botão (inclusive com size="icon"), e a variante segmentada exportada.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const button = readFileSync(new URL('../../src/components/button.tsx', import.meta.url), 'utf8');
const tabs = readFileSync(new URL('../../src/components/tabs.tsx', import.meta.url), 'utf8');
const index = readFileSync(new URL('../../src/index.ts', import.meta.url), 'utf8');

test('Button default = 34px / padding 14 / 13px; sm = 28px / padding 10 / 12.5px', () => {
  assert.match(button, /default: 'min-h-\[34px\] px-\[14px\]'/);
  assert.match(button, /sm: 'min-h-7 rounded-xs px-2\.5 text-\[12\.5px\]/);
  assert.match(button, /text-\[13px\]/);
});

test('Button primário é sólido (sem gradiente) com hover do token', () => {
  assert.doesNotMatch(button, /linear-gradient/);
  assert.match(button, /bg-primary text-primary-foreground/);
  assert.match(button, /hover:bg-primary-hover/);
});

test('altura é MÍNIMA (min-h), nunca fixa (h-[34px]/h-7)', () => {
  assert.doesNotMatch(button, /\bh-\[34px\]|\bh-7\b/);
});

test('link some com altura, largura e padding de botão em qualquer size (size-auto)', () => {
  assert.match(button, /variant: 'link', className: '[^']*\bsize-auto\b[^']*\bmin-h-0\b[^']*\bmin-w-0\b[^']*\bpx-0\b/);
});

test('lg (44px) e icon (40×40) não mudaram', () => {
  assert.match(button, /lg: 'min-h-11 rounded-sm px-8 text-sm'/);
  assert.match(button, /icon: 'size-10 min-h-10 min-w-10 shrink-0 rounded-xs px-0'/);
});

test('TabsList tem variante segmented e o tipo chega ao consumidor', () => {
  assert.match(tabs, /variant\?: TabsListVariant/);
  assert.match(tabs, /"underline" \| "segmented"/);
  assert.match(index, /export type \{ TabsListVariant \} from "\.\/components\/tabs"/);
});
