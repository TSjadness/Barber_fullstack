import { Icon } from "@/components/Icon";
import type { Service } from "@/types/barber";
import { money } from "@/utils/format";
import { serviceIconName } from "@/utils/serviceIcon";

interface ServiceCardProps {
  service: Service;
  index: number;
  onBook: (serviceId: string) => void;
}

/** Cartão do serviço no site público; o cartão inteiro e o botão iniciam o agendamento. */
export function ServiceCard({ service, index, onBook }: ServiceCardProps) {
  return (
    <article className="service-card" onClick={() => onBook(service.id)}>
      <div className="svc-top">
        <div className="service-icon">
          <Icon name={serviceIconName(service)} size="ic-md" />
        </div>
        <span className="svc-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{service.name}</h3>
      <span className="svc-duration">
        <Icon name="clock" />
        {` ${service.duration} min`}
      </span>
      <div className="svc-foot">
        <div className="svc-price">
          <small>A partir de</small>
          <strong>{money(service.price)}</strong>
        </div>
        <button
          className="svc-cta"
          onClick={(e) => {
            e.stopPropagation();
            onBook(service.id);
          }}
          aria-label={`Agendar ${service.name}`}
        >
          Agendar <Icon name="arrowUpRight" />
        </button>
      </div>
    </article>
  );
}
