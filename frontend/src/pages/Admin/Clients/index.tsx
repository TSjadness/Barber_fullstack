import { useState } from "react";
import { Card } from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { PageHead } from "@/components/PageHead";
import { RowAction, RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { emptyClientFilters } from "@/contexts/admin/context";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { notify, notifyError } from "@/scripts/notifications";
import { ANONYMIZED_CUSTOMER, bookingPrice, clientKey } from "@/scripts/scheduling";
import type { ClientFilters, ClientSummary } from "@/types/app";
import type { AppState } from "@/types/barber";
import { prettyDate, todayIso } from "@/utils/date";
import { money, normalizeSearch, onlyDigits } from "@/utils/format";
import { paginate } from "@/utils/pagination";

/**
 * Consolida os agendamentos por cliente (mesmo nome, sem diferenciar maiúsculas).
 * Clientes excluídos (anonimizados) não aparecem na lista.
 */
function summarizeClients(db: AppState, staffId: string): ClientSummary[] {
  const map = new Map<string, ClientSummary>();
  db.bookings
    .filter((b) => !b.anonymized && (!staffId || b.staffId === staffId))
    .forEach((b) => {
      const key = clientKey(b.customer);
      let c = map.get(key);
      if (!c) {
        c = { key, name: b.customer, phone: b.phone || "—", count: 0, spent: 0, last: "" };
        map.set(key, c);
      }
      c.count++;
      c.spent += b.paid ? bookingPrice(db, b) : 0;
      if (b.date > c.last) c.last = b.date;
    });
  return [...map.values()];
}

/** Clientes atendidos, com total pago e última visita; busca por nome ou telefone. */
export function ClientsSection() {
  const db = useDb();
  const { update } = useBarberData();
  const confirm = useConfirm();
  const { clientFilters: cf, setClientFilters, pages, setPage } = useAdminState();
  const [draft, setDraft] = useState<ClientFilters>(cf);

  const apply = (next: ClientFilters) => {
    setClientFilters({ ...next, name: next.name.trim() });
    setPage("clients", 1);
  };
  const applyTyped = useDebouncedCallback(apply, 250);
  const clear = () => {
    setDraft(emptyClientFilters());
    apply(emptyClientFilters());
  };

  /**
   * Exclusão por anonimização: nome e telefone saem de todos os agendamentos do cliente,
   * que continuam na agenda e no financeiro como "Cliente removido". Nada é apagado em
   * cascata. Com agendamento futuro ativo, é preciso cancelar antes.
   */
  const remove = (client: ClientSummary) => {
    const today = todayIso();
    const own = (b: AppState["bookings"][number]) =>
      !b.anonymized && clientKey(b.customer) === client.key;
    if (db.bookings.some((b) => own(b) && b.status !== "cancelado" && b.date >= today))
      return notifyError(
        "Este cliente tem agendamentos futuros. Cancele-os antes de excluir o cliente.",
      );
    confirm({
      title: "Excluir cliente",
      message: (
        <>
          Os dados de <strong>{client.name}</strong> serão excluídos.
        </>
      ),
      detail:
        "Nome e telefone serão apagados. Os agendamentos continuam na agenda e no financeiro como “Cliente removido”.",
      onConfirm: () => {
        update((draft) => {
          for (const b of draft.bookings)
            if (own(b)) {
              b.customer = ANONYMIZED_CUSTOMER;
              b.phone = "";
              b.anonymized = true;
            }
        });
        notify("Cliente excluído. Histórico preservado sem dados pessoais.");
      },
    });
  };

  const digits = onlyDigits(cf.name) || "#";
  const list = summarizeClients(db, cf.staff)
    .filter(
      (c) =>
        !cf.name ||
        normalizeSearch(c.name).includes(normalizeSearch(cf.name)) ||
        onlyDigits(c.phone).includes(digits),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const paged = paginate(list, pages.clients);

  return (
    <>
      <PageHead title="Clientes" subtitle="Histórico e relacionamento com seus clientes." />
      <FilterBar
        className="bf-client-filter"
        active={!!(cf.name || cf.staff)}
        onClear={clear}
        onSubmit={() => apply(draft)}
      >
        <label>
          Cliente
          <input
            id="cfName"
            placeholder="Nome ou telefone"
            value={draft.name}
            onChange={(e) => {
              const next = { ...draft, name: e.target.value };
              setDraft(next);
              applyTyped(next);
            }}
          />
        </label>
        <label>
          Atendido por
          <select
            id="cfStaff"
            value={draft.staff}
            onChange={(e) => {
              const next = { ...draft, staff: e.target.value };
              setDraft(next);
              apply(next);
            }}
          >
            <option value="">Todos</option>
            {db.staff.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
      </FilterBar>
      <p className="muted filter-count">{`${list.length} cliente(s) encontrado(s).`}</p>
      <Card>
        <DataTable>
          {/* Sem <thead>: o cabeçalho fica na primeira linha do corpo, como na tabela original. */}
          <tbody>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Agendamentos</th>
              <th>Total pago</th>
              <th>Última visita marcada</th>
              <th>Ações</th>
            </tr>
            {!paged.items.length && (
              <EmptyState as="td" colSpan={6}>
                Nenhum cliente encontrado.
              </EmptyState>
            )}
            {paged.items.map((c) => (
              <tr key={c.key}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.count}</td>
                <td>{money(c.spent)}</td>
                <td>{prettyDate(c.last)}</td>
                <td className="bf-row-actions-cell">
                  <RowActions>
                    <RowAction
                      icon="trash"
                      label="Excluir"
                      variant="danger"
                      title={`Excluir cliente ${c.name}`}
                      onClick={() => remove(c)}
                    />
                  </RowActions>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <Pagination meta={paged} label="clientes" onPage={(n) => setPage("clients", n)} />
      </Card>
    </>
  );
}
