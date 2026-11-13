import { useState } from "react";
import { Button } from "@/components/Button";
import { Form, FormRow, ToggleField } from "@/components/Form";
import type { IconName } from "@/components/Icon";
import { SERVICE_ICON_OPTIONS } from "@/constants/barber";
import type { Service } from "@/types/barber";
import { uid } from "@/utils/format";
import { serviceIconName } from "@/utils/serviceIcon";

interface ServiceFormProps {
  service: Service | undefined;
  onSubmit: (data: Service) => void;
}

/** Cadastro/edição de serviço: nome, duração, valor, ícone e visibilidade no site. */
export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const [name, setName] = useState(service?.name ?? "");
  const [duration, setDuration] = useState(String(service?.duration ?? 30));
  const [price, setPrice] = useState(String(service?.price ?? 40));
  const [icon, setIcon] = useState<IconName>(serviceIconName(service ?? { icon: "scissors" }));
  const [active, setActive] = useState(service?.active ?? true);

  const submit = () =>
    onSubmit({
      id: service?.id || uid(),
      name: name.trim(),
      duration: Number(duration),
      price: Number(price),
      icon: icon || "scissors",
      active,
    });

  return (
    <Form onSubmit={submit}>
      <label>
        Nome
        <input id="fName" required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <FormRow>
        <label>
          Duração em minutos
          <input
            id="fDuration"
            type="number"
            min="10"
            step="10"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
        <label>
          Valor (R$)
          <input
            id="fPrice"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
      </FormRow>
      <label>
        Ícone
        <select
          id="fIcon"
          value={icon}
          onChange={(e) =>
            setIcon(SERVICE_ICON_OPTIONS.find(([key]) => key === e.target.value)?.[0] ?? "scissors")
          }
        >
          {SERVICE_ICON_OPTIONS.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <ToggleField id="fActive" checked={active} onChange={setActive}>
        {" "}
        Serviço ativo e visível no site
      </ToggleField>
      <Button variant="primary" type="submit">
        Salvar serviço
      </Button>
    </Form>
  );
}
