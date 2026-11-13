import { Icon } from "@/components/Icon";
import { bookingTone } from "@/utils/bookingTone";
import { useDb } from "@/hooks/useBarberData";
import { bookingTotal, findStaff } from "@/scripts/scheduling";
import type { Booking, Notice } from "@/types/barber";
import { cx } from "@/utils/classNames";
import { phoneLabel } from "@/utils/format";

/** Quantidade de agendamentos mostrados por extenso em cada dia (o resto vira "+N mais"). */
const MAX_CHIPS = 2;

interface DayCellProps {
  day: number;
  date: string;
  monthName: string;
  today: string;
  selected: boolean;
  bookings: Booking[];
  notices: Notice[];
  onSelect: (date: string) => void;
  onOpenBooking: (id: string) => void;
}

/** Dia do calendário mensal: número, avisos, contagem e os primeiros agendamentos. */
export function DayCell({
  day,
  date,
  monthName,
  today,
  selected,
  bookings: list,
  notices,
  onSelect,
  onOpenBooking,
}: DayCellProps) {
  const db = useDb();
  const serviceName = (b: Booking) => bookingTotal(db, b)?.name || "Serviço removido";
  const attendant = (b: Booking) => findStaff(db, b.staffId)?.name || "Sem profissional";
  return (
    <div
      className={cx(
        "bcal-day",
        date === today && "today",
        selected && "selected",
        date < today && "past",
        list.length > 0 && "has",
      )}
    >
      <button
        type="button"
        className="bcal-day-num"
        onClick={() => onSelect(date)}
        aria-label={`${day} de ${monthName}: ${list.length} agendamento(s)`}
        aria-current={selected ? "date" : undefined}
      >
        <span>{day}</span>
        {notices.length > 0 && (
          <span className="bcal-flag" title={notices.map((n) => n.title).join(", ")}>
            <Icon name="flag" />
          </span>
        )}
        {list.length > 0 && <span className="bcal-count">{list.length}</span>}
      </button>
      <div className="bcal-events">
        {list.slice(0, MAX_CHIPS).map((b) => (
          <button
            key={b.id}
            type="button"
            className={`bcal-event ${bookingTone(b.status)}`}
            onClick={() => onOpenBooking(b.id)}
            title={`${b.time} · ${b.customer} · ${serviceName(b)} · ${phoneLabel(b.phone)} · ${attendant(b)}`}
          >
            <span className="bcal-ev-line">
              <b className="bcal-ev-time">{b.time}</b>
              <span className="bcal-ev-name">{b.customer}</span>
            </span>
            <span className="bcal-ev-sub">{serviceName(b)}</span>
            <span className="bcal-ev-sub">{phoneLabel(b.phone)}</span>
            <span className="bcal-ev-sub">{`com ${attendant(b)}`}</span>
          </button>
        ))}
        {list.length > MAX_CHIPS && (
          <button type="button" className="bcal-more" onClick={() => onSelect(date)}>
            {`+${list.length - MAX_CHIPS} mais`}
          </button>
        )}
      </div>
      <div className="bcal-dots" aria-hidden="true">
        {list.slice(0, 3).map((b) => (
          <i key={b.id} className={`bcal-dot ${bookingTone(b.status)}`}></i>
        ))}
      </div>
    </div>
  );
}
