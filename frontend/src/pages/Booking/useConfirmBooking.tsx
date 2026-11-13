import { useCallback, useRef } from "react";
import { LIMIT_TITLE, isLimitReason, limitWhatsAppLink, limitWhatsAppText } from "./bookingLimit";
import { BookingConfirmed } from "./components/BookingConfirmed";
import { BookingLimitDialog } from "./components/BookingLimitDialog";
import { useBarberData } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { findStaff, openSlots, serviceList, serviceTotal } from "@/scripts/scheduling";
import { isNetworkError, messageOf, reasonOf, statusOf } from "@/services/api";
import { sleep } from "@/services/api/retry";
import { createPublicBooking } from "@/services/bookingService";
import type { BookingFlow, BookingStep } from "@/types/barber";
import { isFullName, onlyDigits } from "@/utils/format";

/** Tempo mínimo da tela "Estamos confirmando" para a troca não parecer um piscar. */
const MIN_CONFIRM_MS = 1800;

/**
 * Valida o pedido do cliente, envia a reserva e mostra a confirmação. Se outra pessoa
 * reservou o horário primeiro (409), atualiza a disponibilidade e volta para a escolha
 * de horário mantendo nome e WhatsApp.
 */
export function useConfirmBooking(
  flow: BookingFlow,
  setFlow: (patch: Partial<BookingFlow>) => void,
  goToStep: (step: BookingStep) => void,
) {
  const { db, updateLocal, reloadPublic } = useBarberData();
  const { go } = useNavigation();
  const { show, showBusy, openModal, closeModal } = useOverlay();
  const submitting = useRef(false);

  return useCallback(async () => {
    if (!db || submitting.current) return;
    const customer = flow.customer.trim();
    const phone = flow.phone.trim();
    const { date, time, confirmStaff } = flow;
    if (!isFullName(customer)) return notifyError("Informe nome e sobrenome (somente letras).");
    if (!/^\d{10,11}$/.test(onlyDigits(phone)))
      return notifyError("Informe um WhatsApp válido com DDD.");
    if (
      !date ||
      !time ||
      !confirmStaff ||
      !openSlots(db, date, confirmStaff, flow.serviceIds).includes(time)
    )
      return notifyError("Este horário ficou indisponível. Escolha outro.");

    submitting.current = true;
    const startedAt = Date.now();
    showBusy(
      "Estamos confirmando seu pedido",
      "Verificando a disponibilidade e reservando seu horário...",
    );
    try {
      const booking = await createPublicBooking({
        date,
        time,
        customer,
        phone,
        serviceId: flow.serviceIds[0] ?? "",
        serviceIds: flow.serviceIds,
        staffId: confirmStaff,
      });
      updateLocal((draft) => {
        draft.bookings.push(booking);
      });
      await sleep(Math.max(0, MIN_CONFIRM_MS - (Date.now() - startedAt)));
      show(
        <BookingConfirmed
          customer={customer}
          total={serviceTotal(db, flow.serviceIds)}
          date={date}
          time={time}
          staffName={findStaff(db, confirmStaff)?.name}
          onFinish={() => {
            closeModal();
            go("public");
          }}
        />,
      );
    } catch (e) {
      closeModal();
      console.error("[BarberFlow] Falha na confirmação:", e);
      const status = statusOf(e) ?? 0;
      const reason = reasonOf(e);
      if (status === 403 && isLimitReason(reason)) {
        // Limite de reservas: modal com atalho para o WhatsApp da barbearia. O pedido
        // (nome, WhatsApp, serviços e horário) continua preenchido ao fechar.
        const text = limitWhatsAppText(reason, {
          customer,
          services: serviceList(db, flow.serviceIds).map((s) => s.name),
          date,
          time,
          staffName: findStaff(db, confirmStaff)?.name,
        });
        openModal(
          LIMIT_TITLE[reason],
          <BookingLimitDialog
            reason={reason}
            whatsappHref={limitWhatsAppLink(db.shop.whatsapp, text)}
            onClose={closeModal}
          />,
        );
        return;
      }
      if (isNetworkError(e) || status >= 500 || !messageOf(e)) {
        notify(
          "Não foi possível confirmar o agendamento. Confira sua conexão e tente novamente.",
          true,
        );
      } else if (status === 409) {
        notify(messageOf(e) + " Escolha outro horário.", true);
        setFlow({ time: null });
        goToStep(3);
        try {
          await reloadPublic();
        } catch {
          /* mantém a disponibilidade atual */
        }
      } else {
        notify(messageOf(e), true);
      }
    } finally {
      submitting.current = false;
    }
  }, [
    db,
    flow,
    setFlow,
    goToStep,
    updateLocal,
    reloadPublic,
    go,
    show,
    showBusy,
    openModal,
    closeModal,
  ]);
}
