import type { Locale } from "@/lib/i18n/locale";

/** Umbral: “a pasos” vs “buena ubicación / fácil acceso”. */
const STEPS_MAX_MIN = 10;
const NEARBY_MAX_MIN = 22;

function t(locale: Locale, es: string, en: string, pt: string): string {
  if (locale === "en") return en;
  if (locale === "pt") return pt;
  return es;
}

/** Frase corta para hero / share / trust (sin minutos). */
export function stayNearStadiumPhrase(
  mins: number,
  locale: Locale,
  venue = "Estadio Nacional",
): string {
  if (mins <= STEPS_MAX_MIN) {
    return t(
      locale,
      `Quédate a pasos del ${venue}`,
      `Stay steps from ${venue}`,
      `Fique a passos do ${venue}`,
    );
  }
  if (mins <= NEARBY_MAX_MIN) {
    return t(
      locale,
      `Buena ubicación con fácil acceso al ${venue}`,
      `Great location with easy access to ${venue}`,
      `Boa localização com fácil acesso ao ${venue}`,
    );
  }
  return t(
    locale,
    `Buena ubicación · fácil acceso al ${venue} y cercanía al barrio del evento`,
    `Great location · easy access to ${venue} and close to the event area`,
    `Boa localização · fácil acesso ao ${venue} e perto do bairro do evento`,
  );
}

/** Headline corto (sin “X min”). */
export function guerrerasHeadlineProximity(
  mins: number,
  locale: Locale,
): string {
  if (mins <= STEPS_MAX_MIN) {
    return t(
      locale,
      "Apoya a las Guerreras: el Mundial histórico en casa — quédate a pasos del Estadio Nacional",
      "Cheer on the Guerreras: Chile's historic World Cup at home — stay steps from Estadio Nacional",
      "Apoie as Guerreiras: o Mundial histórico em casa — fique a passos do Estadio Nacional",
    );
  }
  return t(
    locale,
    "Apoya a las Guerreras: el Mundial histórico en casa — buena ubicación y fácil acceso al Estadio",
    "Cheer on the Guerreras: Chile's historic World Cup at home — great location, easy stadium access",
    "Apoie as Guerreiras: o Mundial histórico em casa — boa localização e fácil acesso ao Estádio",
  );
}

/** Línea de estadía para share-card / snapshot. */
export function staySnapshotLine(
  mins: number,
  neighborhood: string | undefined,
  locale: Locale,
): string {
  const barrio = neighborhood?.trim() || "Ñuñoa";
  if (mins <= STEPS_MAX_MIN) {
    return t(
      locale,
      `${barrio} · a pasos del Estadio`,
      `${barrio} · steps from the stadium`,
      `${barrio} · a passos do Estádio`,
    );
  }
  if (mins <= NEARBY_MAX_MIN) {
    return t(
      locale,
      `${barrio} · fácil acceso al Estadio`,
      `${barrio} · easy access to the stadium`,
      `${barrio} · fácil acesso ao Estádio`,
    );
  }
  return t(
    locale,
    `${barrio} · buena ubicación · cerca del Estadio`,
    `${barrio} · great location · near the stadium`,
    `${barrio} · boa localização · perto do Estádio`,
  );
}

/** Primer bullet del pitch de un alojamiento (por distancia). */
export function propertyStadiumProximity(
  mins: number,
  locale: Locale,
): string {
  if (mins <= STEPS_MAX_MIN) {
    return t(
      locale,
      "A pasos del Estadio Nacional",
      "Steps from Estadio Nacional",
      "A passos do Estadio Nacional",
    );
  }
  if (mins <= NEARBY_MAX_MIN) {
    return t(
      locale,
      "Buena ubicación · fácil acceso al Estadio Nacional",
      "Great location · easy access to Estadio Nacional",
      "Boa localização · fácil acesso ao Estadio Nacional",
    );
  }
  return t(
    locale,
    "Buena ubicación · fácil acceso al Estadio y cercanía al barrio del evento",
    "Great location · easy stadium access and close to the event area",
    "Boa localização · fácil acesso ao Estádio e perto do bairro do evento",
  );
}

/** Highlights para lista de alojamientos (sin “X min”). */
export function guerrerasLocationHighlights(
  mins: number,
  metroStations: string[],
  neighborhood: string,
  locale: Locale,
): string[] {
  const items = [propertyStadiumProximity(mins, locale)];
  const metros = metroStations
    .slice(0, 2)
    .map((s) => (s.startsWith("Metro ") ? s.replace(/^Metro\s+/i, "") : s));
  if (metros.length > 0) {
    const label = metros.join(" / ");
    items.push(
      t(
        locale,
        `Metro ${label}`,
        `Metro ${label}`,
        `Metrô ${label}`,
      ),
    );
  }
  items.push(
    t(
      locale,
      `${neighborhood}: barrio seguro y bien conectado`,
      `${neighborhood}: safe, well-connected neighborhood`,
      `${neighborhood}: bairro seguro e bem conectado`,
    ),
  );
  return items.slice(0, 3);
}
