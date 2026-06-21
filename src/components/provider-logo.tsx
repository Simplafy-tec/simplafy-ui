'use client';

import * as React from 'react';
import { Folder } from 'lucide-react';
import { cn } from '../lib/utils';

/** Ids de provedores de armazenamento com logo SVG embutido. */
export type ProviderLogoId =
  | 'gdrive'
  | 'dropbox'
  | 'onedrive'
  | 'box'
  | 's3'
  | 'ftp'
  | (string & {});

export interface ProviderLogoProps {
  id: ProviderLogoId;
  size?: number;
  className?: string;
  title?: string;
}

function svgStyle(size: number): React.CSSProperties {
  return { width: size, height: size, display: 'block', flexShrink: 0 };
}

function ProviderLogoSvg({ id, size }: { id: string; size: number }) {
  const st = svgStyle(size);
  switch (id) {
    case 'gdrive':
      return (
        <svg style={st} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
          <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5z" fill="#00ac47" />
          <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" fill="#ea4335" />
          <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
          <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
          <path d="M73.4 26.5L60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
        </svg>
      );
    case 'dropbox':
      return (
        <svg style={st} viewBox="0 0 235.45 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            fill="#0061ff"
            d="M58.86 0L0 37.5l58.86 37.5 58.87-37.5L58.86 0zm117.73 0l-58.86 37.5 58.86 37.5 58.86-37.5L176.59 0zM0 112.5l58.86 37.5 58.87-37.5L58.86 75 0 112.5zm176.59-37.5l-58.86 37.5 58.86 37.5 58.86-37.5-58.86-37.5zM58.86 158.49l58.87 37.5 58.86-37.5-58.86-37.49-58.87 37.49z"
          />
        </svg>
      );
    case 'onedrive':
      return (
        <svg style={st} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            fill="#0364b8"
            d="M10.6 8.1c-2.4 0-4.5 1.6-5.1 3.9C3.5 12.2 2 13.9 2 15.9 2 18 3.7 19.7 5.8 19.7h12.5c1.9 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.1-3.5 0-.2.1-.4.1-.6 0-2.8-2.3-5.1-5.1-5.1-1.4 0-2.7.6-3.6 1.5-.5-.2-1-.3-1.5-.3z"
          />
        </svg>
      );
    case 'box':
      return (
        <svg style={st} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="24" height="24" rx="5" fill="#0061d5" />
          <path d="M12 5.4l5 2.85v5.7L12 16.8l-5-2.85v-5.7z" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M7.2 8.4l4.8 2.75 4.8-2.75M12 11.15V16.7" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case 's3':
      return (
        <svg style={st} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#e25444" d="M4.4 4.6h15.2l-1.4 14.1c-.1.9-.9 1.6-1.8 1.6H7.6c-.9 0-1.7-.7-1.8-1.6L4.4 4.6z" />
          <path fill="#7b1d13" d="M12 20.3H7.6c-.9 0-1.7-.7-1.8-1.6L4.4 4.6H12v15.7z" opacity="0.25" />
          <ellipse cx="12" cy="4.6" rx="7.6" ry="1.7" fill="#e8a298" />
        </svg>
      );
    case 'ftp':
      return (
        <svg
          style={st}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="7" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <line x1="7" y1="7.5" x2="7.01" y2="7.5" />
          <line x1="7" y1="17" x2="7.01" y2="17" />
        </svg>
      );
    default:
      return <Folder size={size} aria-hidden="true" />;
  }
}

function ProviderLogo({ id, size = 20, className, title }: ProviderLogoProps) {
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', className)} title={title}>
      <ProviderLogoSvg id={id} size={size} />
    </span>
  );
}

export { ProviderLogo };
