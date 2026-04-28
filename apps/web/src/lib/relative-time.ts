const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });

const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

export function formatRelative(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);

  for (const { unit, ms } of UNITS) {
    if (absMs >= ms || unit === "second") {
      const value = Math.round(diffMs / ms);
      return formatter.format(value, unit);
    }
  }

  return formatter.format(0, "second");
}
