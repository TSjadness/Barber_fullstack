/**
 * Funcionalidade: Planilha financeira (CSV)
 *
 * Responsabilidade:
 * Gerar e baixar o CSV dos atendimentos (separador `;`, BOM UTF-8, valores com
 * vírgula decimal, compatível com o Excel) e analisar arquivos CSV importados,
 * conferindo se vieram de uma exportação do BarberFlow.
 *
 * Origem:
 * Funções `exportFinance` e `previewFinanceImport` anteriormente implementadas
 * no arquivo public/barber/app.js.
 */
import { bookingTotal, findStaff } from "./scheduling";
import type { AppState } from "@/types/barber";

const COLUMNS = [
  "ID",
  "Data",
  "Hora",
  "Cliente",
  "Telefone",
  "Serviço",
  "Profissional",
  "Valor (R$)",
  "Status",
  "Pago",
  "Forma pagamento",
];

export const MAX_IMPORT_BYTES = 2_000_000;

/** Marca de ordem de bytes UTF-8: faz o Excel abrir acentos corretamente. */
const BOM = String.fromCharCode(0xfeff);

const quote = (v: unknown) => '"' + String(v ?? "").replaceAll('"', '""') + '"';

export function buildFinanceCsv(db: AppState) {
  const rows = db.bookings.map((b) => {
    const total = bookingTotal(db, b);
    return [
      b.id,
      b.date,
      b.time,
      b.customer,
      b.phone,
      total?.name || "",
      findStaff(db, b.staffId)?.name || "",
      (total?.price || 0).toFixed(2).replace(".", ","),
      b.status,
      b.paid ? "Sim" : "Não",
      b.paymentMethod || "",
    ];
  });
  return BOM + [COLUMNS, ...rows].map((row) => row.map(quote).join(";")).join("\r\n");
}

/** Baixa o CSV no navegador como `barberflow-financeiro-AAAA-MM-DD.csv`. */
export function downloadFinanceCsv(db: AppState, today: string) {
  const blob = new Blob([buildFinanceCsv(db)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "barberflow-financeiro-" + today + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ImportAnalysis = { ok: true; records: number } | { ok: false; message: string };

/** Lê o CSV escolhido e informa quantos registros ele possui. Nenhum dado é alterado. */
export function analyzeFinanceFile(file: File): Promise<ImportAnalysis> {
  if (file.size > MAX_IMPORT_BYTES)
    return Promise.resolve({ ok: false, message: "Arquivo excede 2 MB." });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const rows = (text.startsWith(BOM) ? text.slice(1) : text).trim().split(/\r?\n/);
      const header = rows.shift() || "";
      if (!header.includes("ID") || !header.includes("Cliente"))
        resolve({ ok: false, message: "Arquivo incompatível com exportação do BarberFlow." });
      else resolve({ ok: true, records: rows.length });
    };
    reader.readAsText(file, "utf-8");
  });
}
