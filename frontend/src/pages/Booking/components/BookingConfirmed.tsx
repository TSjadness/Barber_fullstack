import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ConfirmLayer } from "@/components/LoadingOverlay";
import { SummaryBox } from "@/components/SummaryBox";
import type { ServiceTotal } from "@/types/barber";
import { prettyDate } from "@/utils/date";
import { money } from "@/utils/format";

interface BookingConfirmedProps {
  customer: string;
  total: ServiceTotal | null;
  date: string;
  time: string;
  staffName: string | undefined;
  onFinish: () => void;
}

/** Confirmação exibida sobre a página depois que a reserva foi gravada. */
export function BookingConfirmed({
  customer,
  total,
  date,
  time,
  staffName,
  onFinish,
}: BookingConfirmedProps) {
  return (
    <ConfirmLayer role="dialog">
      <div className="confirm-check">
        <Icon name="check" size="ic-lg" />
      </div>
      <h2>Seu pedido foi confirmado!</h2>
      <p className="muted">{`${customer}, seu horário foi reservado com sucesso.`}</p>
      <SummaryBox>
        <strong>{`${total?.name ?? ""} · ${money(total?.price)}`}</strong>
        <span>
          <Icon name="calendar" />
          {` ${prettyDate(date)} às ${time}`}
        </span>
        <span>
          <Icon name="scissors" />
          {` Profissional: ${staffName ?? ""}`}
        </span>
        <span>Pagamento diretamente na barbearia.</span>
      </SummaryBox>
      <Button variant="primary" style={{ width: "100%" }} onClick={onFinish}>
        Concluir e voltar ao início <Icon name="arrowRight" />
      </Button>
    </ConfirmLayer>
  );
}
