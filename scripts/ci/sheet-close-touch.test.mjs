/*
 * X de fechar do SheetContent com alvo de toque de 40×40 (issue#3876; piso da casa = 40px).
 *
 * Teste de FONTE (o pacote não tem renderizador): lê `src/components/sheet.tsx` como texto. O ícone segue com 16px
 * (`h-4 w-4`) e fica no mesmo ponto: `right-1 top-1` (4px) + metade de `size-10` (20px) = `right-4 top-4` (16px) + metade
 * do ícone (8px) = 24px do canto. Prova invertida: voltar o botão para `right-4 top-4` sem `size-10`, tirar o centramento
 * ou tirar o foco visível deixa estes testes vermelhos.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sheet = readFileSync(new URL('../../src/components/sheet.tsx', import.meta.url), 'utf8');
const close = (sheet.match(/<SheetPrimitive\.Close className="([^"]+)"/) ?? [])[1] ?? '';
const classes = close.split(/\s+/);

test('X de fechar do Sheet tem alvo de 40×40 (size-10)', () => {
  assert.ok(close, 'botão de fechar do SheetContent não encontrado');
  assert.ok(classes.includes('size-10'), `sem size-10: ${close}`);
});

test('ícone continua no mesmo ponto: right-1 top-1 com o botão centrado, ícone de 16px', () => {
  for (const c of ['right-1', 'top-1', 'inline-flex', 'items-center', 'justify-center']) assert.ok(classes.includes(c), `sem ${c}`);
  assert.ok(!classes.includes('right-4') && !classes.includes('top-4'), 'right-4/top-4 deslocariam o ícone com o alvo de 40px');
  assert.match(sheet, /<X className="h-4 w-4" \/>/);
});

test('foco visível e rótulo acessível continuam', () => {
  assert.ok(classes.includes('focus-visible:ring-[3px]'));
  assert.ok(classes.includes('focus-visible:outline-none'));
  assert.match(sheet, /<span className="sr-only">Fechar<\/span>/);
});
