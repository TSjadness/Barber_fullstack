import type { KeyboardEvent } from "react";
import { Icon } from "@/components/Icon";
import { useDb } from "@/hooks/useBarberData";
import { serviceTotal } from "@/scripts/scheduling";
import type { StepProps } from "../types";
import { cx } from "@/utils/classNames";
import { money } from "@/utils/format";

/** Passo 1: escolha de um ou mais serviços. */
export function ServiceStep({ flow, setFlow }: StepProps) {
  const db = useDb();
  const selected = flow.serviceIds;
  const total = serviceTotal(db, selected);

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setFlow({ serviceIds: next, time: null });
  };
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <>
      <h2>Escolha seu serviço</h2>
      <p className="muted">Qual cuidado você merece hoje? Você pode escolher mais de um.</p>
      <div className="sel-count">
        <Icon name="check" />
        <span>
          Serviços selecionados: <b>{selected.length}</b>
        </span>
        {selected.length > 0 && total && <em>{`${total.duration} min · ${money(total.price)}`}</em>}
      </div>
      {db.services
        .filter((s) => s.active)
        .map((s) => {
          const on = selected.includes(s.id);
          return (
            <div
              key={s.id}
              className={cx("choice", on && "selected")}
              role="checkbox"
              aria-checked={on}
              tabIndex={0}
              onClick={() => toggle(s.id)}
              onKeyDown={(e) => onKey(e, s.id)}
            >
              <div className="choice-main">
                <span className="choice-check">{on && <Icon name="check" />}</span>
                <div>
                  <strong>{s.name}</strong>
                  <p>
                    <Icon name="clock" />
                    {` ${s.duration} minutos`}
                  </p>
                </div>
              </div>
              <strong className="price">{money(s.price)}</strong>
            </div>
          );
        })}
    </>
  );
}
