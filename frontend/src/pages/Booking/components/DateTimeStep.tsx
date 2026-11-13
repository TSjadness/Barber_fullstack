import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { MonthCalendar } from "@/components/MonthCalendar";
import { NoticeBox } from "@/components/NoticeBox";
import { TimeSlots } from "@/components/TimeSlots";
import { useDb } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { dayAvailability, findStaff, possibleTimes } from "@/scripts/scheduling";
import type { StepProps } from "../types";
import { prettyDate, todayIso } from "@/utils/date";

const LEGEND = [
  ["#51b77e", "Disponível"],
  ["#e8c15a", "Poucas vagas"],
  ["#db854b", "Lotado"],
  ["#d65b65", "Fechado"],
] as const;

/** Passo 3: dia no calendário e horário livre. */
export function DateTimeStep({ flow, setFlow }: StepProps) {
  const db = useDb();
  const { bookingMonth, setBookingMonth } = useNavigation();
  const today = todayIso();
  const d = flow.date;
  const alerts = db.notices.filter(
    (n) =>
      n.date === d && (n.staffId === "all" || flow.staffId === "any" || n.staffId === flow.staffId),
  );
  const slots = d ? possibleTimes(db, flow, d, today) : [];

  return (
    <>
      <h2>Data e horário</h2>
      <p className="muted">Escolha um dia e veja os horários disponíveis.</p>
      <div className="availability-legend">
        {LEGEND.map(([color, label]) => (
          <span key={label}>
            <i style={{ background: color }}></i>
            {label}
          </span>
        ))}
      </div>
      <div className="booking-date-time">
        <Card className="booking-calendar">
          <h3>{d ? prettyDate(d) : "Selecione uma data"}</h3>
          <MonthCalendar
            month={bookingMonth}
            today={today}
            selected={d}
            availabilityOf={(date) => dayAvailability(db, flow, date, today)}
            onMonthChange={setBookingMonth}
            onSelect={(date) => setFlow({ date, time: null, confirmStaff: null })}
          />
        </Card>
        <Card className="booking-slots">
          <h3>Horários disponíveis</h3>
          {!d ? (
            <div className="times-empty">
              <Icon name="calendar" />
              <span>Por favor, escolha uma data para verificar os horários disponíveis.</span>
            </div>
          ) : (
            <div className="time-periods">
              {slots.length ? (
                <TimeSlots
                  slots={slots}
                  selectedTime={flow.time}
                  selectedStaff={flow.confirmStaff}
                  showStaff={flow.staffId === "any"}
                  staffName={(id) => findStaff(db, id)?.name}
                  onSelect={(t) => setFlow({ time: t.time, confirmStaff: t.staffId })}
                />
              ) : (
                <EmptyState>
                  Nenhum horário disponível para esta data. Escolha outro dia.
                </EmptyState>
              )}
            </div>
          )}
        </Card>
      </div>
      {alerts.map((n) => (
        <NoticeBox key={n.id} icon="alert" title={n.title} detail={n.detail}>
          {n.type === "block" && (
            <>
              <br />
              <small>Horários indisponíveis para o profissional afetado.</small>
            </>
          )}
        </NoticeBox>
      ))}
    </>
  );
}
