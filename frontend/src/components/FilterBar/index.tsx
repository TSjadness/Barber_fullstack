import type { FormEvent, ReactNode } from "react";
import { cx } from "@/utils/classNames";

interface FilterBarProps {
  className?: string;
  /** Há filtro aplicado (habilita o botão Limpar). */
  active: boolean;
  onClear: () => void;
  onSubmit: () => void;
  children: ReactNode;
}

/** Barra de filtros das listagens da gestão, com o botão Limpar. */
export function FilterBar({ className, active, onClear, onSubmit, children }: FilterBarProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <form className={cx("card filter-bar", className)} onSubmit={submit}>
      {children}
      <div className="filter-actions">
        <button className="btn filter-clear" type="button" disabled={!active} onClick={onClear}>
          Limpar
        </button>
      </div>
    </form>
  );
}
