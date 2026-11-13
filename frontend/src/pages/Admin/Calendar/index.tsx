import { useEffect, useState } from "react";
import { DayCell } from "./components/DayCell";
import { DayPanel } from "./components/DayPanel";
import { useBookingModals } from "../useBookingModals";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/PageHead";
import { MOBILE_QUERY, MONTHS, WEEKDAYS_SHORT } from "@/constants/barber";
import { useAdminState } from "@/hooks/useAdminState";
import { useDb } from "@/hooks/useBarberData";
import { useFullscreenCalendar } from "@/hooks/useFullscreenCalendar";
import { useOverlay } from "@/hooks/useOverlay";
import { activeBookings } from "@/scripts/scheduling";
import type { Booking } from "@/types/barber";
import { daysInMonth, firstWeekdayOfMonth, monthKey, parseMonthKey, todayIso } from "@/utils/date";

/** Agrupa os agendamentos ativos por dia, em ordem de horário. */
function bookingsByDay(bookings: Booking[]) {
  const byDay: Record<string, Booking[]> = {};
  for (const b of bookings) (byDay[b.date] ||= []).push(b);
  for (const list of Object.values(byDay)) list.sort((a, b) => a.time.localeCompare(b.time));
  return byDay;
}

/** No mobile, o painel do dia fica abaixo do mês: rola até ele após escolher um dia. */
function scrollToDayPanel() {
  const panel = document.querySelector(".bcal-panel");
  if (!panel) return;
  const scroller = document.querySelector(".bcal-shell.bcal-full");
  if (scroller) {
    const delta = panel.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTo({ top: scroller.scrollTop + delta - 12, behavior: "smooth" });
  } else {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Calendário mensal com os agendamentos de todos os profissionais e o painel do dia. */
export function CalendarSection() {
  const db = useDb();
  const { calendarMonth, setCalendarMonth, calendarDay, setCalendarDay } = useAdminState();
  const { openDetails, openManual } = useBookingModals();
  const { isOpen: overlayOpen } = useOverlay();
  const { full, toggle } = useFullscreenCalendar(overlayOpen);
  const [scrollRequest, setScrollRequest] = useState(0);
  const today = todayIso();

  useEffect(() => {
    if (!scrollRequest || !window.matchMedia(MOBILE_QUERY).matches) return;
    const frame = requestAnimationFrame(scrollToDayPanel);
    return () => cancelAnimationFrame(frame);
  }, [scrollRequest]);

  const { year: y, month: m } = parseMonthKey(calendarMonth);
  const byDay = bookingsByDay(activeBookings(db));
  const monthCount = Object.entries(byDay)
    .filter(([d]) => d.startsWith(calendarMonth))
    .reduce((n, [, list]) => n + list.length, 0);
  const currentYear = Number(today.slice(0, 4));
  const years = [
    ...new Set([currentYear - 1, currentYear, currentYear + 1, currentYear + 2, y]),
  ].sort();

  const setMonth = (year: number, monthIndex: number) =>
    setCalendarMonth(monthKey(year, monthIndex));
  const goToday = () => {
    setCalendarMonth(today.slice(0, 7));
    setCalendarDay(today);
  };
  const selectDay = (day: string) => {
    setCalendarDay(day);
    setCalendarMonth(day.slice(0, 7));
    setScrollRequest((n) => n + 1);
  };

  const leading = firstWeekdayOfMonth(y, m);
  const total = daysInMonth(y, m);
  const trailing = (7 - ((leading + total) % 7)) % 7;
  const blank = (key: string) => (
    <div key={key} className="bcal-day blank" aria-hidden="true"></div>
  );

  return (
    <>
      {!full && (
        <PageHead
          title="Calendário"
          subtitle="Todos os agendamentos do mês, de todos os profissionais, em um só lugar."
          actionsClassName="bf-calendar-actions"
        >
          <Button variant="ghost" className="bf-today-btn" onClick={goToday}>
            Hoje
          </Button>
          <Button variant="primary" onClick={() => openManual(calendarDay)}>
            <Icon name="plus" /> Novo agendamento
          </Button>
        </PageHead>
      )}
      <section
        className={full ? "bcal-shell bcal-full" : "bcal-shell"}
        aria-label="Calendário de agendamentos"
      >
        <div className="bcal-toolbar">
          <div className="bcal-nav">
            <Button
              type="button"
              small
              onClick={() => setMonth(y, m - 2)}
              aria-label="Mês anterior"
            >
              <Icon name="chevLeft" />
            </Button>
            <select
              aria-label="Mês"
              value={m - 1}
              onChange={(e) => setMonth(y, Number(e.target.value))}
            >
              {MONTHS.map((name, i) => (
                <option key={name} value={i}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="Ano"
              value={y}
              onChange={(e) => setMonth(Number(e.target.value), m - 1)}
            >
              {years.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <Button type="button" small onClick={() => setMonth(y, m)} aria-label="Próximo mês">
              <Icon name="chevRight" />
            </Button>
            {full && (
              <Button
                type="button"
                small
                variant="ghost"
                className="bf-today-btn"
                onClick={goToday}
              >
                Hoje
              </Button>
            )}
          </div>
          <div className="bcal-legend">
            <span>
              <i className="bcal-dot scheduled"></i>Confirmado
            </span>
            <span>
              <i className="bcal-dot pending"></i>Pendente
            </span>
            <span>
              <i className="bcal-dot done"></i>Concluído
            </span>
            <b className="bcal-total">{`${monthCount} no mês`}</b>
          </div>
          <Button
            type="button"
            small
            className="bcal-full-btn"
            onClick={toggle}
            aria-pressed={full}
            title={full ? "Sair da tela cheia" : "Maximizar calendário"}
          >
            <Icon name={full ? "minimize" : "maximize"} />
            <span>{full ? "Minimizar" : "Maximizar"}</span>
          </Button>
        </div>
        <div className="bcal-body">
          <div className="bcal-main">
            <div className="bcal-weekdays">
              {WEEKDAYS_SHORT.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="bcal-grid">
              {Array.from({ length: leading }, (_, i) => blank(`lead${i}`))}
              {Array.from({ length: total }, (_, i) => {
                const date = `${calendarMonth}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <DayCell
                    key={date}
                    day={i + 1}
                    date={date}
                    monthName={MONTHS[m - 1] ?? ""}
                    today={today}
                    selected={date === calendarDay}
                    bookings={byDay[date] || []}
                    notices={db.notices.filter((n) => n.date === date)}
                    onSelect={selectDay}
                    onOpenBooking={openDetails}
                  />
                );
              })}
              {Array.from({ length: trailing }, (_, i) => blank(`trail${i}`))}
            </div>
          </div>
          <DayPanel
            date={calendarDay}
            bookings={byDay[calendarDay] || []}
            notices={db.notices.filter((n) => n.date === calendarDay)}
            onNew={() => openManual(calendarDay)}
            onOpenBooking={openDetails}
          />
        </div>
      </section>
    </>
  );
}
