import { useState } from "react";
import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { useDb } from "@/hooks/useBarberData";
import type { Notice } from "@/types/barber";
import { todayIso } from "@/utils/date";
import { uid } from "@/utils/format";

interface NoticeFormProps {
  notice: Notice | undefined;
  onSubmit: (data: Notice) => void;
}

/** Cadastro de aviso: data, título, mensagem, alcance (equipe ou profissional) e tipo. */
export function NoticeForm({ notice, onSubmit }: NoticeFormProps) {
  const db = useDb();
  const [date, setDate] = useState(notice?.date ?? todayIso());
  const [title, setTitle] = useState(notice?.title ?? "");
  const [detail, setDetail] = useState(notice?.detail ?? "");
  const [staffId, setStaffId] = useState(
    notice && db.staff.some((p) => p.id === notice.staffId) ? notice.staffId : "all",
  );
  const [type, setType] = useState(notice?.type === "info" ? "info" : "block");

  const submit = () =>
    onSubmit({
      id: notice?.id || uid(),
      date,
      staffId,
      type,
      title: title.trim(),
      detail: detail.trim(),
    });

  return (
    <Form onSubmit={submit}>
      <label>
        Data
        <input
          type="date"
          id="fDate"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        Título
        <input
          id="fTitle"
          value={title}
          placeholder="Ex.: Não haverá expediente"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Mensagem ao cliente
        <textarea
          id="fDetail"
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </label>
      <label>
        Aplicar para
        <select id="fStaff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
          <option value="all">Barbearia inteira</option>
          {db.staff.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tipo
        <select id="fType" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="block">Bloquear agendamentos na data</option>
          <option value="info">Somente mostrar aviso (sem bloquear)</option>
        </select>
      </label>
      <p className="muted">
        Bloqueios não cancelam automaticamente agendamentos já existentes; revise-os manualmente.
      </p>
      <Button variant="primary" type="submit">
        Salvar aviso
      </Button>
    </Form>
  );
}
