import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { RowAction, RowActions } from "@/components/RowActions";
import { StatusBadge } from "@/components/StatusBadge";
import { useDb } from "@/hooks/useBarberData";
import { bookingTotal, findStaff, isFinancialRecord } from "@/scripts/scheduling";
import type { Booking } from "@/types/barber";
import { shortDate } from "@/utils/date";
import { money } from "@/utils/format";

interface BookingsTableProps {
  rows: Booking[];
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Tabela de agendamentos com data/hora, cliente, serviço, profissional, valor e status. */
export function BookingsTable({ rows, onDetails, onEdit, onCancel, onDelete }: BookingsTableProps) {
  const db = useDb();
  return (
    <DataTable>
      <thead>
        <tr>
          <th>Data / hora</th>
          <th>Cliente</th>
          <th>Serviço</th>
          <th>Profissional</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((b) => {
            const total = bookingTotal(db, b);
            const cancelled = b.status === "cancelado";
            const locked = isFinancialRecord(b);
            return (
              <tr key={b.id}>
                <td>
                  {shortDate(b.date)}
                  <br />
                  <b>{b.time}</b>
                </td>
                <td>{b.customer}</td>
                <td>{total?.name || "Serviço removido"}</td>
                <td>{findStaff(db, b.staffId)?.name || "—"}</td>
                <td className="price">{money(total?.price)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td className="bf-row-actions-cell">
                  <RowActions>
                    <RowAction
                      icon="list"
                      label="Detalhes"
                      title={`Detalhes do agendamento de ${b.customer}`}
                      onClick={() => onDetails(b.id)}
                    />
                    <RowAction
                      icon="pencil"
                      label="Editar"
                      title={`Editar agendamento de ${b.customer}`}
                      onClick={() => onEdit(b.id)}
                    />
                    <RowAction
                      icon="ban"
                      label="Cancelar"
                      title={
                        cancelled
                          ? "Agendamento já cancelado"
                          : `Cancelar agendamento de ${b.customer}`
                      }
                      disabled={cancelled}
                      onClick={() => onCancel(b.id)}
                    />
                    <RowAction
                      icon="trash"
                      label="Excluir"
                      variant="danger"
                      title={
                        locked
                          ? "Pagos ou concluídos não podem ser excluídos"
                          : `Excluir agendamento de ${b.customer}`
                      }
                      disabled={locked}
                      onClick={() => onDelete(b.id)}
                    />
                  </RowActions>
                </td>
              </tr>
            );
          })
        ) : (
          <EmptyState as="td" colSpan={7}>
            Nenhum agendamento encontrado.
          </EmptyState>
        )}
      </tbody>
    </DataTable>
  );
}
