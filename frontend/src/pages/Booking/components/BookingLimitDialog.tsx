import { Icon } from "@/components/Icon";
import type { LimitReason } from "../bookingLimit";

interface BookingLimitDialogProps {
  reason: LimitReason;
  /** Link do WhatsApp da barbearia com a mensagem pronta; vazio esconde o botão. */
  whatsappHref: string;
  onClose: () => void;
}

const COPY: Record<LimitReason, { message: string; detail: string }> = {
  phone: {
    message: "Você já tem 2 agendamentos ativos com este WhatsApp.",
    detail:
      "Para marcar mais um horário, fale com a barbearia: a equipe confere a disponibilidade para você.",
  },
  ip: {
    message: "Muitas reservas foram feitas desta conexão na última hora.",
    detail:
      "Por segurança, novas reservas pelo site ficam pausadas por um tempo. Fale com a barbearia para concluir o seu agendamento.",
  },
};

/**
 * Modal exibido quando o site recusa a reserva por limite (telefone ou IP). O botão do
 * WhatsApp abre a conversa com a barbearia e uma mensagem com os dados do pedido.
 */
export function BookingLimitDialog({ reason, whatsappHref, onClose }: BookingLimitDialogProps) {
  const copy = COPY[reason];
  return (
    <div
      className="bf-confirm-delete bf-limit-dialog"
      role="alertdialog"
      aria-describedby="bfLimitMessage"
    >
      <div className="bf-confirm-delete-icon" aria-hidden="true">
        <Icon name="calendar" size="ic-lg" />
      </div>
      <p id="bfLimitMessage">
        <strong>{copy.message}</strong>
      </p>
      <p className="muted">
        {whatsappHref
          ? copy.detail
          : "Entre em contato com a barbearia para marcar mais um horário."}
      </p>
      <div
        className={
          whatsappHref
            ? "form-actions bf-confirm-delete-actions"
            : "form-actions bf-confirm-delete-actions bf-limit-single"
        }
      >
        <button type="button" className="btn ghost" onClick={onClose}>
          Fechar
        </button>
        {whatsappHref && (
          <a
            className="btn primary"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Icon name="whatsapp" /> Falar com a barbearia
          </a>
        )}
      </div>
    </div>
  );
}
