import { groupByPeriod } from "@/scripts/scheduling";
import type { TimeOption } from "@/types/barber";
import { cx } from "@/utils/classNames";

interface TimeSlotsProps {
  slots: TimeOption[];
  selectedTime: string | null;
  selectedStaff: string | null;
  /** Mostra o primeiro nome do profissional (agendamento sem preferência). */
  showStaff: boolean;
  staffName: (staffId: string) => string | undefined;
  onSelect: (slot: TimeOption) => void;
}

/** Horários livres agrupados em manhã, tarde e noite. */
export function TimeSlots({
  slots,
  selectedTime,
  selectedStaff,
  showStaff,
  staffName,
  onSelect,
}: TimeSlotsProps) {
  return (
    <>
      {groupByPeriod(slots).map((group) => (
        <section
          key={group.name}
          className="time-period"
          aria-label={`Horários da ${group.name.toLowerCase()}`}
        >
          <h4 className="time-period-title">{group.name}</h4>
          <div className="times">
            {group.slots.map((t) => {
              const selected = selectedTime === t.time && selectedStaff === t.staffId;
              return (
                <button
                  key={`${t.time}-${t.staffId}`}
                  type="button"
                  className={cx("time-button", selected && "selected")}
                  aria-pressed={selected}
                  onClick={() => onSelect(t)}
                >
                  {t.time}
                  {showStaff && (
                    <small>{staffName(t.staffId)?.split(" ")[0] || "Profissional"}</small>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
