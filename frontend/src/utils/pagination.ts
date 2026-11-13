import { PAGE_SIZE } from "@/constants/barber";

export interface Page<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  /** Posição (1-based) do primeiro item exibido; 0 quando não há itens. */
  start: number;
  end: number;
}

export const totalPagesOf = (totalItems: number, size = PAGE_SIZE) =>
  Math.max(1, Math.ceil(totalItems / size));

/** Mantém a página pedida dentro do intervalo válido. */
export const clampPage = (page: number, totalItems: number, size = PAGE_SIZE) =>
  Math.min(Math.max(page || 1, 1), totalPagesOf(totalItems, size));

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): Page<T> {
  const totalPages = totalPagesOf(items.length, size);
  const currentPage = clampPage(page, items.length, size);
  const start = (currentPage - 1) * size;
  return {
    items: items.slice(start, start + size),
    total: items.length,
    currentPage,
    totalPages,
    start: items.length ? start + 1 : 0,
    end: Math.min(start + size, items.length),
  };
}

/** Janela de até cinco páginas vizinhas usada na paginação mobile. */
export function pageWindow(current: number, totalPages: number, windowSize = 5) {
  const first = Math.max(1, Math.min(current - 2, totalPages - windowSize + 1));
  const last = Math.min(totalPages, first + windowSize - 1);
  return { first, last };
}
