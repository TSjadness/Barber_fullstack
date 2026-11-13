import { ServiceForm } from "./components/ServiceForm";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { ManageRow } from "@/components/ManageRow";
import { RowAction, RowActions } from "@/components/RowActions";
import { PageHead } from "@/components/PageHead";
import { Pagination } from "@/components/Pagination";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { findService, serviceIdsOf } from "@/scripts/scheduling";
import type { Service } from "@/types/barber";
import { money } from "@/utils/format";
import { paginate } from "@/utils/pagination";
import { serviceIconName } from "@/utils/serviceIcon";

/** Catálogo de serviços exibido no site público. */
export function ServicesSection() {
  const db = useDb();
  const { update } = useBarberData();
  const { pages, setPage } = useAdminState();
  const { openModal, closeModal } = useOverlay();
  const confirm = useConfirm();
  const paged = paginate(db.services, pages.services);

  const edit = (id?: string) => {
    const current = id ? findService(db, id) : undefined;
    const save = (data: Service) => {
      if (!data.name || data.duration < 10) return notifyError("Confira os dados do serviço.");
      update((draft) => {
        const existing = id ? draft.services.find((s) => s.id === id) : undefined;
        if (existing) Object.assign(existing, data);
        else draft.services.push(data);
      });
      closeModal();
      notify("Serviço atualizado no site!");
    };
    openModal(
      id ? "Editar serviço" : "Novo serviço",
      <ServiceForm service={current} onSubmit={save} />,
    );
  };

  /** Exclusão só de serviços sem agendamentos (o servidor aplica a mesma regra). */
  const remove = (id: string) => {
    const s = findService(db, id);
    if (!s) return;
    if (db.bookings.some((b) => serviceIdsOf(b).includes(id)))
      return notifyError(
        "Este serviço possui agendamentos e não pode ser excluído. Desative-o para ocultá-lo do site.",
      );
    confirm({
      title: "Excluir serviço",
      message: (
        <>
          <strong>{s.name}</strong> será excluído do catálogo.
        </>
      ),
      detail: "O serviço deixa de aparecer no site e na gestão. Essa ação não pode ser desfeita.",
      onConfirm: () => {
        update((draft) => {
          draft.services = draft.services.filter((x) => x.id !== id);
        });
        notify("Serviço excluído.");
      },
    });
  };

  return (
    <>
      <PageHead
        title="Serviços"
        subtitle="Edite o catálogo que aparece imediatamente no site público."
      >
        <Button variant="primary" onClick={() => edit()}>
          <Icon name="plus" /> Adicionar serviço
        </Button>
      </PageHead>
      <Card className="bf-service-list">
        {paged.items.map((s) => (
          <ManageRow key={s.id} className="bf-service-row">
            <div className="bf-service-details">
              <strong>
                <Icon name={serviceIconName(s)} />
                {` ${s.name}`}
              </strong>
              <p>
                {`${s.duration} min • ${money(s.price)} • ${s.active ? "Visível no site" : "Oculto no site"}`}
              </p>
            </div>
            <RowActions stacked>
              <RowAction
                icon="pencil"
                label="Editar"
                title={`Editar ${s.name}`}
                onClick={() => edit(s.id)}
              />
              <RowAction
                icon="trash"
                label="Excluir"
                variant="danger"
                title={`Excluir ${s.name}`}
                onClick={() => remove(s.id)}
              />
            </RowActions>
          </ManageRow>
        ))}
        <Pagination meta={paged} label="serviços" onPage={(n) => setPage("services", n)} />
      </Card>
    </>
  );
}
