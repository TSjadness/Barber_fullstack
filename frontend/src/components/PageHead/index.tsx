import type { ReactNode } from "react";
import { cx } from "@/utils/classNames";

interface PageHeadProps {
  title: string;
  subtitle: string;
  /** Classe extra da área de ações (ajustes de layout de Financeiro e Calendário). */
  actionsClassName?: string;
  children?: ReactNode;
}

/** Cabeçalho das seções da gestão, com título, subtítulo e ações. */
export function PageHead({ title, subtitle, actionsClassName, children }: PageHeadProps) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">PAINEL DA BARBEARIA</div>
        <h1>{title}</h1>
        <span className="muted">{subtitle}</span>
      </div>
      <div className={cx("head-actions", actionsClassName)}>{children}</div>
    </div>
  );
}
