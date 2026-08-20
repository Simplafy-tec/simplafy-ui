import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const tokensPath = new URL('../../docs/design-system/tokens.css', import.meta.url);
const globalsPath = new URL('../../src/globals.css', import.meta.url);
const OLD_LIGHT = '#6b746f';
const OLD_DARK = '#8a948e';

function contrast(foreground, background) {
  const luminance = (hex) => {
    const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
    const linear = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };

  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function expectAssignments(css, assignments) {
  for (const [token, value] of Object.entries(assignments)) {
    assert.match(css, new RegExp(`${token}:\\s*${value};`, 'i'), `${token} deve apontar para ${value}`);
  }
}

function assertAccessible(foreground, surfaces) {
  for (const [surface, expected] of Object.entries(surfaces)) {
    const measured = Number(contrast(foreground, surface).toFixed(2));
    assert.equal(measured, expected, `${foreground} sobre ${surface}`);
    assert.ok(measured >= 4.5, `${foreground} sobre ${surface} deve passar AA`);
  }
}

test('tokens de conteúdo passam AA nas seis superfícies do sistema', () => {
  const css = readFileSync(tokensPath, 'utf8');
  const globals = readFileSync(globalsPath, 'utf8');
  expectAssignments(css, { '--fg-3': '#666e69', '--fg-on-dark-4': '#949e98' });
  assert.doesNotMatch(css, /--fg-3:\s*#6b746f;/i);
  assert.doesNotMatch(css, /--fg-on-dark-4:\s*#8a948e;/i);
  assert.match(globals, /--color-muted-foreground:\s*#666e69;/i);
  assert.match(globals, /\.dark\s*\{[\s\S]*?--color-muted-foreground:\s*#949e98;/i);

  // Ordem da PR: página, card, sidebar.
  assertAccessible('#666e69', { '#f0f3f1': 4.7, '#ffffff': 5.25, '#f5f7f4': 4.87 });
  assertAccessible('#949e98', { '#0b1b18': 6.42, '#14322c': 4.99, '#0d201d': 6.12 });
});

test('prova invertida: os valores antigos reprovam o contrato AA', () => {
  assert.throws(() => assertAccessible(OLD_LIGHT, { '#f5f7f4': 4.87 }));
  assert.throws(() => assertAccessible(OLD_DARK, { '#14322c': 4.99 }));
});
