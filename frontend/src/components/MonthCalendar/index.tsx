import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { MONTHS, WEEKDAYS_SHORT } from "@/constants/barber";
import type { MonthCalendarProps } from "./types";
import { cx } from "@/utils/classNames";
import { daysInMonth, firstWeekdayOfMonth, monthKey, parseMonthKey } from "@/utils/date";

/**
 * Calendário mensal do agendamento do cliente. Dias passados ficam desabilitados e
 * cada dia mostra a disponibilidade (livre, poucas vagas, lotado ou fechado).
 * Não permite navegar para meses anteriores ao atual.
 */
export function MonthCalendar({
  month,
  today,
  selected,
  availabilityOf,
  onMonthChange,
  onSelect,
}: MonthCalendarProps) {
  const { year: y, month: m } = parseMonthKey(month);
  const current = today.slice(0, 7);
  const todayYear = Number(today.slice(0, 4));
  const todayMonthIndex = Number(today.slice(5, 7)) - 1;
  const years = Array.from({ length: 4 }, (_, i) => todayYear + i);

  const goTo = (year: number, monthIndex: number) => {
    const next = monthKey(year, monthIndex);
    onMonthChange(next < current ? current : next);
  };

  const blanks = Array.from({ length: firstWeekdayOfMonth(y, m) }, (_, i) => (
    <span key={`b${i}`} className="cal-blank"></span>
  ));
  const days = Array.from({ length: daysInMonth(y, m) }, (_, idx) => {
    const day = idx + 1;
    const date = `${month}-${String(day).padStart(2, "0")}`;
    if (date < today)
      return (
        <button key={date} className="date-button past" disabled>
          <strong>{day}</strong>
        </button>
      );
    const st = availabilityOf(date);
    return (
      <button
        key={date}
        disabled={st.code === "closed" || st.code === "full"}
        className={cx("date-button", st.code, selected === date && "selected")}
        title={st.label}
        aria-label={`${day} de ${MONTHS[m - 1]}: ${st.label}`}
        onClick={() => onSelect(date)}
      >
        <strong>{day}</strong>
        <small>{st.label}</small>
      </button>
    );
  });

  return (
    <>
      <div className="mcal-head">
        <Button
          small
          variant="ghost"
          disabled={month <= current}
          onClick={() => goTo(y, m - 2)}
          aria-label="Mês anterior"
        >
          <Icon name="chevLeft" />
        </Button>
        <div className="cal-selects">
          <select aria-label="Mês" value={m - 1} onChange={(e) => goTo(y, Number(e.target.value))}>
            {MONTHS.map((name, i) => (
              <option key={name} value={i} disabled={y === todayYear && i < todayMonthIndex}>
                {name}
              </option>
            ))}
          </select>
          <select aria-label="Ano" value={y} onChange={(e) => goTo(Number(e.target.value), m - 1)}>
            {years.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <Button small variant="ghost" onClick={() => goTo(y, m)} aria-label="Próximo mês">
          <Icon name="chevRight" />
        </Button>
      </div>
      <div className="dates cal-grid-month">
        {WEEKDAYS_SHORT.map((w) => (
          <span key={w} className="cal-wd">
            {w}
          </span>
        ))}
        {blanks}
        {days}
      </div>
    </>
  );
}
