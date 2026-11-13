import { useStaffEditor } from "./useStaffEditor";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { ManageRow } from "@/components/ManageRow";
import { PageHead } from "@/components/PageHead";
import { Pagination } from "@/components/Pagination";
import { WEEKDAYS_SHORT } from "@/constants/barber";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { notify, notifyError } from "@/scripts/notifications";
import { activeBookings, findStaff, isOwnerStaff } from "@/scripts/scheduling";
import { todayIso } from "@/utils/date";
import { paginate } from "@/utils/pagination";

/** Equipe: cadastro, edição e remoção de profissionais. */
export function StaffSection() {
  const db = useDb();
  const { update } = useBarberData();
  const { pages, setPage } = useAdminState();
  const confirm = useConfirm();
  const edit = useStaffEditor();
  const paged = paginate(db.staff, pages.staff);

  const remove = (id: string) => {
    const p = findStaff(db, id);
    if (!p || isOwnerStaff(p)) return notifyError("O cadastro do dono não pode ser removido.");
    const today = todayIso();
    if (activeBookings(db).some((b) => b.staffId === id && b.date >= today))
      return notify(
        "Este profissional tem agendamentos futuros. Cancele ou transfira antes de remover.",
      );
    confirm({
      title: "Remover profissional",
      message: (
        <>
          <strong>{p.name}</strong> será removido da equipe.
        </>
      ),
      detail:
        "Essa ação apaga o cadastro do profissional desta lista. Se quiser continuar, confirme abaixo.",
      onConfirm: () => {
        update((state) => {
          state.staff = state.staff.filter((x) => x.id !== id);
        });
        notify("Profissional removido.");
      },
    });
  };

  return (
    <>
      <PageHead
        title="Profissionais"
        subtitle="Cadastre profissionais e o horário padrão. Ajuste cada dia em Horários da semana."
      >
        <Button variant="primary" onClick={() => edit()}>
          <Icon name="plus" /> Novo profissional
        </Button>
      </PageHead>
      <Card className="bf-staff-list">
        {paged.items.map((p) => {
          const owner = isOwnerStaff(p);
          return (
            <ManageRow key={p.id} className="bf-staff-row">
              <div className="bf-staff-main">
                <div className="bf-staff-content">
                  <Avatar name={p.name} photo={p.photo} />
                  <div className="bf-staff-details">
                    <div className="bf-staff-name-line">
                      <strong>{p.name}</strong>
                      <span className={`bf-staff-badge ${p.active ? "is-active" : "is-inactive"}`}>
                        {p.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="bf-staff-role">{p.role}</p>
                    <div className="bf-staff-inline-meta">
                      <span className="bf-staff-hours">
                        <Icon name="clock" />
                        {` ${p.start}–${p.end}`}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="bf-staff-days">
                  {`Dias: ${p.days.map((i) => WEEKDAYS_SHORT[i]).join(", ")}`}
                </p>
              </div>
              <div className="bf-staff-actions">
                <Button
                  small
                  variant="ghost"
                  className="bf-staff-edit"
                  onClick={() => edit(p.id)}
                  title={`Editar ${p.name}`}
                  aria-label={`Editar ${p.name}`}
                >
                  <span className="bf-action-icon" aria-hidden="true">
                    <Icon name="pencil" />
                  </span>
                  <span className="bf-action-label">Editar</span>
                </Button>
                <Button
                  small
                  variant="danger"
                  className="bf-staff-remove"
                  disabled={owner}
                  title={owner ? "O cadastro do dono não pode ser removido" : `Remover ${p.name}`}
                  onClick={owner ? undefined : () => remove(p.id)}
                  aria-label={owner ? "Não é possível remover o proprietário" : `Remover ${p.name}`}
                >
                  <span className="bf-action-icon" aria-hidden="true">
                    <Icon name="trash" />
                  </span>
                  <span className="bf-action-label">Excluir</span>
                </Button>
              </div>
            </ManageRow>
          );
        })}
        <Pagination meta={paged} label="profissionais" onPage={(n) => setPage("staff", n)} />
      </Card>
    </>
  );
}
