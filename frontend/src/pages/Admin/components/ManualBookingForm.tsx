import { useState } from "react";
import { Button } from "@/components/Button";
import { Form, FormRow } from "@/components/Form";
import { useDb } from "@/hooks/useBarberData";
import { money } from "@/utils/format";

export interface ManualBookingData {
  customer: string;
  phone: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
}

interface ManualBookingFormProps {
  date: string;
  time: string;
  staffId: string;
  onSubmit: (data: ManualBookingData) => void;
}

/** Agendamento lançado pela gestão (telefone, balcão, encaixe). */
export function ManualBookingForm({
  date: initialDate,
  time: initialTime,
  staffId: initialStaff,
  onSubmit,
}: ManualBookingFormProps) {
  const db = useDb();
  const services = db.services.filter((x) => x.active);
  const staff = db.staff.filter((x) => x.active);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [staffId, setStaffId] = useState(
    staff.some((x) => x.id === initialStaff) ? initialStaff : (staff[0]?.id ?? ""),
  );
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime || "09:00");

  return (
    <Form
      onSubmit={() =>
        onSubmit({ customer: customer.trim(), phone: phone.trim(), serviceId, staffId, date, time })
      }
    >
      <label>
        Nome do cliente
        <input
          id="mCustomer"
          required
          placeholder="Nome completo"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </label>
      <label>
        Telefone
        <input
          id="mPhone"
          placeholder="(79) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <FormRow>
        <label>
          Serviço
          <select id="mService" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {`${s.name} • ${money(s.price)}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Profissional
          <select id="mStaff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            {staff.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
      </FormRow>
      <FormRow>
        <label>
          Data
          <input
            type="date"
            id="mDate"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Horário
          <input
            type="time"
            id="mTime"
            value={time}
            required
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </FormRow>
      <p className="muted">O sistema verifica jornada, avisos e conflitos antes de salvar.</p>
      <Button variant="primary" type="submit">
        Criar agendamento
      </Button>
    </Form>
  );
}
