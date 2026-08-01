/** Rango YYYY-MM-DD de un mes calendario. */
export function monthRange(year: number, monthIndex: number) {
  const start = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const endDate = new Date(year, monthIndex + 1, 0);
  const end = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  return { start, end };
}

/**
 * Mes por defecto en selectores: hoy + 1 día.
 * Así, el último día del mes ya mira el mes siguiente.
 */
export function defaultPlanningMonth(from = new Date()): {
  year: number;
  monthIndex: number;
} {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export function parseMonthParam(
  yearRaw: string | undefined,
  monthRaw: string | undefined,
): { year: number; monthIndex: number } {
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (
    Number.isFinite(year) &&
    year >= 2020 &&
    year <= 2100 &&
    Number.isFinite(month) &&
    month >= 1 &&
    month <= 12
  ) {
    return { year, monthIndex: month - 1 };
  }
  return defaultPlanningMonth();
}

export const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;
