import { useState, type ChangeEvent } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Form, FormRow } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { WEEKDAYS_SHORT } from "@/constants/barber";
import { notify, notifyError } from "@/scripts/notifications";
import { resizeStaffPhoto } from "@/scripts/staffPhoto";
import type { StaffDraft, StaffEditorProps } from "./types";
import { messageOf } from "@/services/api";

const DEFAULTS = {
  name: "",
  role: "Barbeiro",
  start: "09:00",
  end: "18:00",
  days: [1, 2, 3, 4, 5, 6],
  active: true,
};

/**
 * Cadastro/edição do profissional: foto (opcional), nome, função, expediente padrão,
 * dias de atendimento e status (um único select "Status do profissional" em todas
 * as larguras).
 */
export function StaffEditor({ staff, onSubmit, onCancel }: StaffEditorProps) {
  const base = staff ?? DEFAULTS;
  const [name, setName] = useState(base.name);
  const [role, setRole] = useState(base.role);
  const [start, setStart] = useState(base.start);
  const [end, setEnd] = useState(base.end);
  const [days, setDays] = useState<number[]>(base.days);
  const [active, setActive] = useState(base.active);
  /** undefined = foto mantida; "" = removida; data URL = nova foto. */
  const [photoDraft, setPhotoDraft] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState({ name: base.name, photo: staff?.photo });

  const pickPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const photo = await resizeStaffPhoto(file);
      setPhotoDraft(photo);
      setPreview({ name: "", photo });
    } catch (error) {
      notifyError(messageOf(error));
    }
  };
  const removePhoto = () => {
    setPhotoDraft("");
    setPreview({ name: name || "?", photo: undefined });
  };
  const toggleDay = (day: number, on: boolean) =>
    setDays((current) => (on ? [...current, day] : current.filter((d) => d !== day)));

  const submit = () => {
    const draft: StaffDraft = {
      name: name.trim(),
      role: role.trim(),
      start,
      end,
      days: WEEKDAYS_SHORT.map((_, i) => i).filter((i) => days.includes(i)),
      active,
      photo: photoDraft,
    };
    onSubmit(draft);
  };

  return (
    <Form className="bf-staff-editor" onSubmit={submit}>
      <div className="photo-field bf-staff-photo-field">
        <div className="bf-staff-photo-copy">
          <strong>Foto do profissional</strong>
          <p className="muted">Opcional. Sem foto, aparece a inicial do nome.</p>
        </div>
        <div className="bf-staff-photo-body">
          <div id="staffPhotoPreview" className="bf-staff-photo-preview">
            <Avatar name={preview.name} photo={preview.photo} />
          </div>
          <div className="bf-staff-photo-actions">
            <label className="btn small bf-photo-action" style={{ cursor: "pointer" }}>
              <Icon name="camera" /> <span>Escolher foto</span>
              <input type="file" accept="image/*" hidden onChange={pickPhoto} />
            </label>
            <Button
              type="button"
              small
              variant="ghost"
              className="bf-photo-action"
              onClick={removePhoto}
            >
              <Icon name="trash" /> <span>Remover foto</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="bf-staff-editor-grid">
        <label>
          Nome
          <input id="fName" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Função
          <input id="fRole" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
      </div>
      <FormRow>
        <label>
          Início do expediente
          <input type="time" id="fStart" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          Fim do expediente
          <input type="time" id="fEnd" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </FormRow>
      <div className="bf-staff-days-block">
        <div className="bf-staff-days-heading">
          <span className="bf-staff-days-symbol" aria-hidden="true">
            <Icon name="calendar" />
          </span>
          <div>
            <strong>Dias de atendimento</strong>
            <p>Selecione os dias em que o profissional atende.</p>
          </div>
        </div>
        <div className="bf-staff-days-checks">
          {WEEKDAYS_SHORT.map((label, i) => (
            <label key={label} className="toggle bf-staff-day-option">
              <input
                type="checkbox"
                className="weekday"
                value={i}
                checked={days.includes(i)}
                onChange={(e) => toggleDay(i, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <label className="bf-staff-status-select">
        Status do profissional
        <select
          id="fStatus"
          value={active ? "active" : "inactive"}
          onChange={(e) => setActive(e.target.value === "active")}
        >
          <option value="active">Ativo</option>
          <option value="inactive">Desativado</option>
        </select>
      </label>
      <div className="form-actions bf-staff-editor-actions">
        <Button variant="ghost" className="bf-staff-editor-cancel" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          <Icon name="check" /> Salvar profissional
        </Button>
      </div>
    </Form>
  );
}
