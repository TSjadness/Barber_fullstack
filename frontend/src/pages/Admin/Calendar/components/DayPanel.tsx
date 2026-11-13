import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { NoticeBox } from "@/components/NoticeBox";
import { StatusBadge } from "@/components/StatusBadge";
import { useDb } from "@/hooks/useBarberData";
import { bookingTotal, findStaff } from "@/scripts/scheduling";
import type { Booking, Notice } from "@/types/barber";
import { prettyDate } from "@/utils/date";
import { bookingTone } from "@/utils/bookingTone";
import { money, phoneLabel } from "@/utils/format";

/** Rótulos do painel do dia (agendamentos cancelados não aparecem no calendário). */
const PANEL_LABELS = { pendente: "Pendente", confirmado: "Confirmado", concluido: "Concluído" };

interface DayPanelProps {
  date: string;
  bookings: Booking[];
  notices: Notice[];
  onNew: () => void;
  onOpenBooking: (id: string) => void;
}

/** Painel lateral com os avisos e todos os agendamentos do dia selecionado. */
export function DayPanel({ date, bookings, notices, onNew, onOpenBooking }: DayPanelProps) {
  const db = useDb();
  return (
    <aside className="bcal-panel" aria-label="Agendamentos do dia">
      <div className="bcal-panel-head">
        <div>
          <span className="eyebrow">DIA SELECIONADO</span>
          <h3>{prettyDate(date)}</h3>
          <span className="muted">
            {`${bookings.length} agendamento${bookings.length === 1 ? "" : "s"}`}
          </span>
        </div>
        <Button type="button" small variant="primary" onClick={onNew}>
          <Icon name="plus" /> Novo
        </Button>
      </div>
      {notices.map((n) => (
        <NoticeBox key={n.id} icon="flag" title={n.title} detail={n.detail} />
      ))}
      {bookings.length ? (
        <div className="bcal-list">
          {bookings.map((b) => {
            const total = bookingTotal(db, b);
            return (
              <button
                key={b.id}
                type="button"
                className={`bcal-item ${bookingTone(b.status)}`}
                onClick={() => onOpenBooking(b.id)}
              >
                <b className="bcal-item-time">{b.time}</b>
                <span className="bcal-item-info">
                  <strong>{b.customer}</strong>
                  <span>{`${total?.name || "Serviço removido"} · ${money(total?.price)}`}</span>
                  <span>
                    <Icon name="phone" />
                    {` ${phoneLabel(b.phone)}`}
                  </span>
                  <span>
                    <Icon name="user" />
                    {` Atendente: ${findStaff(db, b.staffId)?.name || "Sem profissional"}`}
                  </span>
                </span>
                <StatusBadge status={b.status} labels={PANEL_LABELS} />
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState>Nenhum agendamento neste dia.</EmptyState>
      )}
    </aside>
  );
}
