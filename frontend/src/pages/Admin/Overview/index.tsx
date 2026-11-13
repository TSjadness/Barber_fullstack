import { useBookingModals } from "../useBookingModals";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Icon, type IconName } from "@/components/Icon";
import { PageHead } from "@/components/PageHead";
import { StatusBadge } from "@/components/StatusBadge";
import { WEEKDAYS_SHORT } from "@/constants/barber";
import { useDb } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { activeBookings, bookingPrice, bookingTotal, findStaff } from "@/scripts/scheduling";
import type { AppState } from "@/types/barber";
import { addDays, prettyDate, todayIso, weekdayOf } from "@/utils/date";
import { money } from "@/utils/format";

const paidOn = (db: AppState, date: string) =>
  db.bookings.filter((b) => b.paid && b.date === date).reduce((a, b) => a + bookingPrice(db, b), 0);

interface KpiProps {
  icon: IconName;
  value: string | number;
  label: string;
  highlight?: boolean;
  green?: boolean;
}

function Kpi({ icon, value, label, highlight, green }: KpiProps) {
  return (
    <div className={highlight ? "ov-kpi highlight" : "ov-kpi"}>
      <span className={green ? "kpi-icon green" : "kpi-icon"}>
        <Icon name={icon} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

/** Visão geral do dia: indicadores, próximos atendimentos, faturamento da semana e atalhos. */
export function OverviewSection() {
  const db = useDb();
  const { setSection } = useNavigation();
  const { openDetails, openManual } = useBookingModals();
  const today = todayIso();
  const now = new Date().toTimeString().slice(0, 5);

  const todayBookings = activeBookings(db)
    .filter((b) => b.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = activeBookings(db)
    .filter((b) => b.date >= today && (b.date > today || b.time >= now))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);
  const completed = todayBookings.filter((b) => b.status === "concluido").length;
  const pending = todayBookings.filter(
    (b) => b.status === "pendente" || b.status === "confirmado",
  ).length;
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const amounts = days.map((d) => paidOn(db, d));
  const maximum = Math.max(100, ...amounts);
  const weekTotal = amounts.reduce((a, v) => a + v, 0);

  return (
    <div className="premium-overview">
      <PageHead title="Visão Geral" subtitle="O essencial da sua barbearia, em um só lugar.">
        <Button variant="primary" onClick={() => openManual()}>
          <Icon name="plus" /> Novo agendamento
        </Button>
      </PageHead>
      <div className="overview-kpis">
        <Kpi highlight icon="calendar" value={todayBookings.length} label="Atendimentos hoje" />
        <Kpi green icon="checkCircle" value={completed} label="Concluídos" />
        <Kpi icon="hourglass" value={pending} label="Aguardando" />
        <Kpi highlight icon="wallet" value={money(paidOn(db, today))} label="Recebidos hoje" />
      </div>
      <div className="ov-columns">
        <section className="ov-panel">
          <div className="ov-panel-head">
            <h2>
              <Icon name="calendar" /> Próximos atendimentos
            </h2>
            <button className="text-action" onClick={() => setSection("agenda")}>
              Ver agenda completa <Icon name="arrowRight" />
            </button>
          </div>
          <div className="next-list">
            {upcoming.length ? (
              upcoming.map((b) => (
                <button key={b.id} className="next-booking" onClick={() => openDetails(b.id)}>
                  <b className="next-time">{b.time}</b>
                  <span className="next-name">
                    <strong>{b.customer}</strong>
                    <small>
                      {`${bookingTotal(db, b)?.name || "Serviço"} · ${b.date === today ? "Hoje" : prettyDate(b.date)}`}
                    </small>
                  </span>
                  <span className="next-staff">
                    <Icon name="user" />
                    {` ${findStaff(db, b.staffId)?.name.split(" ")[0] || "—"}`}
                  </span>
                  <StatusBadge status={b.status} />
                </button>
              ))
            ) : (
              <EmptyState as="p">Nenhum próximo atendimento encontrado.</EmptyState>
            )}
          </div>
        </section>
        <section className="ov-panel">
          <div className="ov-panel-head">
            <h2>
              <Icon name="chart" /> Faturamento da semana
            </h2>
          </div>
          <div className="ov-chart">
            {amounts.map((a, i) => (
              <div key={days[i]} className="ov-bar-col" title={money(a)}>
                <div
                  className="ov-bar"
                  style={{ height: `${Math.max(3, (100 * a) / maximum)}%` }}
                ></div>
                <small>{WEEKDAYS_SHORT[weekdayOf(days[i] ?? today)]}</small>
              </div>
            ))}
          </div>
          <div className="ov-bottom">
            <span>
              <small>Total da semana</small>
              <strong>{money(weekTotal)}</strong>
            </span>
            <button className="text-action" onClick={() => setSection("finance")}>
              Ver financeiro <Icon name="arrowRight" />
            </button>
          </div>
        </section>
      </div>
      <div className="ov-shortcuts">
        <strong>Acesso rápido</strong>
        <Button variant="primary" onClick={() => openManual()}>
          <Icon name="plus" /> Novo agendamento
        </Button>
        <Button onClick={() => setSection("notices")}>
          <Icon name="ban" /> Bloquear horário
        </Button>
        <Button onClick={() => setSection("bookings")}>
          <Icon name="receipt" /> Registrar pagamento
        </Button>
      </div>
    </div>
  );
}
