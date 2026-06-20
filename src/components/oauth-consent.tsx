'use client';

import * as React from 'react';
import { ExternalLink, Lock, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { ProviderLogo, type ProviderLogoId } from './provider-logo';

export type OAuthConsentState = 'ready' | 'authorizing';

export interface OAuthConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  providerName: string;
  /** Rótulo do popup OAuth (ex.: Google, Microsoft). */
  oauthLabel?: string;
  providerId?: ProviderLogoId;
  account?: string;
  state?: OAuthConsentState;
  onAuthorize?: () => void;
  onCancel?: () => void;
  authorizeLabel?: string;
  authorizingLabel?: string;
}

function OAuthConsent({
  providerName,
  oauthLabel,
  providerId,
  account,
  state = 'ready',
  onAuthorize,
  onCancel,
  authorizeLabel = 'Conectar',
  authorizingLabel = 'Aguardando…',
  className,
  ...props
}: OAuthConsentProps) {
  const oauth = oauthLabel ?? providerName;
  const authorizing = state === 'authorizing';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border bg-card p-3.5',
        className,
      )}
      {...props}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {authorizing ? (
          <RefreshCw size={16} className="spin" aria-hidden="true" />
        ) : providerId ? (
          <ProviderLogo id={providerId} size={22} />
        ) : (
          <Lock size={16} aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold leading-tight">
          {authorizing ? `Conectando ao ${providerName}…` : `Autorizar via ${oauth}`}
        </div>
        <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
          {authorizing
            ? 'Abrimos uma janela para você entrar e permitir o acesso. Conclua por lá.'
            : `Abre um popup do ${oauth} para liberar o acesso de leitura. Você pode revogar depois.`}
          {account ? (
            <>
              {' '}
              Conta: <span className="font-medium text-foreground">{account}</span>
            </>
          ) : null}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        {onCancel ? (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={authorizing}>
            Cancelar
          </Button>
        ) : null}
        <Button type="button" size="sm" onClick={onAuthorize} disabled={authorizing || !onAuthorize}>
          {authorizing ? (
            authorizingLabel
          ) : (
            <>
              <ExternalLink size={13} aria-hidden="true" />
              {authorizeLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export { OAuthConsent };
