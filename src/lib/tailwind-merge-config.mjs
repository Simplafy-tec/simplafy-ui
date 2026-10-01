/*
 * Tamanhos de fonte NOMEADOS do Hub (`--text-*` no `@theme` do globals.css do app). O tailwind-merge só conhece a
 * escala padrão do Tailwind; sem isto, `text-compact` era lido como COR e `cn('text-compact', 'text-foreground')`
 * descartava o tamanho — o botão "Lista/Kanban" e o item do menu lateral voltavam a 16px. Aqui eles entram na escala
 * `text` do tema, que é a de tamanho de fonte (e não a de cor).
 */
export const tailwindMergeConfig = {
  extend: {
    theme: {
      text: ['3xs', '2xs', 'micro', 'compact', 'md', 'panel-title'],
    },
  },
};
