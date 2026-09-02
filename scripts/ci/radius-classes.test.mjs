/*
 * Guarda contra `rounded-*` que o Tailwind do CONSUMIDOR não gera nenhum CSS.
 *
 * Por que existe: a Hub#5.2.13.12 (PR#19) trocou `rounded-xs` por
 * `rounded-2xs` em três componentes pra bater com o novo `--radius-2xs`
 * (3px). `2xs` não está no namespace `--radius-*` DEFAULT que o Tailwind 4
 * emite sozinho (`xs|sm|md|lg|xl|2xl|3xl|4xl|full|none`) — e `--radius-2xs`
 * vive em `@layer base` (`src/globals.css`), não em `@theme`, então não
 * registra chave nova nenhuma. O consumidor também não importa
 * `tailwind-preset.ts` (ver o comentário em `src/tailwind-preset.ts:88-93`).
 * Resultado: `border-radius: 0` silencioso — canto reto onde devia ter 3px,
 * sem erro de build nenhum. Review adversarial pegou (PR#19, achado 1); isso
 * pinça o mesmo defeito de graça, sem depender de outro humano/agente ler o
 * CSS renderizado.
 *
 * O que este teste NÃO faz: não valida qual DEGRAU é o certo pro papel do
 * componente (isso é decisão de design, não regra estática) — só que a
 * classe usada emite CSS de verdade nalgum lugar. "Errado mas visível" passa
 * aqui; "invisível" não passa.
 *
 * Como decide o que é seguro: contra o namespace `--radius-*` que o
 * TAILWIND 4 registra SOZINHO, hardcoded abaixo (não lido de
 * `src/tailwind-preset.ts`). Rodada 2 do review adversarial pegou o motivo:
 * cruzar com o preset só produz falso positivo/negativo — sufixo nativo
 * (ex.: `4xl`) emite CSS pelo `theme.css` do próprio Tailwind
 * INDEPENDENTEMENTE do preset, que (o próprio arquivo documenta) nenhum
 * consumidor importa hoje; e sufixo do preset sem ser nativo (`2xs`, `pill`)
 * é EXATAMENTE o bug que este guard existe pra pegar — cruzar com ele
 * escondia a metade do problema atrás da outra metade. Valor arbitrário
 * (`rounded-[...]`) é sempre seguro (Tailwind sempre emite arbitrário) e sai
 * da varredura.
 */

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url).pathname;
const COMPONENTS_DIR = join(ROOT, 'src/components');

// Namespace `--radius-*` que o Tailwind 4 REGISTRA SOZINHO, sem preset nem
// @theme customizado — citado pelo review adversarial da PR#19 a partir de
// `tailwindcss@4.2.3/theme.css` (`xs|sm|md|lg|xl|2xl|3xl|4xl`) + os static
// values `none`/`full` (`dist/lib.js`, `full` emite `calc(infinity * 1px)`,
// não uma var). NÃO inclui `2xs` nem `pill`: essas duas só existem em
// `src/tailwind-preset.ts`, que nenhum consumidor importa hoje — por isso
// NÃO fazem esta lista ficar segura (ver cabeçalho do arquivo).
const NATIVO_TAILWIND = new Set(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']);

// Direções válidas de `rounded-<dir>-<suffix>` (border-radius lógico/físico
// do Tailwind 4) — usadas só pra separar "direção" de "sufixo de tamanho"
// em `rounded-t-lg`, `rounded-tl-sm`, etc.
const DIRECOES = new Set(['t', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl', 's', 'e', 'ss', 'se', 'es', 'ee']);

// `withFileTypes + recursive` (Node ≥20.1, o CI roda node-version: 20) exige
// montar o caminho a partir de `entry.parentPath` (a pasta REAL onde o
// dirent mora), não do `dir` raiz — senão arquivo em subpasta gera um
// caminho que não existe e nunca é lido (era o bug B1 da rodada 2: um
// componente em `src/components/charts/novo.tsx` passava batido).
function listarArquivosTsx(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
    .map((e) => join(e.parentPath, e.name));
}

// Casa `rounded`, `rounded-<suffix>`, `rounded-<dir>-<suffix>` e as formas
// arbitrárias `rounded-[...]` / `rounded-<dir>-[...]`. Não casa outra palavra
// que só contenha "rounded" como substring (ex.: prosa em comentário) porque
// exige fronteira de palavra dos dois lados.
const RE_ROUNDED = /\brounded(?:-([a-z]{1,2}))?(?:-(\[[^\]]+\]|[a-zA-Z0-9]+))?\b/g;

test('todo rounded-* em src/components emite CSS real no Tailwind 4 do consumidor', () => {
  const achados = [];
  for (const arquivo of listarArquivosTsx(COMPONENTS_DIR)) {
    const linhas = readFileSync(arquivo, 'utf8').split('\n');
    linhas.forEach((linha, i) => {
      for (const m of linha.matchAll(RE_ROUNDED)) {
        const [classe, direcaoOuSuffixo, sufixoSeTemDirecao] = m;
        let sufixo;
        if (sufixoSeTemDirecao !== undefined) {
          // `rounded-t-lg` → grupo1='t' (direção), grupo2='lg' (sufixo real)
          sufixo = sufixoSeTemDirecao;
        } else if (direcaoOuSuffixo !== undefined && !DIRECOES.has(direcaoOuSuffixo)) {
          // `rounded-lg` → grupo1='lg' já É o sufixo (sem direção no meio)
          sufixo = direcaoOuSuffixo;
        } else {
          // `rounded` puro, ou `rounded-t` sem sufixo (não é uso real) — pula
          continue;
        }
        if (sufixo.startsWith('[')) continue; // arbitrário, sempre emite
        if (!NATIVO_TAILWIND.has(sufixo)) {
          achados.push(`${arquivo.replace(ROOT, '')}:${i + 1} — classe \`${classe}\` (sufixo \`${sufixo}\`) não está no namespace --radius-* que o Tailwind emite sozinho; vira border-radius:0 silencioso no consumidor. Use um sufixo nativo (${[...NATIVO_TAILWIND].join('|')}) ou valor arbitrário rounded-[...]`);
        }
      }
    });
  }

  assert.deepEqual(achados, [], `\n${achados.join('\n')}\n`);
});
