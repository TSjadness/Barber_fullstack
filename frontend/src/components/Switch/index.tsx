interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  label: string;
}

/** Chave liga/desliga com trilho animado. */
export function Switch({ checked, onChange, title, label }: SwitchProps) {
  return (
    <label className="switch" title={title}>
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track"></span>
    </label>
  );
}
