import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icon";
import { useDb } from "@/hooks/useBarberData";
import type { StepProps } from "../types";
import { cx } from "@/utils/classNames";

const personRow = { display: "flex", alignItems: "center", gap: 12 } as const;

/** Passo 2: escolha do profissional (ou sem preferência). */
export function ProfessionalStep({ flow, setFlow, goToStep }: StepProps) {
  const db = useDb();
  const choose = (staffId: string) => {
    setFlow({ staffId });
    goToStep(3);
  };
  return (
    <>
      <h2>Escolha o profissional</h2>
      <p className="muted">Selecione quem vai atender você.</p>
      <div
        className={cx("choice", flow.staffId === "any" && "selected")}
        onClick={() => choose("any")}
      >
        <div>
          <strong>
            <Icon name="users" /> Sem preferência
          </strong>
          <p>Encontre horários com qualquer profissional disponível.</p>
        </div>
        <Icon name="chevRight" />
      </div>
      {db.staff
        .filter((p) => p.active)
        .map((p) => (
          <div
            key={p.id}
            className={cx("choice", flow.staffId === p.id && "selected")}
            onClick={() => choose(p.id)}
          >
            <div style={personRow}>
              <Avatar name={p.name} photo={p.photo} />
              <div>
                <strong>{p.name}</strong>
                <p>{p.role}</p>
              </div>
            </div>
            <Icon name="chevRight" />
          </div>
        ))}
    </>
  );
}
