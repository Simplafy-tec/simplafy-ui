"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button, type ButtonProps } from "./button";

export interface ModalConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  loading?: boolean;
  loadingLabel?: string;
  onConfirm: () => void | Promise<void>;
  /** Pass-through para testes (ex.: Playwright). */
  "data-testid"?: string;
}

/**
 * Modal de confirmação (ex.: exclusões) — padrão Hub v2.
 */
export function ModalConfirm({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  confirmVariant = "default",
  loading = false,
  loadingLabel,
  onConfirm,
  "data-testid": dataTestId,
}: ModalConfirmProps) {
  const handleConfirm = () => {
    void onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="modal-confirm"
        data-testid={dataTestId}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && loadingLabel ? loadingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Namespace opcional: `Modal.Confirm` */
export const Modal = {
  Confirm: ModalConfirm,
};
