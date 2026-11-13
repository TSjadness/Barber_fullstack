import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/Icon/types";
import { cx } from "@/utils/classNames";

interface RowActionsProps {
  children: ReactNode;
  /**
   * Em listas (Serviços), no mobile os botões ocupam a largura do item, com ícone e
   * texto, como na Gestão de Profissionais. Em tabelas ficam sempre só com ícone.
   */
  stacked?: boolean;
  className?: string;
}

/** Grupo de ações de um item da gestão (editar, cancelar, excluir...). */
export function RowActions({ children, stacked, className }: RowActionsProps) {
  return <div className={cx("bf-row-actions", stacked && "is-stacked", className)}>{children}</div>;
}

interface RowActionProps {
  icon: IconName;
  /** Texto do botão (visível no mobile das listas; nas demais, via título e leitor de tela). */
  label: string;
  /** Descrição completa para leitores de tela e dica ao passar o mouse. */
  title: string;
  variant?: "ghost" | "danger";
  disabled?: boolean;
  onClick: () => void;
}

export function RowAction({
  icon,
  label,
  title,
  variant = "ghost",
  disabled = false,
  onClick,
}: RowActionProps) {
  return (
    <Button
      small
      type="button"
      variant={variant}
      className="bf-row-action"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <Icon name={icon} />
      <span className="bf-row-action-label">{label}</span>
    </Button>
  );
}
