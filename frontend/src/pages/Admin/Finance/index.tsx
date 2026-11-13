import { ImportFinance } from "./components/ImportFinance";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { ManageRow } from "@/components/ManageRow";
import { PageHead } from "@/components/PageHead";
import { useDb } from "@/hooks/useBarberData";
import { useOverlay } from "@/hooks/useOverlay";
import { downloadFinanceCsv } from "@/scripts/financeSpreadsheet";
import { notify } from "@/scripts/notifications";
import { activeBookings, bookingPrice } from "@/scripts/scheduling";
import { addDays, prettyDate, todayIso } from "@/utils/date";
import { money } from "@/utils/format";

function Stat({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{hint}</span>
    </div>
  );
}

/** Financeiro: recebido, a receber, gráfico dos últimos 7 dias, pagamentos e planilha CSV. */
export function FinanceSection() {
  const db = useDb();
  const { openModal } = useOverlay();
  const today = todayIso();
  const paid = db.bookings.filter((b) => b.paid);
  const totalPaid = paid.reduce((a, b) => a + bookingPrice(db, b), 0);
  const toReceive = activeBookings(db)
    .filter((b) => !b.paid)
    .reduce((a, b) => a + bookingPrice(db, b), 0);
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const counts = last7.map((d) =>
    paid.filter((b) => b.date === d).reduce((a, b) => a + bookingPrice(db, b), 0),
  );
  const max = Math.max(1, ...counts);

  const exportCsv = () => {
    downloadFinanceCsv(db, today);
    notify("Planilha exportada. Abre no Excel.");
  };

  return (
    <>
      <PageHead
        title="Financeiro"
        subtitle="Receitas recebidas, pendentes e formas de pagamento."
        actionsClassName="bf-finance-actions"
      >
        <Button variant="primary" onClick={exportCsv}>
          <Icon name="download" /> Exportar para Excel (CSV)
        </Button>
        <Button onClick={() => openModal("Importar planilha", <ImportFinance />)}>
          <Icon name="upload" /> Importar CSV
        </Button>
      </PageHead>
      <div className="stats">
        <Stat label="Recebido" value={money(totalPaid)} hint="Pagamentos confirmados" />
        <Stat label="A receber" value={money(toReceive)} hint="Agendamentos ativos" />
        <Stat label="Serviços pagos" value={paid.length} hint="Atendimentos registrados" />
        <Stat
          label="Ticket médio"
          value={money(paid.length ? totalPaid / paid.length : 0)}
          hint="Por atendimento pago"
        />
      </div>
      <div className="two-cols">
        <Card>
          <h3>Entradas — últimos 7 dias</h3>
          <div className="bar-chart">
            {counts.map((v, i) => (
              <div
                key={last7[i]}
                className="bar"
                title={money(v)}
                style={{ height: `${Math.max(3, (170 * v) / max)}px` }}
              >
                <span>{last7[i]?.slice(8)}</span>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 35 }}>
            Gráfico baseado nos pagamentos registrados no protótipo.
          </p>
        </Card>
        <Card>
          <h3>Pagamentos recentes</h3>
          {paid.length ? (
            paid
              .slice()
              .reverse()
              .map((b) => (
                <ManageRow key={b.id}>
                  <div>
                    <strong>{b.customer}</strong>
                    <p>{`${prettyDate(b.date)} • ${b.paymentMethod || "Pagamento"}`}</p>
                  </div>
                  <strong className="price">{money(bookingPrice(db, b))}</strong>
                </ManageRow>
              ))
          ) : (
            <EmptyState>
              Nenhum pagamento registrado. Marque um atendimento como pago na agenda ou nos
              detalhes.
            </EmptyState>
          )}
        </Card>
      </div>
    </>
  );
}
