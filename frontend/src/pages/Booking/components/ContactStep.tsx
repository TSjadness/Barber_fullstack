import type { ChangeEvent } from "react";
import { FormStack } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { SummaryBox } from "@/components/SummaryBox";
import { useDb } from "@/hooks/useBarberData";
import { findStaff, serviceTotal } from "@/scripts/scheduling";
import type { StepProps } from "../types";
import { prettyDate } from "@/utils/date";
import { maskPhoneInput, money, sanitizePersonName } from "@/utils/format";

/** Passo 4: resumo do pedido e contato do cliente (nome e WhatsApp com máscara). */
export function ContactStep({ flow, setFlow }: StepProps) {
  const db = useDb();
  const total = serviceTotal(db, flow.serviceIds);

  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursor = input.selectionStart;
    const cleaned = sanitizePersonName(input.value);
    if (cleaned !== input.value) {
      // Remove o caractere inválido sem levar o cursor para o fim do campo.
      input.value = cleaned;
      if (cursor != null) {
        const pos = Math.min(cursor, cleaned.length);
        input.setSelectionRange(pos, pos);
      }
    }
    setFlow({ customer: cleaned });
  };

  return (
    <>
      <h2>Finalizar agendamento</h2>
      <p className="muted">Confira os dados e informe seu contato.</p>
      <SummaryBox>
        <strong>{`${total?.name ?? ""} · ${money(total?.price)}`}</strong>
        <span>
          <Icon name="clock" />
          {` ${total?.duration ?? ""} minutos`}
        </span>
        <span>
          <Icon name="user" />
          {` ${findStaff(db, flow.confirmStaff)?.name ?? ""}`}
        </span>
        <span>
          <Icon name="calendar" />
          {` ${flow.date ? prettyDate(flow.date) : ""} às ${flow.time ?? ""}`}
        </span>
        <span className="muted">Pagamento diretamente na barbearia.</span>
      </SummaryBox>
      <FormStack style={{ marginTop: 20 }}>
        <label>
          Seu nome completo
          <input
            id="clientName"
            placeholder="Ex.: João Silva"
            autoComplete="name"
            maxLength={100}
            value={flow.customer}
            onChange={onName}
          />
        </label>
        <label>
          Seu WhatsApp
          <input
            id="clientPhone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={15}
            placeholder="(79) 99999-9999"
            value={flow.phone}
            onChange={(e) => setFlow({ phone: maskPhoneInput(e.target.value) })}
          />
        </label>
      </FormStack>
    </>
  );
}
