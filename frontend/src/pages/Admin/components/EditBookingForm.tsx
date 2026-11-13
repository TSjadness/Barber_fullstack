import { useState } from "react";
import { Button } from "@/components/Button";
import { Form, FormRow } from "@/components/Form";
import { useDb } from "@/hooks/useBarberData";
import type { Booking } from "@/types/barber";

interface EditBookingFormProps {
  booking: Booking;
  onSubmit: (updated: Booking) => void;
}

/** Valor inicial de um select: o atual, se ainda existir entre as opções; senão a primeira opção. */
const initialOption = (current: string, options: Array<{ id: string }>) =>
  options.some((o) => o.id === current) ? current : (options[0]?.id ?? "");

/** Edição de cliente, serviço, profissional, data e horário de um agendamento. */
export function EditBookingForm({ booking: b, onSubmit }: EditBookingFormProps) {
  const db = useDb();
  const services = db.services.filter((x) => x.active || x.id === b.serviceId);
  const staff = db.staff.filter((x) => x.active || x.id === b.staffId);
  const [customer, setCustomer] = useState(b.customer);
  const [phone, setPhone] = useState(b.phone || "");
  const [serviceId, setServiceId] = useState(() => initialOption(b.serviceId, services));
  const [staffId, setStaffId] = useState(() => initialOption(b.staffId, staff));
  const [date, setDate] = useState(b.date);
  const [time, setTime] = useState(b.time);

  const submit = () =>
    onSubmit({
      ...b,
      customer: customer.trim(),
      phone: phone.trim(),
      date,
      time,
      serviceId,
      staffId,
      // Trocar o serviço substitui a lista de serviços (senão a troca não teria efeito
      // em agendamentos com vários serviços).
      ...(b.serviceIds && serviceId !== b.serviceId ? { serviceIds: [serviceId] } : {}),
    });

  return (
    <Form onSubmit={submit}>
      <label>
        Cliente
        <input
          id="editCustomer"
          value={customer}
          required
          onChange={(e) => setCustomer(e.target.value)}
        />
      </label>
      <label>
        Telefone
        <input id="editPhone" value={phone} required onChange={(e) => setPhone(e.target.value)} />
      </label>
      <FormRow>
        <label>
          Serviço
          <select id="editService" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {services.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Profissional
          <select id="editStaff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
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
            id="editDate"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Horário
          <input
            type="time"
            id="editTime"
            value={time}
            required
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </FormRow>
      <p className="muted">A disponibilidade será verificada antes de salvar.</p>
      <Button variant="primary" type="submit">
        Salvar alterações
      </Button>
    </Form>
  );
}
