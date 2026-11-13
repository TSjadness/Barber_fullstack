import { useState } from "react";
import { BookingsTable } from "./components/BookingsTable";
import { useBookingModals } from "../useBookingModals";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/Card";
import { FilterBar } from "@/components/FilterBar";
import { PageHead } from "@/components/PageHead";
import { Pagination } from "@/components/Pagination";
import { BOOKING_STATUS_OPTIONS } from "@/constants/barber";
import { emptyBookingFilters } from "@/contexts/admin/context";
import { useAdminState } from "@/hooks/useAdminState";
import { useDb } from "@/hooks/useBarberData";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { BookingFilters } from "@/types/app";
import { normalizeSearch } from "@/utils/format";
import { paginate } from "@/utils/pagination";

/** Lista de agendamentos com filtros por data, serviço, profissional, status e cliente. */
export function BookingsSection() {
  const db = useDb();
  const { bookingFilters: bf, setBookingFilters, pages, setPage } = useAdminState();
  const { openDetails, openManual, editBooking, cancelBooking, deleteBooking } = useBookingModals();
  // Valores digitados nos campos; o filtro aplicado (bf) acompanha com atraso só no nome.
  const [draft, setDraft] = useState<BookingFilters>(bf);

  const apply = (next: BookingFilters) => {
    setBookingFilters({ ...next, name: next.name.trim() });
    setPage("bookings", 1);
  };
  const applyTyped = useDebouncedCallback(apply, 250);
  const change = (field: keyof BookingFilters, value: string, typed = false) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (typed) applyTyped(next);
    else apply(next);
  };
  const clear = () => {
    setDraft(emptyBookingFilters());
    apply(emptyBookingFilters());
  };

  const rows = [...db.bookings]
    .filter(
      (b) =>
        (!bf.date || b.date === bf.date) &&
        (!bf.service || (b.serviceIds || [b.serviceId]).includes(bf.service)) &&
        (!bf.staff || b.staffId === bf.staff) &&
        (!bf.status || b.status === bf.status) &&
        (!bf.name || normalizeSearch(b.customer).includes(normalizeSearch(bf.name))),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const active = Object.values(bf).some(Boolean);
  const paged = paginate(rows, pages.bookings);

  return (
    <>
      <PageHead title="Agendamentos" subtitle="Gerencie confirmações, cancelamentos e serviços.">
        <Button variant="primary" onClick={() => openManual()}>
          <Icon name="plus" /> Novo agendamento
        </Button>
      </PageHead>
      <FilterBar active={active} onClear={clear} onSubmit={() => apply(draft)}>
        <label>
          Data
          <input
            type="date"
            id="bfDate"
            value={draft.date}
            onChange={(e) => change("date", e.target.value)}
          />
        </label>
        <label>
          Serviço
          <select
            id="bfService"
            value={draft.service}
            onChange={(e) => change("service", e.target.value)}
          >
            <option value="">Todos</option>
            {db.services.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Profissional
          <select
            id="bfStaff"
            value={draft.staff}
            onChange={(e) => change("staff", e.target.value)}
          >
            <option value="">Todos</option>
            {db.staff.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            id="bfStatus"
            value={draft.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="">Todos</option>
            {BOOKING_STATUS_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cliente
          <input
            id="bfName"
            placeholder="Nome do cliente"
            value={draft.name}
            onChange={(e) => change("name", e.target.value, true)}
          />
        </label>
      </FilterBar>
      <p className="muted filter-count">
        {`${rows.length} agendamento(s) encontrado(s)${active ? " com os filtros aplicados" : ""}.`}
      </p>
      <Card>
        <BookingsTable
          rows={paged.items}
          onDetails={openDetails}
          onEdit={editBooking}
          onCancel={cancelBooking}
          onDelete={deleteBooking}
        />
        <Pagination meta={paged} label="agendamentos" onPage={(n) => setPage("bookings", n)} />
      </Card>
    </>
  );
}
