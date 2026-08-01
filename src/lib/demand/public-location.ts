/** Quita calle, número y metadatos; deja barrio/comuna + ciudad. */
export function publicPropertyLocation(
  neighborhood: string,
  address?: string,
): string {
  const barrio = neighborhood.trim();
  const city = cityFromChileanAddress(address) ?? "Santiago";
  if (!barrio) return city;
  if (barrio.toLowerCase().includes(city.toLowerCase())) return barrio;
  return `${barrio}, ${city}`;
}

function cityFromChileanAddress(address?: string): string | null {
  if (!address) return null;

  if (/regi[oó]n metropolitana/i.test(address)) return "Santiago";

  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]!;
    if (/^regi[oó]n/i.test(part) || /^chile$/i.test(part)) continue;
    if (/^santiago$/i.test(part)) return "Santiago";
    if (i === 1 && parts.length <= 3) return part;
  }

  return null;
}
