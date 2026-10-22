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

test('Button default = 34px / padding 14 / 13px; sm = 28px / padding 10 / 12.5px (desktop não muda)', () => {
  assert.match(button, /default: `min-h-\[34px\] px-\[14px\] \$\{TOQUE_40\}`/);
  assert.match(button, /sm: `min-h-7 rounded-xs px-2\.5 text-\[12\.5px\]/);
  assert.match(button, /text-\[13px\]/);
});

/*
 * Toque (Platform#2.1.1.12): < 768px ou `pointer: coarse` → default e sm com área de 40×40; o desktop (34/28) fica como
 * está porque a regra só vale atrás dos modificadores. Teste de FONTE (o pacote não tem renderizador). Prova invertida:
 * tirar `max-md:`/`pointer:coarse` de TOQUE_40, ou tirar o TOQUE_40 do default/sm, deixa estes testes vermelhos.
 */
const toque = (button.match(/const TOQUE_40 = '([^']+)'/) ?? [])[1] ?? '';

test('TOQUE_40: 40×40 em tela estreita (max-md) e em ponteiro grosso (pointer: coarse)', () => {
  for (const c of ['max-md:min-h-10', 'max-md:min-w-10', '[@media(pointer:coarse)]:min-h-10', '[@media(pointer:coarse)]:min-w-10'])
    assert.ok(toque.split(' ').includes(c), `TOQUE_40 sem ${c}`);
});

test('default e sm usam TOQUE_40; lg e icon não precisam (44 e 40 já cumprem)', () => {
  assert.match(button, /default: `[^`]*\$\{TOQUE_40\}`/);
  assert.match(button, /sm: `[^`]*\$\{TOQUE_40\}`/);
  assert.doesNotMatch(button, /lg: [^\n]*TOQUE_40/);
  assert.doesNotMatch(button, /icon: [^\n]*TOQUE_40/);
});

test('desktop intacto: nenhum min-h-10/min-w-10 SEM modificador em default e sm', () => {
  const linhas = button.split('\n').filter((l) => /^\s*(default|sm): `/.test(l));
  assert.equal(linhas.length, 2);
  for (const l of linhas) assert.doesNotMatch(l.replace(/\$\{TOQUE_40\}/, ''), /(?<![-\w:\]])min-[hw]-10/);
  assert.doesNotMatch(toque.replace(/(max-md|\[@media\(pointer:coarse\)\]):min-[hw]-10/g, ''), /min-[hw]-10/);
});

test('link zera a altura/largura de toque também (modificador diferente não é desfeito por min-h-0 puro)', () => {
  assert.match(button, /variant: 'link',[\s\S]*max-md:min-h-0 max-md:min-w-0 \[@media\(pointer:coarse\)\]:min-h-0 \[@media\(pointer:coarse\)\]:min-w-0/);
});

test('Button primário é sólido (sem gradiente) com hover do token', () => {
  assert.doesNotMatch(button, /linear-gradient/);
  assert.match(button, /bg-primary text-primary-foreground/);
  assert.match(button, /hover:bg-primary-hover/);
});

test('altura é MÍNIMA (min-h), nunca fixa (h-[34px]/h-7)', () => {
  assert.doesNotMatch(button, /(?<![-\w])h-\[34px\]|(?<![-\w])h-7(?![-\w])/);
});

test('link some com altura, largura e padding de botão em qualquer size (size-auto)', () => {
  assert.match(button, /variant: 'link',[\s\S]*?'[^']*\bsize-auto\b[^']*\bmin-h-0\b[^']*\bmin-w-0\b[^']*\bpx-0\b/);
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
