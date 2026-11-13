import { NoticeForm } from "./components/NoticeForm";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/Card";
import { PageHead } from "@/components/PageHead";
import { Pagination } from "@/components/Pagination";
import { useAdminState } from "@/hooks/useAdminState";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { useConfirm } from "@/hooks/useConfirm";
import { useOverlay } from "@/hooks/useOverlay";
import { notify, notifyError } from "@/scripts/notifications";
import { findStaff } from "@/scripts/scheduling";
import type { Notice } from "@/types/barber";
import { prettyDate } from "@/utils/date";
import { paginate } from "@/utils/pagination";

/** Avisos (informativos) e bloqueios de agenda por data. */
export function NoticesSection() {
  const db = useDb();
  const { update } = useBarberData();
  const confirm = useConfirm();
  const { pages, setPage } = useAdminState();
  const { openModal, closeModal } = useOverlay();
  const ordered = db.notices.slice().sort((a, b) => a.date.localeCompare(b.date));
  const paged = paginate(ordered, pages.notices);

  const edit = (id?: string) => {
    const current = db.notices.find((x) => x.id === id);
    const save = (data: Notice) => {
      if (!data.title || !data.date) return notifyError("Preencha data e título.");
      update((state) => {
        const existing = id ? state.notices.find((n) => n.id === id) : undefined;
        if (existing) Object.assign(existing, data);
        else state.notices.push(data);
      });
      closeModal();
      notify("Aviso publicado no agendamento!");
    };
    openModal(
      id ? "Editar aviso" : "Novo aviso / bloqueio",
      <NoticeForm notice={current} onSubmit={save} />,
    );
  };
  const remove = (id: string) => {
    const notice = db.notices.find((n) => n.id === id);
    confirm({
      title: "Excluir aviso",
      message: (
        <>
          Excluir o aviso <strong>{notice?.title || "sem título"}</strong>?
        </>
      ),
      detail:
        notice?.type === "block"
          ? "O bloqueio deixa de valer e o dia volta a aceitar reservas."
          : "O aviso deixa de aparecer no agendamento.",
      onConfirm: () => {
        update((state) => {
          state.notices = state.notices.filter((n) => n.id !== id);
        });
        notify("Aviso excluído.");
      },
    });
  };

  return (
    <>
      <PageHead
        title="Avisos e bloqueios"
        subtitle="Comunique indisponibilidades e impeça reservas quando necessário."
      >
        <Button variant="primary" onClick={() => edit()}>
          <Icon name="plus" /> Criar aviso
        </Button>
      </PageHead>
      <Card>
        <p className="muted">
          Avisos informativos aparecem na seleção da data. Bloqueios também removem os horários
          disponíveis do profissional ou de toda a equipe.
        </p>
        {paged.items.map((n) => (
          <div key={n.id} className="notice-row">
            <div>
              <strong>{n.title}</strong>
              <p>
                {`${prettyDate(n.date)} • ${n.type === "block" ? "Bloqueia agenda" : "Somente informa"} • ${n.staffId === "all" ? "Todos os profissionais" : (findStaff(db, n.staffId)?.name ?? "")}`}
              </p>
              <p>{n.detail}</p>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <Button small onClick={() => edit(n.id)}>
                Editar
              </Button>
              <Button small variant="danger" onClick={() => remove(n.id)}>
                Excluir
              </Button>
            </div>
          </div>
        ))}
        <Pagination meta={paged} label="avisos" onPage={(page) => setPage("notices", page)} />
      </Card>
    </>
  );
}
