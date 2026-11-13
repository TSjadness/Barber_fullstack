import { useCallback, useState } from "react";
import { ContactStep } from "./components/ContactStep";
import { DateTimeStep } from "./components/DateTimeStep";
import { ProfessionalStep } from "./components/ProfessionalStep";
import { ServiceStep } from "./components/ServiceStep";
import { useConfirmBooking } from "./useConfirmBooking";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useNavigation } from "@/hooks/useNavigation";
import type { BookingFlow, BookingStep } from "@/types/barber";
import { cx } from "@/utils/classNames";

const STEPS = ["Serviço", "Profissional", "Data e hora", "Confirmação"] as const;

/** Agendamento do cliente em quatro passos: serviço, profissional, data/hora e contato. */
export function BookingPage() {
  const { bookingEntry } = useNavigation();
  const [flow, setFlowState] = useState<BookingFlow>(bookingEntry.flow);
  const [step, setStep] = useState<BookingStep>(bookingEntry.step);
  const setFlow = useCallback(
    (patch: Partial<BookingFlow>) => setFlowState((f) => ({ ...f, ...patch })),
    [],
  );
  const confirm = useConfirmBooking(flow, setFlow, setStep);
  const stepProps = { flow, setFlow, goToStep: setStep };

  return (
    // A troca de passo recria a área para repetir a animação de entrada.
    <div key={step} className="booking-area bf-enter">
      <span className="eyebrow">AGENDE EM POUCOS PASSOS</span>
      <h1 style={{ fontSize: 34, margin: "10px 0 25px" }}>Seu próximo corte começa aqui.</h1>
      <div className="steps">
        {STEPS.map((name, i) => (
          <div key={name} className={cx("step", step >= i + 1 && "active")}>
            {`${i + 1}. ${name}`}
          </div>
        ))}
      </div>
      {step === 1 && <ServiceStep {...stepProps} />}
      {step === 2 && <ProfessionalStep {...stepProps} />}
      {step === 3 && <DateTimeStep {...stepProps} />}
      {step === 4 && <ContactStep {...stepProps} />}
      <div className="booking-foot">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep((step - 1) as BookingStep)}>
            <Icon name="arrowLeft" /> Voltar
          </Button>
        ) : (
          <span></span>
        )}
        {step === 1 && (
          <Button variant="primary" disabled={!flow.serviceIds.length} onClick={() => setStep(2)}>
            Continuar <Icon name="arrowRight" />
          </Button>
        )}
        {step === 3 && (
          <Button variant="primary" disabled={!flow.time} onClick={() => setStep(4)}>
            Continuar <Icon name="arrowRight" />
          </Button>
        )}
        {step === 4 && (
          <Button variant="primary" onClick={confirm}>
            Confirmar horário <Icon name="check" />
          </Button>
        )}
      </div>
    </div>
  );
}
