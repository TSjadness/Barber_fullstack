/** Utilitários de data/hora no formato usado pelos dados (`AAAA-MM-DD` e `HH:MM`). */

const pad = (n: number) => String(n).padStart(2, "0");

/** Data local no formato ISO curto (`AAAA-MM-DD`). */
export const toIsoDate = (d: Date | string | number) => {
  const a = new Date(d);
  return `${a.getFullYear()}-${pad(a.getMonth() + 1)}-${pad(a.getDate())}`;
};

export const todayIso = () => toIsoDate(new Date());

/** Meio-dia evita que o fuso horário mude o dia ao converter a data. */
const atNoon = (date: string) => new Date(date + "T12:00:00");

export const addDays = (date: string, n: number) => {
  const d = atNoon(date);
  d.setDate(d.getDate() + n);
  return toIsoDate(d);
};

/** Ex.: `12 de novembro de 2026`. */
export const prettyDate = (date: string) =>
  atNoon(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

/** Ex.: `12/11/2026`. */
export const shortDate = (date: string) => atNoon(date).toLocaleDateString("pt-BR");

export const weekdayOf = (date: string) => atNoon(date).getDay();

export const toMinutes = (time: string) => {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
};

export const toClock = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/** Minutos decorridos no dia atual. */
export const nowMinutes = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};

/** `AAAA-MM` de uma data mensal (aceita mês fora do intervalo, como o construtor de Date). */
export const monthKey = (year: number, monthIndex: number) => {
  const d = new Date(year, monthIndex, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const parseMonthKey = (key: string) => {
  const [y = "0", m = "1"] = key.split("-");
  return { year: Number(y), month: Number(m) };
};

/** Troca ano e/ou mês de uma data mantendo o dia (limitado ao último dia do mês). */
export function setYearMonth(date: string, year: number | null, monthIndex: number | null) {
  const y = year ?? Number(date.slice(0, 4));
  const m = monthIndex ?? Number(date.slice(5, 7)) - 1;
  const d = Math.min(Number(date.slice(8, 10)), new Date(y, m + 1, 0).getDate());
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const firstWeekdayOfMonth = (year: number, month: number) =>
  new Date(year, month - 1, 1).getDay();
