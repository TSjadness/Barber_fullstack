import type { CSSProperties, FormEvent, ReactNode } from "react";
import { cx } from "@/utils/classNames";

interface FormProps {
  className?: string;
  onSubmit: () => void;
  children: ReactNode;
}

/** Formulário em coluna (`.forms`), com envio tratado pela aplicação. */
export function Form({ className, onSubmit, children }: FormProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <form className={cx("forms", className)} onSubmit={submit}>
      {children}
    </form>
  );
}

/** Mesmo layout de `.forms` sem envio (campos lidos por botões próprios). */
export function FormStack({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={cx("forms", className)} style={style}>
      {children}
    </div>
  );
}

/** Dois campos lado a lado. */
export function FormRow({ children }: { children: ReactNode }) {
  return <div className="form-row">{children}</div>;
}

interface ToggleFieldProps {
  id?: string;
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

/** Caixa de seleção com rótulo ao lado (`label.toggle`). */
export function ToggleField({ id, className, checked, onChange, children }: ToggleFieldProps) {
  return (
    <label className={cx("toggle", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {children}
    </label>
  );
}
