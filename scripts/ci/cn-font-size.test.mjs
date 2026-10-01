/*
 * `cn()` entende os tamanhos de fonte nomeados do Hub (`text-compact`, `text-md`, ...) como TAMANHO, não como cor.
 * Teste de COMPORTAMENTO (roda o tailwind-merge de verdade com a mesma config do `cn`). Prova invertida: sem a config,
 * `cn('text-compact', 'text-foreground')` devolve só `text-foreground` — o primeiro caso abaixo fica vermelho.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extendTailwindMerge, twMerge as padrao } from 'tailwind-merge';
import { tailwindMergeConfig } from '../../src/lib/tailwind-merge-config.mjs';

const twMerge = extendTailwindMerge(tailwindMergeConfig);

test('o tamanho nomeado sobrevive à cor que vem junto (era descartado)', () => {
  for (const tam of ['text-compact', 'text-md', 'text-2xs', 'text-3xs', 'text-micro', 'text-panel-title']) {
    assert.equal(twMerge(`${tam} text-sidebar-foreground`), `${tam} text-sidebar-foreground`);
    assert.equal(twMerge(`${tam} text-muted-foreground`), `${tam} text-muted-foreground`);
  }
});

test('sem a config, o tailwind-merge puro descarta o tamanho (é o defeito que a config corrige)', () => {
  assert.equal(padrao('text-compact text-sidebar-foreground'), 'text-sidebar-foreground');
});

test('dois tamanhos entre si: o último vence, nomeado ou padrão', () => {
  assert.equal(twMerge('text-sm text-compact'), 'text-compact');
  assert.equal(twMerge('text-compact text-sm'), 'text-sm');
  assert.equal(twMerge('text-micro text-3xs'), 'text-3xs');
});

test('duas cores continuam se sobrepondo e não derrubam o tamanho', () => {
  assert.equal(twMerge('text-compact text-foreground text-primary'), 'text-compact text-primary');
});

test('o cn() usa a config (utils.ts importa o mesmo módulo)', () => {
  const utils = readFileSync(new URL('../../src/lib/utils.ts', import.meta.url), 'utf8');
  assert.match(utils, /extendTailwindMerge\(tailwindMergeConfig\)/);
  assert.match(utils, /from '\.\/tailwind-merge-config\.mjs'/);
});
