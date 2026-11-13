import { Icon } from "@/components/Icon";
import { Switch } from "@/components/Switch";
import type { DaySchedule, Staff } from "@/types/barber";
import { cx } from "@/utils/classNames";

interface DayRowProps {
  name: string;
  person: Staff;
  spec: DaySchedule;
  expanded: boolean;
  onToggleOpen: (open: boolean) => void;
  onToggleExpand: () => void;
  onChange: (patch: Partial<DaySchedule>) => void;
}

/** Um dia da semana: chave de atendimento, horário vigente e ajuste (padrão ou personalizado). */
export function DayRow({
  name,
  person,
  spec,
  expanded,
  onToggleOpen,
  onToggleExpand,
  onChange,
}: DayRowProps) {
  const isOpen = spec.mode !== "closed";
  const custom = spec.mode === "custom";
  const start = (custom ? spec.start : person.start) ?? person.start;
  const end = (custom ? spec.end : person.end) ?? person.end;
  return (
    <div className={cx("schedule-day", !isOpen && "is-off", expanded && "expanded")}>
      <div className="schedule-day-main">
        <div className="schedule-day-label">
          <span className="schedule-day-icon">
            <Icon name={isOpen ? "dotFill" : "dot"} />
          </span>
          <span>
            <strong>{name}</strong>
            <small>
              {isOpen ? (custom ? "Horário personalizado" : "Horário padrão") : "Sem atendimento"}
            </small>
          </span>
        </div>
        <div className="schedule-day-time">
          {isOpen ? (
            <>
              {`${start} `}
              <span>até</span>
              {` ${end}`}
            </>
          ) : (
            "Fechado"
          )}
        </div>
        <div className="schedule-day-actions">
          <Switch
            checked={isOpen}
            onChange={onToggleOpen}
            title={`${isOpen ? "Fechar" : "Abrir"} ${name}`}
            label={`Atendimento na ${name}`}
          />
          <button className="schedule-edit" disabled={!isOpen} onClick={onToggleExpand}>
            {expanded ? "Concluir " : "Ajustar "}
            <span>{expanded ? <Icon name="chevUp" /> : <Icon name="chevDown" />}</span>
          </button>
        </div>
      </div>
      {expanded && isOpen && (
        <div className="schedule-expand">
          <p>{`Como será o expediente de ${name.toLowerCase()}?`}</p>
          <div className="schedule-mode">
            <button
              className={cx(spec.mode === "default" && "active")}
              onClick={() => onChange({ mode: "default" })}
            >
              <Icon name="check" /> Usar padrão
            </button>
            <button className={cx(custom && "active")} onClick={() => onChange({ mode: "custom" })}>
              <Icon name="clock" /> Personalizar
            </button>
          </div>
          {custom ? (
            <div className="schedule-times">
              <label>
                Das{" "}
                <input
                  type="time"
                  value={spec.start || person.start}
                  onChange={(e) => onChange({ start: e.target.value })}
                />
              </label>
              <label>
                Até{" "}
                <input
                  type="time"
                  value={spec.end || person.end}
                  onChange={(e) => onChange({ end: e.target.value })}
                />
              </label>
            </div>
          ) : (
            <div className="schedule-tip">
              {`Aplica automaticamente o horário de ${person.start} às ${person.end}.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
