"use client";

import * as React from "react";
import { Button } from "./button";

export interface ErrorBoundaryFallbackProps {
  error: Error | null;
  reset: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Conteúdo quando há erro; se omitido, usa fallback padrão com Recarregar */
  fallback?: (props: ErrorBoundaryFallbackProps) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Captura erros de renderização em filhos e exibe fallback (client-only).
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) {
        return fallback({ error, reset: this.reset });
      }
      return (
        <DefaultErrorFallback error={error} reset={this.reset} />
      );
    }

    return children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div
      role="alert"
      className="border-border bg-card text-card-foreground flex flex-col items-center gap-4 rounded-xl border p-8 text-center shadow-sm"
    >
      <div className="space-y-2">
        <p className="text-foreground text-base font-semibold">
          Algo deu errado ao carregar esta área.
        </p>
        <p className="text-muted-foreground max-w-md text-sm">
          {error?.message?.trim()
            ? error.message
            : "Tente recarregar para tentar de novo."}
        </p>
      </div>
      <Button type="button" onClick={() => reset()}>
        Recarregar
      </Button>
    </div>
  );
}
