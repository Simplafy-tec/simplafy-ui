/*
 * Guarda de contraste dos tokens de texto do Design System.
 *
 * Por que existe: os dois defeitos que este teste tranca nasceram do MESMO erro
 * de método — calibrar uma cor contra UMA superfície e presumir as outras.
 *   - `--fg-3` foi calibrado contra branco puro (4.82) e ficou em 4.48 sobre
 *     `--soft`, a superfície recuada em que o texto secundário mais aparece.
 *   - `--fg-on-dark-4` foi calibrado contra `--ink-1` (5.66) e ficou em 4.41
 *     sobre `--ink-3`, que é o card — de novo, onde o texto mais aparece.
 *   - `--color-destructive` no escuro passava sobre a página (4.96) e dava 3.86
 *     sobre o card. Como o escuro é o tema default do Hub, essa era a cor de
 *     toda mensagem de erro do produto.
 *
 * Então a regra deste arquivo é uma só: TODA cor de texto é medida contra TODAS
 * as superfícies do seu tema, nos dois conjuntos de superfície que existem hoje
 * (as do próprio pacote, que Saúde e Site enxergam, e as da paleta ink, que o
 * Hub sobrescreve), e superfície translúcida é COMPOSTA antes de medir.
 *
 * ⚠️ A composição do alpha não é detalhe. `--color-muted` no escuro do Hub é
 * branco a 4% SOBRE o card, não branco puro. Medido como opaco, `#949e98` parece
 * passar (4.52 sobre o card); composto, dá 4.45 e reprova. Foi exatamente esse
 * atalho que colocou um valor reprovado numa PR de acessibilidade.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const globalsPath = new URL('../../src/globals.css', import.meta.url);
const tokensPath = new URL('../../docs/design-system/tokens.css', import.meta.url);

const AA = 4.5;

// Valores aposentados — se algum voltar, os asserts de leitura abaixo quebram.
const APOSENTADOS = {
  '--fg-3': '#6b746f',
  '--fg-on-dark-4': ['#8a948e', '#949e98'],
};

function luminancia(hex) {
  const canais = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = canais.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contraste(frente, fundo) {
  const [claro, escuro] = [luminancia(frente), luminancia(fundo)].sort((a, b) => b - a);
  return (claro + 0.05) / (escuro + 0.05);
}

/** Compõe uma cor translúcida sobre um fundo opaco — sem isto a medição mente. */
function compor([r, g, b], alpha, fundoHex) {
  const fundo = [1, 3, 5].map((i) => Number.parseInt(fundoHex.slice(i, i + 2), 16));
  const saida = [r, g, b].map((c, i) => Math.round(c * alpha + fundo[i] * (1 - alpha)));
  return `#${saida.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Lê o valor efetivo de um token dentro de um seletor — o último vence, como no CSS. */
function lerToken(css, seletor, token) {
  const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blocos = Array.from(css.matchAll(new RegExp(`${esc(seletor)}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'g')));
  assert.ok(blocos.length, `bloco ${seletor} precisa existir`);
  const achado = blocos
    .map((b) => b[1].match(new RegExp(`(?:^|\\n)\\s*${esc(token)}\\s*:\\s*([^;]+);`)))
    .findLast(Boolean);
  assert.ok(achado, `${token} precisa existir em ${seletor}`);
  return achado[1].trim().toLowerCase();
}

function exigirAA(rotulo, frente, superficies) {
  for (const [nome, fundo] of Object.entries(superficies)) {
    const medido = contraste(frente, fundo);
    assert.ok(
      medido >= AA,
      `${rotulo}: ${frente} sobre ${nome} (${fundo}) = ${medido.toFixed(4)} — precisa de ${AA}`,
    );
  }
}

// Superfícies da paleta ink (o Hub sobrescreve os tokens do pacote para elas).
const INK = { 'ink-1 (página)': '#0b1b18', 'ink-2 (sidebar)': '#0d201d', 'ink-3 (card)': '#14322c' };
const INK_MUTED = compor([255, 255, 255], 0.04, INK['ink-3 (card)']);
const INK_COM_MUTED = { ...INK, 'muted composto sobre card': INK_MUTED };

// Superfícies claras da marca (tokens.css §4).
const CLARAS = { 'white': '#ffffff', 'soft': '#f5f7f4', 'soft-3': '#f0f3f1' };

test('os tokens publicados carregam os valores canônicos do DS', () => {
  const globals = readFileSync(globalsPath, 'utf8');
  const tokens = readFileSync(tokensPath, 'utf8');

  // O pacote e o primitivo têm que dizer a MESMA coisa — senão "o DS diz X"
  // depende de qual arquivo se abriu.
  assert.match(tokens, /--fg-3:\s*#666e69;/);
  assert.match(tokens, /--fg-on-dark-4:\s*#969f99;/);
  assert.match(tokens, /--error-on-dark:\s*#f87171;/);
  for (const antigo of [APOSENTADOS['--fg-3'], ...APOSENTADOS['--fg-on-dark-4']]) {
    assert.doesNotMatch(tokens, new RegExp(`--fg-3:\\s*${antigo};`), `--fg-3 não pode voltar a ${antigo}`);
    assert.doesNotMatch(
      tokens,
      new RegExp(`--fg-on-dark-4:\\s*${antigo};`),
      `--fg-on-dark-4 não pode voltar a ${antigo}`,
    );
  }

  assert.equal(lerToken(globals, '@theme', '--color-muted-foreground'), '#666e69');
  assert.equal(lerToken(globals, '@theme', '--color-destructive'), '#dc2626');
  assert.equal(lerToken(globals, '.dark', '--color-muted-foreground'), '#969f99');
  assert.equal(lerToken(globals, '.dark', '--color-destructive'), '#f87171');
  assert.equal(lerToken(globals, '.dark', '--color-destructive-foreground'), '#0b1b18');
});

test('texto secundário passa AA nos dois temas e nos dois conjuntos de superfície', () => {
  const globals = readFileSync(globalsPath, 'utf8');
  const claro = lerToken(globals, '@theme', '--color-muted-foreground');
  const escuro = lerToken(globals, '.dark', '--color-muted-foreground');

  exigirAA('muted-foreground claro (marca)', claro, CLARAS);
  exigirAA('muted-foreground claro (pacote)', claro, {
    background: '#ffffff',
    'muted/secondary/accent': '#f4f5f6',
  });

  exigirAA('muted-foreground escuro (ink do Hub)', escuro, INK_COM_MUTED);
  exigirAA('muted-foreground escuro (pacote)', escuro, {
    background: lerToken(globals, '.dark', '--color-background'),
    card: lerToken(globals, '.dark', '--color-card'),
    muted: lerToken(globals, '.dark', '--color-muted'),
  });
});

test('destructive é legível como TEXTO e como PREENCHIMENTO — o par inverte junto', () => {
  const globals = readFileSync(globalsPath, 'utf8');
  const fillEscuro = lerToken(globals, '.dark', '--color-destructive');
  const sobreFillEscuro = lerToken(globals, '.dark', '--color-destructive-foreground');
  const fillClaro = lerToken(globals, '@theme', '--color-destructive');

  // TEXTO no escuro, nas superfícies canônicas do protótipo.
  exigirAA('destructive como texto (ink)', fillEscuro, INK);
  exigirAA('destructive como texto (pacote)', fillEscuro, {
    background: lerToken(globals, '.dark', '--color-background'),
    card: lerToken(globals, '.dark', '--color-card'),
  });

  // PREENCHIMENTO — a metade que uma troca só do texto quebraria.
  exigirAA('foreground sobre o fill escuro', sobreFillEscuro, { 'fill destructive': fillEscuro });
  exigirAA('branco sobre o fill claro', '#ffffff', { 'fill destructive': fillClaro });

  // A armadilha, escrita como asserção: branco por cima do vermelho do escuro
  // é 2.77. Se alguém "harmonizar" o foreground para branco, este teste explica.
  assert.ok(
    contraste('#ffffff', fillEscuro) < AA,
    'premissa quebrada: se branco passar sobre o fill escuro, a inversão do par deixou de ser necessária — revise o token',
  );
});

test('prova invertida: os valores aposentados reprovam de verdade', () => {
  // Não é casamento de string: os antigos REPROVAM o mesmo contrato AA.
  assert.ok(contraste('#6b746f', CLARAS.soft) < AA, '--fg-3 antigo sobre --soft');
  assert.ok(contraste('#8a948e', INK['ink-3 (card)']) < AA, '--fg-on-dark-4 antigo sobre --ink-3');
  assert.ok(contraste('#949e98', INK_MUTED) < AA, '--fg-on-dark-4 da PR#15 sobre o muted composto');
  assert.ok(contraste('#f9423d', INK['ink-3 (card)']) < AA, 'destructive antigo sobre --ink-3');
  assert.ok(contraste('#ffffff', '#f87171') < AA, 'branco sobre o destructive do escuro');

  // E o atalho que esconde a falha: medido como opaco, o valor da PR#15 "passa".
  assert.ok(
    contraste('#949e98', INK['ink-3 (card)']) >= AA,
    'premissa: sem compor o alpha, #949e98 parece aprovado — é por isso que a composição é obrigatória',
  );
});
