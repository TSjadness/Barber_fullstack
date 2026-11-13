import type { Staff } from "@/types/barber";

/** Dados do formulário; `photo` undefined mantém a foto atual e "" remove a foto. */
export interface StaffDraft {
  name: string;
  role: string;
  start: string;
  end: string;
  days: number[];
  active: boolean;
  photo: string | undefined;
}

export interface StaffEditorProps {
  staff: Staff | undefined;
  onSubmit: (draft: StaffDraft) => void;
  onCancel: () => void;
}
