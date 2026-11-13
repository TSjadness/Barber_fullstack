import { useRef } from "react";
import { Button } from "@/components/Button";
import { FormStack } from "@/components/Form";
import { useOverlay } from "@/hooks/useOverlay";
import { analyzeFinanceFile } from "@/scripts/financeSpreadsheet";
import { notify, notifyError } from "@/scripts/notifications";

/** Importação de CSV: apenas analisa o arquivo e mostra uma prévia, sem alterar dados. */
export function ImportFinance() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { openModal, closeModal } = useOverlay();

  const analyze = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return notifyError("Escolha um CSV.");
    const result = await analyzeFinanceFile(file);
    if (!result.ok) return notifyError(result.message);
    openModal(
      "Prévia da importação",
      <>
        <p>{`Arquivo reconhecido com ${result.records} registro(s).`}</p>
        <p className="notice">
          Importação de registros financeiros ainda exige conciliação manual para evitar duplicatas
          e modificações indevidas. Nenhum registro foi alterado.
        </p>
        <Button variant="primary" onClick={closeModal}>
          Entendi
        </Button>
      </>,
    );
  };

  return (
    <FormStack>
      <p className="muted">
        Importe arquivos CSV exportados pelo BarberFlow. Para segurança, a importação oferece uma
        prévia antes de alterar dados.
      </p>
      <label>
        Arquivo CSV
        <input type="file" id="financeFile" accept=".csv,text/csv" ref={fileInput} />
      </label>
      <Button variant="primary" onClick={analyze}>
        Analisar arquivo
      </Button>
    </FormStack>
  );
}
