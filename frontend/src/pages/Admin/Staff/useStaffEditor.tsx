import { useCallback } from "react";
import { StaffEditor } from "./StaffEditor";
import type { StaffDraft } from "./StaffEditor/types";
import { useBarberData } from "@/hooks/useBarberData";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { findStaff } from "@/scripts/scheduling";
import type { Staff } from "@/types/barber";
import { toMinutes } from "@/utils/date";
import { uid } from "@/utils/format";

/** Abre o cadastro/edição de profissional (usado em Profissionais e em Horários da semana). */
export function useStaffEditor() {
  const { db, update } = useBarberData();
  const { openModal, closeModal } = useOverlay();

  return useCallback(
    (id?: string) => {
      const current = id && db ? findStaff(db, id) : undefined;
      const save = (draft: StaffDraft) => {
        if (!draft.name || toMinutes(draft.start) >= toMinutes(draft.end) || !draft.days.length)
          return notifyError("Confira expediente e dias de atendimento.");
        const { photo, ...fields } = draft;
        update((state) => {
          const existing = id ? state.staff.find((p) => p.id === id) : undefined;
          const data: Staff = { id: id || uid(), ...fields };
          if (photo !== undefined) data.photo = photo;
          // Ajustes semanais são mantidos na edição do expediente padrão.
          if (existing) Object.assign(existing, data, { weekly: existing.weekly || {} });
          else state.staff.push(data);
        });
        closeModal();
        notify("Profissional atualizado!");
      };
      openModal(
        id ? "Editar profissional" : "Novo profissional",
        <StaffEditor staff={current} onSubmit={save} onCancel={closeModal} />,
      );
    },
    [db, update, openModal, closeModal],
  );
}
