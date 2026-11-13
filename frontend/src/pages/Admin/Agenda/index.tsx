import { useBookingModals } from "../useBookingModals";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { NoticeBox } from "@/components/NoticeBox";
import { PageHead } from "@/components/PageHead";
import { MONTHS } from "@/constants/barber";
import { useAdminState } from "@/hooks/useAdminState";
import { useDb } from "@/hooks/useBarberData";
import {
  activeBookings,
  bookingPrice,
  bookingTotal,
  halfHourCapacity,
  isBlocked,
  staffHours,
} from "@/scripts/scheduling";
import { addDays, prettyDate, setYearMonth, toClock, todayIso } from "@/utils/date";
import { bookingTone } from "@/utils/bookingTone";
import { money } from "@/utils/format";

/** Linhas da grade: das 08:00 às 20:00, a cada 30 minutos. */
const TIMES = Array.from({ length: 25 }, (_, i) => toClock(8 * 60 + i * 30));

function StatusLabel({ status }: { status: string }) {
  if (status === "concluido")
    return (
      <>
        <Icon name="check" /> Concluído
      </>
    );
  if (status === "pendente")
    return (
      <>
        <Icon name="clock" /> Pendente
      </>
    );
  return (
    <>
      <Icon name="calendar" /> Confirmado
    </>
  );
}

/** Agenda do dia em grade de horários por profissional. */
export function AgendaSection() {
  const db = useDb();
  const { agendaDate: date, setAgendaDate, agendaStaff, setAgendaStaff } = useAdminState();
  const { openDetails, openManual } = useBookingModals();
  const today = todayIso();

  const allStaff = db.staff.filter((p) => p.active);
  const selected =
    agendaStaff !== "all" && allStaff.some((p) => p.id === agendaStaff) ? agendaStaff : "all";
  const employees = selected === "all" ? allStaff : allStaff.filter((p) => p.id === selected);
  const daybook = activeBookings(db).filter((b) => b.date === date);
  const count = daybook.filter((b) => employees.some((p) => p.id === b.staffId)).length;
  const possible = halfHourCapacity(db, employees, date);
  const occupancy = Math.round(possible ? (count / possible) * 100 : 0);
  const currentYear = Number(today.slice(0, 4));
  const shownYear = Number(date.slice(0, 4));
  const years = [
    ...new Set([
      currentYear - 1,
      currentYear,
      currentYear + 1,
      currentYear + 2,
      currentYear + 3,
      shownYear,
    ]),
  ].sort();

  return (
    <div className="premium-agenda">
      <PageHead title="Agenda" subtitle="Visualize atendimentos por horário e profissional.">
        <Button variant="ghost" className="bf-today-btn" onClick={() => setAgendaDate(today)}>
          Hoje
        </Button>
        <Button variant="primary" onClick={() => openManual()}>
          <Icon name="plus" /> Novo agendamento
        </Button>
      </PageHead>
      <div className="agenda-controls">
        <div className="day-nav">
          <Button small onClick={() => setAgendaDate(addDays(date, -1))} aria-label="Dia anterior">
            <Icon name="chevLeft" />
          </Button>
          <input
            type="date"
            value={date}
            aria-label="Selecionar data"
            onChange={(e) => e.target.value && setAgendaDate(e.target.value)}
          />
          <select
            aria-label="Mês"
            value={Number(date.slice(5, 7)) - 1}
            onChange={(e) => setAgendaDate(setYearMonth(date, null, Number(e.target.value)))}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            aria-label="Ano"
            value={shownYear}
            onChange={(e) => setAgendaDate(setYearMonth(date, Number(e.target.value), null))}
          >
            {years.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <Button small onClick={() => setAgendaDate(addDays(date, 1))} aria-label="Próximo dia">
            <Icon name="chevRight" />
          </Button>
        </div>
        <label className="bf-agenda-staff-filter">
          <span>Profissional</span>
          <select
            aria-label="Selecionar profissional da agenda"
            value={selected}
            onChange={(e) => setAgendaStaff(e.target.value)}
          >
            <option value="all">Todos os profissionais</option>
            {allStaff.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        {selected === "all" && allStaff.length > 1 && (
          <span className="muted bf-agenda-swipe-hint">
            <Icon name="arrowRight" /> <span>Deslize a agenda para ver outros profissionais</span>
          </span>
        )}
      </div>
      {db.notices
        .filter((n) => n.date === date)
        .map((n) => (
          <NoticeBox key={n.id} icon="flag" title={n.title} detail={n.detail} />
        ))}
      <section className="agenda-sheet">
        <div className="agenda-sheet-top">
          <h2>
            <Icon name="calendar" />
            {` ${prettyDate(date)}`}
          </h2>
          <div className="agenda-sheet-metrics">
            <span>
              <Icon name="clock" /> <b>{count}</b> agendamentos
            </span>
            <span>
              <Icon name="trending" /> <b>{`${occupancy}%`}</b>
              {" ocupação estimada"}
            </span>
          </div>
        </div>
        <div className="agenda-scroll">
          <div className="agenda-timeline" style={{ "--professionals": employees.length }}>
            <div className="timeline-corner">Horário</div>
            {employees.map((p) => (
              <div key={p.id} className="timeline-person">
                <Avatar name={p.name} photo={p.photo} />
                <span>
                  <b>{p.name}</b>
                  <small>{p.role || "Barbeiro"}</small>
                </span>
              </div>
            ))}
            {TIMES.map((t) => [
              <div key={t} className="timeline-hour">
                {t}
              </div>,
              ...employees.map((p) => {
                const match = daybook.find((b) => b.staffId === p.id && b.time === t);
                const block = isBlocked(db, date, p.id) || staffHours(p, date).mode === "closed";
                const free = !match && !block;
                return (
                  <div
                    key={`${t}-${p.id}`}
                    className="timeline-cell"
                    onClick={free ? () => openManual(date, t, p.id) : undefined}
                    title={free ? "Novo agendamento" : undefined}
                  >
                    {match ? (
                      <button
                        className={`timeline-booking ${bookingTone(match.status)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(match.id);
                        }}
                      >
                        <span className="book-main">
                          <b>{bookingTotal(db, match)?.name || "Atendimento"}</b>
                          <strong>{money(bookingPrice(db, match))}</strong>
                        </span>
                        <span className="book-sub">{`${match.customer} · ${t}`}</span>
                        <span className="book-status">
                          <StatusLabel status={match.status} />
                        </span>
                      </button>
                    ) : block ? (
                      <span className="timeline-closed">Fechado</span>
                    ) : null}
                  </div>
                );
              }),
            ])}
          </div>
        </div>
      </section>
      <p className="muted" style={{ marginTop: 12 }}>
        Clique em um agendamento para visualizar, editar ou cancelar. Clique em um horário vazio
        para adicionar um cliente.
      </p>
    </div>
  );
}
