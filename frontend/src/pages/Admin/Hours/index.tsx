import { useState } from "react";
import { DayRow } from "./components/DayRow";
import { useStaffEditor } from "../Staff/useStaffEditor";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/PageHead";
import { WEEKDAYS_LONG } from "@/constants/barber";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { useNavigation } from "@/hooks/useNavigation";
import { notify, notifyError } from "@/scripts/notifications";
import { applyBaseWeek, daySchedule, updateWeekDay } from "@/scripts/scheduling";
import type { DaySchedule, Staff } from "@/types/barber";
import { cx } from "@/utils/classNames";
import { initialOf } from "@/utils/format";

const TITLE = "Horários da semana";
const muted = { margin: "5px 0 0" };

/** Inicial do profissional quando não há foto (ou a imagem falha). */
function PersonPhoto({ person }: { person: Staff }) {
  const [failed, setFailed] = useState(false);
  if (!person.photo || failed) return <>{initialOf(person.name)}</>;
  return <img src={person.photo} alt={person.name} onError={() => setFailed(true)} />;
}

/** Expediente semanal de cada profissional (padrão, personalizado ou fechado por dia). */
export function HoursSection() {
  const db = useDb();
  const { update } = useBarberData();
  const confirm = useConfirm();
  const { setSection } = useNavigation();
  const { hoursStaff, setHoursStaff, expandedHoursDay, setExpandedHoursDay } = useAdminState();
  const editStaff = useStaffEditor();

  const person = db.staff.find((p) => p.id === hoursStaff) || db.staff[0];
  if (!person)
    return (
      <PageHead
        title={TITLE}
        subtitle="Cadastre um profissional antes de configurar o expediente."
      />
    );

  const specs = WEEKDAYS_LONG.map((_, i) => daySchedule(person, i));
  const open = specs.filter((v) => v.mode !== "closed").length;
  const custom = specs.filter((v) => v.mode === "custom").length;

  const changeDay = (day: number, patch: Partial<DaySchedule>) => {
    const preview = structuredClone(person);
    const error = updateWeekDay(preview, day, patch);
    if (error) return notifyError(error);
    update((state) => {
      const target = state.staff.find((p) => p.id === person.id);
      if (target) updateWeekDay(target, day, patch);
    });
    notify("Expediente atualizado no calendário!");
  };
  const resetWeek = () => {
    confirm({
      title: "Aplicar horário padrão",
      icon: "refresh",
      confirmLabel: "Aplicar padrão",
      message: "Aplicar horário padrão de segunda a sábado e fechar domingo?",
      detail: "Horários personalizados desta semana serão substituídos.",
      onConfirm: () => {
        update((state) => {
          const target = state.staff.find((p) => p.id === person.id);
          if (target) applyBaseWeek(target);
        });
        setExpandedHoursDay(null);
        notify("Semana atualizada!");
      },
    });
  };

  return (
    <>
      <PageHead
        title={TITLE}
        subtitle="Organize o expediente de cada barbeiro. As mudanças atualizam os horários disponíveis no site."
      />
      <div className="schedule-layout">
        <section className="schedule-main">
          <div className="schedule-panel">
            <div className="schedule-heading">
              <div>
                <span className="schedule-kicker">01 · SELECIONE O PROFISSIONAL</span>
                <h3>De quem é esta agenda?</h3>
              </div>
              <span className="schedule-subtle">{`${db.staff.length} profissionais`}</span>
            </div>
            <div className="schedule-persons">
              {db.staff.map((p) => (
                <button
                  key={p.id}
                  className={cx("schedule-person", p.id === person.id && "current")}
                  onClick={() => {
                    setHoursStaff(p.id);
                    setExpandedHoursDay(null);
                  }}
                >
                  <span className="schedule-person-avatar">
                    <PersonPhoto person={p} />
                  </span>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.role}</small>
                  </span>
                  <span className="schedule-person-check">
                    {p.id === person.id && <Icon name="check" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="schedule-panel">
            <div className="schedule-heading">
              <div>
                <span className="schedule-kicker">02 · EXPEDIENTE BASE</span>
                <h3>Horário padrão</h3>
                <p className="muted" style={muted}>
                  Usado nos dias marcados como Padrão.
                </p>
              </div>
              <Button small variant="ghost" onClick={() => editStaff(person.id)}>
                Editar padrão <Icon name="pencil" />
              </Button>
            </div>
            <div className="base-hours">
              <div className="base-time">
                <span>Entrada</span>
                <strong>{person.start}</strong>
              </div>
              <span className="base-arrow">
                <Icon name="arrowRight" />
              </span>
              <div className="base-time">
                <span>Saída</span>
                <strong>{person.end}</strong>
              </div>
              <div className="base-copy">
                <strong>Configuração rápida</strong>
                <small>
                  Aplicar o expediente padrão de segunda a sábado, mantendo o domingo fechado.
                </small>
                <Button small onClick={resetWeek}>
                  <Icon name="refresh" /> Aplicar à semana
                </Button>
              </div>
            </div>
          </div>
          <div className="schedule-panel">
            <div className="schedule-heading">
              <div>
                <span className="schedule-kicker">03 · PERSONALIZE A SEMANA</span>
                <h3>Dias de atendimento</h3>
                <p className="muted" style={muted}>
                  Altere somente os dias que forem diferentes.
                </p>
              </div>
              <Chip>{`${open} dias ativos`}</Chip>
            </div>
            <div className="schedule-days">
              {WEEKDAYS_LONG.map((name, i) => (
                <DayRow
                  key={name}
                  name={name}
                  person={person}
                  spec={specs[i] ?? daySchedule(person, i)}
                  expanded={expandedHoursDay === i}
                  onToggleOpen={(isOpen) => {
                    const saved = person.weekly?.[String(i)];
                    changeDay(i, {
                      mode: isOpen ? (saved?.mode === "custom" ? "custom" : "default") : "closed",
                    });
                  }}
                  onToggleExpand={() => setExpandedHoursDay(expandedHoursDay === i ? null : i)}
                  onChange={(patch) => {
                    changeDay(i, patch);
                    setExpandedHoursDay(i);
                  }}
                />
              ))}
            </div>
            <div className="schedule-save-note">
              <Icon name="check" /> Alterações salvas automaticamente e refletidas no agendamento do
              cliente.
            </div>
          </div>
        </section>
        <aside className="schedule-aside">
          <div className="schedule-side-card">
            <span className="schedule-kicker">VISÃO GERAL</span>
            <h3>Resumo da agenda</h3>
            <div className="schedule-summary-person">
              <Avatar name={person.name} photo={person.photo} />
              <div>
                <strong>{person.name}</strong>
                <small>{person.role}</small>
              </div>
            </div>
            <div className="schedule-metrics">
              <div>
                <strong>
                  {open}
                  <small>/7</small>
                </strong>
                <span>dias abertos</span>
              </div>
              <div>
                <strong>{custom}</strong>
                <span>personalizados</span>
              </div>
            </div>
            <div className="schedule-mini-week">
              {WEEKDAYS_LONG.map((d, i) => {
                const mode = specs[i]?.mode;
                return (
                  <div key={d}>
                    <span>{d.slice(0, 3)}</span>
                    <i
                      className={
                        mode === "closed" ? "closed" : mode === "custom" ? "custom" : "normal"
                      }
                    ></i>
                  </div>
                );
              })}
            </div>
            <div className="schedule-key">
              <span>
                <i className="normal"></i> Padrão
              </span>
              <span>
                <i className="custom"></i> Personalizado
              </span>
              <span>
                <i className="closed"></i> Fechado
              </span>
            </div>
          </div>
          <div className="schedule-side-card schedule-help">
            <strong>Como funciona?</strong>
            <p>
              Horário padrão é a rotina habitual. Use <b>Ajustar</b> para mudar apenas um dia, ou
              desligue a chave quando não houver expediente.
            </p>
            <p>
              Feriados, férias e fechamentos em datas específicas devem ser configurados em{" "}
              <b>Avisos e bloqueios</b>.
            </p>
            <Button small variant="ghost" onClick={() => setSection("notices")}>
              Ver avisos e bloqueios <Icon name="arrowRight" />
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
