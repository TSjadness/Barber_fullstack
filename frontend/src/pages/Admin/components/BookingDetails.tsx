import { useState } from "react";
import { Button } from "@/components/Button";
import { FormRow, FormStack, ToggleField } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { SummaryBox } from "@/components/SummaryBox";
import { BOOKING_STATUS_OPTIONS, PAYMENT_METHODS } from "@/constants/barber";
import { useDb } from "@/hooks/useBarberData";
import { bookingTotal, findStaff } from "@/scripts/scheduling";
import type { Booking } from "@/types/barber";
import { prettyDate } from "@/utils/date";
import { money, phoneLabel } from "@/utils/format";

interface BookingDetailsProps {
  booking: Booking;
  onSave: (changes: Pick<Booking, "status" | "paid" | "paymentMethod">) => void;
  onEdit: () => void;
  onCancel: () => void;
}

/** Detalhes do atendimento: status, pagamento, edição e cancelamento. */
export function BookingDetails({ booking: b, onSave, onEdit, onCancel }: BookingDetailsProps) {
  const db = useDb();
  const total = bookingTotal(db, b);
  const [status, setStatus] = useState(b.status);
  const [paid, setPaid] = useState(b.paid);
  const [method, setMethod] = useState<string>(
    PAYMENT_METHODS.find((m) => m === b.paymentMethod) ?? PAYMENT_METHODS[0],
  );

  return (
    <>
      <SummaryBox>
        <strong>{b.customer}</strong>
        <span>{b.phone ? phoneLabel(b.phone) : "Telefone não informado"}</span>
        <span>{`${prettyDate(b.date)} às ${b.time}`}</span>
        <span>{`${total?.name || "Serviço"} • ${money(total?.price)}`}</span>
        <span>{`Profissional: ${findStaff(db, b.staffId)?.name || "—"}`}</span>
      </SummaryBox>
      <FormStack style={{ marginTop: 18 }}>
        <label>
          Status
          <select
            id="dStatus"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              // Atendimento concluído normalmente já foi pago.
              if (e.target.value === "concluido") setPaid(true);
            }}
          >
            {BOOKING_STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <ToggleField id="dPaid" checked={paid} onChange={setPaid}>
          {" "}
          Pagamento recebido
        </ToggleField>
        <label>
          Forma de pagamento
          <select id="dMethod" value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <FormRow>
          <Button
            variant="primary"
            onClick={() => onSave({ status, paid, paymentMethod: paid ? method : null })}
          >
            Salvar status
          </Button>
          <Button onClick={onEdit}>
            <Icon name="pencil" /> Editar agendamento
          </Button>
        </FormRow>
        <Button variant="danger" onClick={onCancel}>
          Cancelar agendamento
        </Button>
      </FormStack>
    </>
  );
}
