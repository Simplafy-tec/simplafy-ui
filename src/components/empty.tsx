import * as React from "react";
import { cn } from "../lib/utils";

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ícone ou ilustração acima do título */
  illustration?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Botões ou links abaixo do texto */
  actions?: React.ReactNode;
}

/**
 * Estado vazio com hierarquia consistente (Hub / design system).
 */
export function Empty({
  className,
  illustration,
  title,
  description,
  actions,
  ...props
}: EmptyProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-4 py-12 text-center",
        className,
      )}
      {...props}
    >
      {illustration ? (
        <div className="text-muted-foreground mb-2 flex justify-center [&_svg]:h-12 [&_svg]:w-12">
          {illustration}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-foreground text-base font-semibold">{title}</p>
        {description ? (
          <div className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
