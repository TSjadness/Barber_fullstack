import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { cx } from "@/utils/classNames";
import { pageWindow, type Page } from "@/utils/pagination";

interface PaginationProps {
  meta: Page<unknown>;
  /** Nome dos itens no plural (ex.: "agendamentos"). */
  label: string;
  onPage: (page: number) => void;
}

/**
 * Paginação das listagens: resumo + anterior/próxima no desktop e números de
 * página (até cinco vizinhas, com reticências) no mobile.
 */
export function Pagination({ meta, label, onPage }: PaginationProps) {
  const { currentPage: current, totalPages } = meta;
  const { first, last } = pageWindow(current, totalPages);
  const numbers = [];
  for (let i = first; i <= last; i++) numbers.push(i);
  const pageButton = (n: number) => (
    <button
      key={n}
      type="button"
      className={cx("bf-page-number", n === current && "is-current")}
      onClick={() => onPage(n)}
      aria-current={n === current ? "page" : undefined}
      aria-label={`Pagina ${n}`}
    >
      {n}
    </button>
  );
  return (
    <div className="bf-pagination">
      <span className="bf-pagination-summary">
        {meta.total ? `${meta.start}–${meta.end} de ${meta.total} ${label}` : `0 ${label}`}
      </span>
      <div className="bf-pagination-actions bf-pagination-desktop">
        <Button
          type="button"
          small
          variant="ghost"
          onClick={() => onPage(current - 1)}
          disabled={current <= 1}
        >
          <Icon name="chevLeft" /> Anterior
        </Button>
        <span className="bf-pagination-page">{`Página ${current} de ${totalPages}`}</span>
        <Button
          type="button"
          small
          variant="ghost"
          onClick={() => onPage(current + 1)}
          disabled={current >= totalPages}
        >
          Próxima <Icon name="chevRight" />
        </Button>
      </div>
      <nav className="bf-pagination-mobile" aria-label={`Paginas de ${label}`}>
        <button
          type="button"
          className="bf-page-arrow"
          onClick={() => onPage(current - 1)}
          disabled={current <= 1}
          aria-label="Pagina anterior"
        >
          <Icon name="chevLeft" />
        </button>
        {first > 1 && pageButton(1)}
        {first > 2 && (
          <span className="bf-page-ellipsis" aria-hidden="true">
            …
          </span>
        )}
        {numbers.map(pageButton)}
        {last < totalPages - 1 && (
          <span className="bf-page-ellipsis" aria-hidden="true">
            …
          </span>
        )}
        {last < totalPages && pageButton(totalPages)}
        <button
          type="button"
          className="bf-page-arrow"
          onClick={() => onPage(current + 1)}
          disabled={current >= totalPages}
          aria-label="Proxima pagina"
        >
          <Icon name="chevRight" />
        </button>
      </nav>
    </div>
  );
}
