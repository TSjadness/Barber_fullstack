import { useCallback } from "react";
import { BookingDetails } from "./components/BookingDetails";
import { EditBookingForm } from "./components/EditBookingForm";
import { ManualBookingForm, type ManualBookingData } from "./components/ManualBookingForm";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import {
  isFinancialRecord,
  validateEditedBooking,
  validateManualBooking,
} from "@/scripts/scheduling";
import type { Booking } from "@/types/barber";
import { todayIso } from "@/utils/date";
import { uid } from "@/utils/format";

/**
 * Modais de agendamento da gestão (detalhes, edição, cancelamento, exclusão e
 * agendamento manual), compartilhados por Visão geral, Agenda, Calendário e Agendamentos.
 * Cancelar mantém o registro (status "cancelado"); excluir apaga de verdade e só vale
 * para agendamentos sem histórico financeiro.
 */
export function useBookingModals() {
  const { db, update } = useBarberData();
  const { agendaDate } = useAdminState();
  const { openModal, closeModal } = useOverlay();
  const confirm = useConfirm();

  const patchBooking = useCallback(
    (id: string, patch: Partial<Booking>) =>
      update((draft) => {
        const target = draft.bookings.find((x) => x.id === id);
        if (target) Object.assign(target, patch);
      }),
    [update],
  );

  const openEdit = useCallback(
    (booking: Booking) => {
      const submit = (updated: Booking) => {
        if (!db) return;
        const error = validateEditedBooking(db, updated, todayIso());
        if (error) return notifyError(error);
        patchBooking(booking.id, updated);
        closeModal();
        notify("Agendamento editado!");
      };
      openModal("Editar agendamento", <EditBookingForm booking={booking} onSubmit={submit} />);
    },
    [db, openModal, closeModal, patchBooking],
  );

  const findBooking = useCallback(
    (id: string) => {
      const booking = db?.bookings.find((x) => x.id === id);
      if (!booking) notifyError("Agendamento não encontrado");
      return booking;
    },
    [db],
  );

  const editBooking = useCallback(
    (id: string) => {
      const booking = findBooking(id);
      if (booking) openEdit(booking);
    },
    [findBooking, openEdit],
  );

  /** Cancela mantendo o registro: o horário volta a ficar livre para reservas. */
  const cancelBooking = useCallback(
    (id: string) => {
      const booking = findBooking(id);
      if (!booking) return;
      if (booking.status === "cancelado") return notifyError("Este agendamento já está cancelado.");
      confirm({
        title: "Cancelar agendamento",
        icon: "ban",
        confirmLabel: "Cancelar agendamento",
        cancelLabel: "Voltar",
        message: (
          <>
            Cancelar o agendamento de <strong>{booking.customer}</strong>?
          </>
        ),
        detail:
          "O horário ficará disponível para novas reservas. O registro continua no histórico.",
        onConfirm: () => {
          patchBooking(id, { status: "cancelado" });
          notify("Agendamento cancelado. Histórico preservado.");
        },
      });
    },
    [findBooking, confirm, patchBooking],
  );

  /** Exclusão definitiva, pedida ao servidor por `deletedBookingIds`. */
  const deleteBooking = useCallback(
    (id: string) => {
      const booking = findBooking(id);
      if (!booking) return;
      if (isFinancialRecord(booking))
        return notifyError(
          "Agendamentos pagos ou concluídos fazem parte do histórico financeiro e não podem ser excluídos.",
        );
      confirm({
        title: "Excluir agendamento",
        message: (
          <>
            O agendamento de <strong>{booking.customer}</strong> será excluído.
          </>
        ),
        detail:
          "A exclusão apaga o registro definitivamente. Para apenas liberar o horário e manter o histórico, use Cancelar.",
        onConfirm: () => {
          update(
            (draft) => {
              draft.bookings = draft.bookings.filter((x) => x.id !== id);
            },
            { deletedBookingIds: [id] },
          );
          notify("Agendamento excluído.");
        },
      });
    },
    [findBooking, confirm, update],
  );

  const openDetails = useCallback(
    (id: string) => {
      const booking = findBooking(id);
      if (!booking) return;
      openModal(
        "Detalhes do atendimento",
        <BookingDetails
          booking={booking}
          onSave={(changes) => {
            patchBooking(id, changes);
            closeModal();
            notify("Atendimento atualizado!");
          }}
          onEdit={() => openEdit(booking)}
          onCancel={() => cancelBooking(id)}
        />,
      );
    },
    [findBooking, openModal, closeModal, patchBooking, openEdit, cancelBooking],
  );

  const openManual = useCallback(
    (date: string = agendaDate, time = "", staffId = "") => {
      const submit = (data: ManualBookingData) => {
        if (!db) return;
        const booking: Booking = {
          id: uid(),
          ...data,
          status: "confirmado",
          paid: false,
          paymentMethod: null,
        };
        const error = validateManualBooking(db, booking);
        if (error) return notifyError(error);
        update((draft) => {
          draft.bookings.push(booking);
        });
        closeModal();
        notify("Agendamento criado!");
      };
      openModal(
        "Agendamento manual",
        <ManualBookingForm date={date} time={time} staffId={staffId} onSubmit={submit} />,
      );
    },
    [db, agendaDate, update, openModal, closeModal],
  );

  return { openDetails, openManual, editBooking, cancelBooking, deleteBooking };
}
